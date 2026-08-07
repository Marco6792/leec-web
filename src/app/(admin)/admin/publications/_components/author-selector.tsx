"use client";

import { useState, useRef } from "react";
import { X, GripVertical, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface AuthorEntry {
  profileId: string;
  fullName: string;
  affiliation: string;
  corresponding: boolean;
}

interface AuthorSelectorProps {
  value: AuthorEntry[];
  onChange: (authors: AuthorEntry[]) => void;
  profiles: { id: string; fullName: string; title: string | null; institution: string | null }[];
}

export function AuthorSelector({ value = [], onChange, profiles }: AuthorSelectorProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = profiles.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) &&
      !value.some((a) => a.profileId === p.id)
  );

  function addAuthor(profile: typeof profiles[0]) {
    onChange([
      ...value,
      {
        profileId: profile.id,
        fullName: profile.fullName,
        affiliation: profile.institution ?? "",
        corresponding: false,
      },
    ]);
    setSearch("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function removeAuthor(profileId: string) {
    onChange(value.filter((a) => a.profileId !== profileId));
  }

  function toggleCorresponding(profileId: string) {
    onChange(
      value.map((a) =>
        a.profileId === profileId ? { ...a, corresponding: !a.corresponding } : a
      )
    );
  }

  function updateAffiliation(profileId: string, affiliation: string) {
    onChange(
      value.map((a) =>
        a.profileId === profileId ? { ...a, affiliation } : a
      )
    );
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index >= value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {/* Author list */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((author, i) => (
            <div
              key={author.profileId}
              className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2.5"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                >
                  <GripVertical className="h-3 w-3 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={i === value.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                >
                  <GripVertical className="h-3 w-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{author.fullName}</span>
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                </div>
                <Input
                  type="text"
                  value={author.affiliation}
                  onChange={(e) => updateAffiliation(author.profileId, e.target.value)}
                  placeholder="Affiliation (optional)"
                  className="mt-1 h-6 px-2 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => toggleCorresponding(author.profileId)}
                className={`shrink-0 rounded p-1.5 transition-colors cursor-pointer ${
                  author.corresponding
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                title="Corresponding author"
              >
                <Mail className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeAuthor(author.profileId)}
                className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add author search */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search lab members to add as authors..."
        />
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-popover p-1 shadow-md">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addAuthor(p);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <span className="truncate">{p.fullName}</span>
                {p.title && (
                  <span className="ml-auto text-xs text-muted-foreground shrink-0">{p.title}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hidden inputs for form submission */}
      {value.map((author, i) => (
        <input
          key={author.profileId}
          type="hidden"
          name={`author_${i}`}
          value={JSON.stringify(author)}
        />
      ))}
      <input type="hidden" name="authorCount" value={value.length.toString()} />
    </div>
  );
}
