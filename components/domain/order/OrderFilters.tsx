"use client";

import { useState } from "react";

interface OrderFiltersProps {
  onFilterChange?: (filters: { search: string; status: string; date: string }) => void;
}

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    date: ''
  });

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4 md:flex-row md:items-center">
      <input
        type="text"
        placeholder="Search orders..."
        className="w-full rounded-md bg-primary/60 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none md:max-w-xs"
        onChange={(e) => handleChange('search', e.target.value)}
      />
      <select 
        className="w-full rounded-md bg-primary/60 px-4 py-2 text-sm text-white outline-none md:max-w-xs"
        onChange={(e) => handleChange('status', e.target.value)}
      >
        <option value="ALL">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="IN_TRANSIT">In Transit</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <input
        type="date"
        className="w-full rounded-md bg-primary/60 px-4 py-2 text-sm text-white outline-none md:max-w-xs"
        onChange={(e) => handleChange('date', e.target.value)}
      />
    </div>
  );
}
