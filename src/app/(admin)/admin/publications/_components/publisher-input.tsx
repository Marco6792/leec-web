"use client";

import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => removePublisher(pub)}
              aria-label={`Remove ${pub}`}
              className="rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
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
          className="min-w-[120px] flex-1 bg-transparent outline-none border-0 focus:ring-0 placeholder:text-muted-foreground"
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="max-h-40 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md">
          {filtered.map((s) => (
            <Button
              key={s}
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onMouseDown={(e) => {
                e.preventDefault();
                addPublisher(s);
              }}
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              {s}
            </Button>
          ))}
        </div>
      )}
      <input type="hidden" name="publisher" value={value.join(", ")} />
    </div>
  );
}
