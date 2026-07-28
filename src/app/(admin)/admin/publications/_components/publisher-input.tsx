"use client";

import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PublisherInputProps {
  value: string[];
  onChange: (publishers: string[]) => void;
  suggestions?: string[];
}

export function PublisherInput({ value = [], onChange, suggestions = [] }: PublisherInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  );

  function addPublisher(name: string) {
    const trimmed = name.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function removePublisher(name: string) {
    onChange(value.filter((p) => p !== name));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addPublisher(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removePublisher(value[value.length - 1]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 min-h-[38px]">
        {value.map((pub) => (
          <Badge key={pub} variant="secondary" className="gap-1 pr-1">
            {pub}
            <button
              type="button"
              onClick={() => removePublisher(pub)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-muted cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Add publishers..." : ""}
          className="min-w-[120px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="max-h-40 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addPublisher(s);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              {s}
            </button>
          ))}
        </div>
      )}
      <input type="hidden" name="publisher" value={value.join(", ")} />
    </div>
  );
}
