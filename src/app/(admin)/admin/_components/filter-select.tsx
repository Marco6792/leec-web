"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  paramKey: string;
  options: FilterOption[];
  placeholder?: string;
  currentValue?: string;
}

export function FilterSelect({
  paramKey,
  options,
  placeholder = "All",
  currentValue,
}: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(paramKey, value);
      } else {
        params.delete(paramKey);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams, paramKey],
  );

  return (
    <select
      defaultValue=""
      value={currentValue ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
