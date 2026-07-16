"use client";

import { useRouter } from "next/navigation";
import { Shield, Mail, Crown } from "lucide-react";
import type { AccountAdminResponse } from "@/lib/api/admin-accounts";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { useState } from "react";
import AdminTable from "@/components/ui/AdminTable";
import PageHeader from "@/components/ui/PageHeader";
import FilterSortBar from "@/components/ui/FilterSortBar";

const ROLE_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  "Super Admin": { color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
  Admin: { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" },
  Player: { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const columns = [
  {
    key: "userName",
    label: "Admin",
    sortable: true,
    render: (_: unknown, admin: AccountAdminResponse) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 border border-red-500/30">
          <Shield className="w-4 h-4 text-red-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{admin.userName}</p>
          <p className="text-xs text-gray-600 font-mono">#{admin.accountId}</p>
        </div>
      </div>
    ),
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    render: (val: string) => (
      <div className="flex items-center gap-2">
        <Mail className="w-3.5 h-3.5 text-gray-600 shrink-0" />
        <p className="text-sm text-gray-400 truncate max-w-[220px]">{val}</p>
      </div>
    ),
  },
  {
    key: "roleName",
    label: "Role",
    sortable: true,
    render: (val: string) => {
      const roleCfg = ROLE_CONFIG[val] ?? ROLE_CONFIG["Admin"];
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}>
          <Crown className="w-3 h-3" />
          {val}
        </span>
      );
    },
  },
  {
    key: "isActive",
    label: "Status",
    sortable: true,
    render: (val: boolean) => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        val ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${val ? "bg-green-400" : "bg-red-400"}`} />
        {val ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (val: string | null) => (
      <span className="text-xs text-gray-500">{formatDate(val)}</span>
    ),
  },
];

export default function ManageAdminsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("accountId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const buildParams = (overrides: Record<string, string | number | boolean | undefined> = {}) => ({
    roleName: "Admin",
    ...(search ? { search } : {}),
    ...(statusFilter ? { isActive: statusFilter === "active" } : {}),
    sortBy,
    sortOrder,
    ...overrides,
  });

  const {
    data: admins,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<AccountAdminResponse>({
    endpoint: "/api/adminaccounts",
    pageSize: 10,
    params: buildParams(),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setParams(buildParams({ search: value || undefined }));
  };

  const handleFilterChange = (_key: string, value: string) => {
    setStatusFilter(value);
    setPage(1);
    setParams(buildParams({ isActive: value ? value === "active" : undefined }));
  };

  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);
    setParams(buildParams({ sortBy: value, sortOrder: nextOrder }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Admins"
        subtitle="Manage admin and moderator accounts"
        icon={Shield}
        actions={[
          {
            label: "Create Admin",
            icon: Shield,
            onClick: () => router.push("/manage-admins/create"),
          },
        ]}
      />

      <FilterSortBar
        search={{ placeholder: "Search by username...", icon: Shield, value: search, onChange: handleSearch }}
        filters={[
          {
            key: "status",
            label: "All Status",
            value: statusFilter,
            onChange: (v) => handleFilterChange("status", v),
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ]}
      />

      <AdminTable
        title="Admins List"
        columns={columns}
        data={admins}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No admins found"
        emptyHint="Try a different search or status filter."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(admin) => router.push(`/manage-admins/update?id=${admin.accountId}`)}
        idField="accountId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
