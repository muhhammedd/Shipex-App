"use client";

import { useState } from "react";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Search, Calendar } from "lucide-react";

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

  const statusOptions = [
    { label: "All Status", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "In Transit", value: "IN_TRANSIT" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4 md:flex-row md:items-center">
      <div className="w-full md:max-w-xs">
        <Input
          placeholder="Search orders..."
          leftIcon={<Search className="h-4 w-4" />}
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>
      <div className="w-full md:max-w-xs">
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        />
      </div>
      <div className="w-full md:max-w-xs">
        <Input
          type="date"
          leftIcon={<Calendar className="h-4 w-4" />}
          value={filters.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
      </div>
    </div>
  );
}
