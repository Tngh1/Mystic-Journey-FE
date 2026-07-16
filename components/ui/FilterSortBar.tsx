"use client";

import { Search } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterSortBarProps {
  search?: {
    placeholder?: string;
    icon?: React.ElementType;
    value?: string;
    onChange: (value: string) => void;
  };
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
}

export default function FilterSortBar({
  search,
  filters = [],
}: FilterSortBarProps) {
  const SearchIcon = search?.icon;

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        {search && (
          <div className="relative w-64 shrink-0">
            {SearchIcon && (
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            )}
            <input
              type="text"
              placeholder={search.placeholder ?? "Search..."}
              value={search.value ?? ""}
              onChange={(e) => search.onChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
          </div>
        )}

        {filters.map((filter) => (
          <select
            key={filter.key}
            aria-label={filter.label}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0 cursor-pointer"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
