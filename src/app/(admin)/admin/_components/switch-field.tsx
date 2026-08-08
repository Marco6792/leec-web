"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
  id?: string;
}

export function SwitchField({
  name,
  label,
  defaultChecked = false,
  id,
}: SwitchFieldProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center gap-3">
      <Switch
        id={id ?? name}
        checked={checked}
        onCheckedChange={setChecked}
      />
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <label htmlFor={id ?? name} className="text-sm cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
}
