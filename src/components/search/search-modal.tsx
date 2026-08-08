"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchStore } from "@/lib/stores/search";
import { getSearchDocuments } from "@/app/actions/search";
import { SearchDocument } from "@/lib/search/types";
import { Search as SearchIcon, FileText, FolderOpen, Newspaper, Calendar, Users, Monitor, GraduationCap, BookOpen, FlaskConical, ExternalLink, ArrowUpRight, X } from "lucide-react";
import { create, search, insertMultiple } from "@orama/orama";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  publication: { label: "Publications", icon: FileText, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  project: { label: "Projects", icon: FolderOpen, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  news: { label: "News", icon: Newspaper, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  event: { label: "Events", icon: Calendar, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  person: { label: "People", icon: Users, color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  equipment: { label: "Equipment", icon: Monitor, color: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
  training: { label: "Training", icon: GraduationCap, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  page: { label: "Documentation", icon: BookOpen, color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  research: { label: "Research", icon: FlaskConical, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  partner: { label: "Partners", icon: ExternalLink, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
};

export function SearchModal() {
  const isOpen = useSearchStore((s) => s.isOpen);
  const close = useSearchStore((s) => s.close);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const indexRef = useRef<unknown>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const buildIndex = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await getSearchDocuments();
      setDocumentsCount(docs.length);
      const index = await create({
        schema: {
          id: "string",
          type: "string",
          title: "string",
          description: "string",
          href: "string",
          category: "string",
          tags: "string[]",
          date: "string",
        },
      });
      await insertMultiple(index, docs);
      indexRef.current = index;
      setInitialized(true);
    } catch (error) {
      console.error("Failed to build search index:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      buildIndex(); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [initialized, buildIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!query.trim() || !indexRef.current) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const doSearch = async () => {
      try {
        const searchResults = await search(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          indexRef.current as any,
          {
            term: query,
            properties: ["title", "description", "tags", "category"],
            limit: 20,
          }
        );
        const hits = searchResults.hits.map((hit: { document: SearchDocument }) => hit.document);
        setResults(hits);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
    };

    const timer = setTimeout(doSearch, 150);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || results.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const doc = results[selectedIndex];
        if (doc) {
          window.location.href = doc.href;
          close();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, close]);

  const grouped = results.reduce<Record<string, SearchDocument[]>>((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {});

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) { close(); setQuery(""); setResults([]); setSelectedIndex(-1); } }}>
       <SheetContent side="top" className="w-full max-w-5xl h-[70vh] p-0 gap-0 flex flex-col overflow-hidden" style={{ left: '50%', right: 'auto', transform: 'translateX(-50%)' }}>
        <SheetHeader className="px-4 pt-4 pb-3 border-b flex flex-row items-center justify-between shrink-0">
          <div className="flex flex-col gap-0.5">
            <SheetTitle className="text-left text-base font-semibold">Search</SheetTitle>
            <SheetDescription className="text-left text-xs text-muted-foreground">
              Search across projects, publications, news, events, people, equipment, training, and documentation
            </SheetDescription>
          </div>
          <button
            onClick={close}
            className="size-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </SheetHeader>
        <div className="px-4 py-3 border-b shrink-0">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3">
            {loading && !initialized ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                Loading search index...
              </div>
            ) : results.length === 0 && query ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            ) : results.length === 0 && !query ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                Type to search across {documentsCount} items
              </div>
            ) : (
              Object.entries(grouped).map(([type, docs]) => {
                const config = typeConfig[type] || { label: type, icon: SearchIcon, color: "bg-muted text-muted-foreground" };
                const Icon = config.icon;
                return (
                  <div key={type} className="mb-4 last:mb-0">
                    <div className="px-1 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {config.label}
                    </div>
                    <div className="space-y-0.5">
                      {docs.map((doc) => {
                        const globalIndex = results.indexOf(doc);
                        return (
                          <button
                            key={`${doc.type}-${doc.id}`}
                            data-index={globalIndex}
                            onClick={() => {
                              window.location.href = doc.href;
                              close();
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer",
                              selectedIndex === globalIndex ? "bg-accent" : "hover:bg-accent/50"
                            )}
                          >
                            <div className={cn("flex items-center justify-center size-10 rounded-md shrink-0", config.color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
                              <span className="font-medium text-sm truncate w-full">{doc.title}</span>
                              {doc.description && (
                                <span className="text-xs text-muted-foreground line-clamp-2 w-full">
                                  {doc.description}
                                </span>
                              )}
                            </div>
                            {doc.category && (
                              <Badge variant="secondary" className="text-xs font-medium shrink-0">
                                {doc.category}
                              </Badge>
                            )}
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
