'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, User, Ban, CheckCircle, Edit2 } from 'lucide-react';
import { PlayerProfileResponse } from '@/lib/api/player-profiles';
import { banPlayer, unbanPlayer } from '@/lib/api/admin-accounts';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '@/lib/utils/swal';
import AdminTable from '@/components/ui/AdminTable';
import PageHeader from '@/components/ui/PageHeader';
import FilterSortBar from '@/components/ui/FilterSortBar';

const classColors: Record<string, string> = {
  Knight: 'text-red-400',
  Mage: 'text-purple-400',
  Archer: 'text-green-400',
};

export default function ManagePlayersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [sortBy, setSortBy] = useState('playerProfileId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [banningId, setBanningId] = useState<number | null>(null);

  const buildParams = (overrides: Record<string, string | number | boolean | undefined> = {}) => ({
    ...(searchTerm ? { search: searchTerm } : {}),
    ...(selectedClass ? { level: selectedClass } : {}),
    sortBy,
    sortOrder,
    ...overrides,
  });

  const {
    data: players,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<PlayerProfileResponse>({
    endpoint: '/api/playerprofiles',
    pageSize: 10,
    params: buildParams(),
  });

  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    setPage(1);
    setParams(buildParams({ search: keyword || undefined }));
  };

  const handleFilterChange = (_key: string, value: string) => {
    setSelectedClass(value);
    setPage(1);
    setParams(buildParams({ level: value || undefined }));
  };

  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);
    setParams(buildParams({ sortBy: value, sortOrder: nextOrder }));
  };

  const handleBan = async (player: PlayerProfileResponse) => {
    if (player.playerProfileId == null || player.accountId == null) return;

    const currentlyBanned = player.isBanned;
    const actionTitle = currentlyBanned ? 'Unban Player' : 'Ban Player';
    const actionMessage = currentlyBanned
      ? `Are you sure you want to unban player "${player.displayName}"?`
      : `Are you sure you want to ban player "${player.displayName}"?`;
    const confirmButtonText = currentlyBanned ? 'Yes, Unban Player' : 'Yes, Ban Player';

    const confirm = await showConfirmAlert(actionTitle, actionMessage, confirmButtonText, 'Cancel');
    if (!confirm.isConfirmed) return;

    try {
      setBanningId(player.playerProfileId);
      if (currentlyBanned) {
        await unbanPlayer(player.accountId);
        await showSuccessAlert('Unbanned!', `${player.displayName} has been unbanned.`);
      } else {
        await banPlayer(player.accountId);
        await showSuccessAlert('Banned!', `${player.displayName} has been banned.`);
      }
      // refresh() đọc lại isBanned từ BE — không cần state ban cục bộ (state đó mất khi F5).
      refresh();
    } catch (err) {
      await showErrorAlert('Error', err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBanningId(null);
    }
  };

  const columns = [
    { key: 'playerProfileId', label: 'ID', sortable: true },
    {
      key: 'displayName',
      label: 'Display Name',
      sortable: true,
      render: (_: unknown, player: PlayerProfileResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ffc032]/20 flex items-center justify-center shrink-0 overflow-hidden">
            {player.avatarUrl ? (
              <img src={player.avatarUrl} alt={player.displayName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-[#ffc032]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{player.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{player.accountEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'playerClass',
      label: 'Class',
      sortable: true,
      render: (val: string) => (
        <span className={`text-sm font-semibold ${classColors[val] || 'text-gray-300'}`}>{val}</span>
      ),
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true,
      render: (val: number) => <span className="text-sm font-semibold text-[#ffc032]">{val}</span>,
    },
    {
      key: 'gold',
      label: 'Gold',
      sortable: true,
      render: (val: number) => <span className="text-sm text-yellow-400">{Number(val).toLocaleString()}</span>,
    },
    {
      key: 'gems',
      label: 'Gems',
      sortable: true,
      render: (val: number) => <span className="text-sm text-blue-400">{Number(val).toLocaleString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (_: unknown, player: PlayerProfileResponse) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${player.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {player.isBanned ? 'Banned' : 'Active'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_: unknown, player: PlayerProfileResponse) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleBan(player)}
            disabled={banningId === player.playerProfileId}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              player.isBanned
                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
            }`}
            title={player.isBanned ? 'Unban' : 'Ban'}
          >
            {banningId === player.playerProfileId ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : player.isBanned ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Ban className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/manage-players/update?id=${player.playerProfileId ?? ''}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-xs font-semibold cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Update
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Players"
        subtitle="View and manage all player profiles"
        icon={User}
      />

      <FilterSortBar
        search={{ placeholder: 'Search by name...', icon: User, value: searchTerm, onChange: handleSearch }}
        filters={[
          {
            key: 'class',
            label: 'All Classes',
            value: selectedClass,
            onChange: (v) => handleFilterChange('class', v),
            options: [
              { value: 'Knight', label: 'Knight' },
              { value: 'Mage', label: 'Mage' },
              { value: 'Archer', label: 'Archer' },
            ],
          },
        ]}
      />

      <AdminTable
        title="Players List"
        columns={columns}
        data={players}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No players found"
        emptyHint="Try a different search or class filter."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        idField="playerProfileId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
