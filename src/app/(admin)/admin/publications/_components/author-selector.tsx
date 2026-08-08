"use client";

import { useState, useRef } from "react";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  <GripVertical className="h-3 w-3 rotate-180" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveDown(i)}
                  disabled={i === value.length - 1}
                  aria-label="Move down"
                >
                  <GripVertical className="h-3 w-3" />
                </Button>
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
              <Switch
                checked={author.corresponding}
                onCheckedChange={() => toggleCorresponding(author.profileId)}
                aria-label="Corresponding author"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => removeAuthor(author.profileId)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove author"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
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
              <Button
                key={p.id}
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addAuthor(p);
                }}
              >
                <span className="truncate">{p.fullName}</span>
                {p.title && (
                  <span className="ml-auto text-xs text-muted-foreground shrink-0">{p.title}</span>
                )}
              </Button>
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
