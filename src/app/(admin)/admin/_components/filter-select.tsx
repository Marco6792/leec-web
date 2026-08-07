"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { NativeSelect } from "@/components/ui/native-select";

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
    <NativeSelect
      value={currentValue ?? ""}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </NativeSelect>
  );
}
