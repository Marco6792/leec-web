"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Clock,
  Calendar,
  Users,
  Wrench,
  Search,
  ArrowRight,
  BookOpen,
  ChevronDown,
} from "lucide-react";

import { demoSessions } from "./_demo-data";

const sessions = demoSessions;

// ─── Equipment tags extracted from sessions ───────────────────────────────

const allEquipment = Array.from(new Set(sessions.flatMap((s) => s.equipment))).sort();
const levels = ["beginner", "intermediate", "advanced"] as const;
const statuses = ["open", "in_progress", "completed"] as const;

// ─── Status config ────────────────────────────────────────────────────────

const statusConfig = {
  draft: { label: "Pending Approval", color: "bg-muted text-muted-foreground" },
  pending_approval: { label: "Pending Approval", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  open: { label: "Open for Enrollment", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  completed: { label: "Completed", color: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-300" },
  cancelled: { label: "Cancelled", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
} as const;

const levelConfig = {
  beginner: { label: "Beginner", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  intermediate: { label: "Intermediate", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  advanced: { label: "Advanced", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
} as const;

// ─── Component ────────────────────────────────────────────────────────────

export default function TrainingPage() {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (levelFilter !== "all" && s.level !== levelFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (equipmentFilter !== "all" && !s.equipment.includes(equipmentFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.includes(q)) ||
          s.equipment.some((e) => e.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [levelFilter, statusFilter, equipmentFilter, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-muted/30 to-background py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Badge variant="outline" className="mb-6">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
            Training
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
            Hands-on{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Training
            </span>{" "}
            for Researchers
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Practical, equipment-focused training sessions led by LEEC supervisors. 
            Master research instruments, learn advanced techniques, and earn certifications.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{sessions.length}</span>
              <span className="text-sm text-muted-foreground">Sessions available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{allEquipment.length}</span>
              <span className="text-sm text-muted-foreground">Equipment types</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {sessions.reduce((sum, s) => sum + s.enrolledCount, 0)}
              </span>
              <span className="text-sm text-muted-foreground">Enrolled researchers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search training sessions..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Level filter */}
              <div className="relative">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  aria-label="Filter by level"
                  className="appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                  className="appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {statusConfig[s].label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Equipment filter */}
              <div className="relative">
                <select
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                  aria-label="Filter by equipment"
                  className="appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 cursor-pointer"
                >
                  <option value="all">All Equipment</option>
                  {allEquipment.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Session cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium mb-2">No sessions found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your filters or search query.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setLevelFilter("all");
                setStatusFilter("all");
                setEquipmentFilter("all");
                setSearchQuery("");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filtered.length} session{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((session) => {
                const lvlCfg = levelConfig[session.level];
                const stsCfg = statusConfig[session.status];
                const spotsLeft = session.maxParticipants - session.enrolledCount;
                const isOpen = session.status === "open";

                return (
                  <Link
                    key={session.id}
                    href={`/training/${session.slug}`}
                    className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-foreground/20 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={session.image}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Badges row */}
                      <div className="flex items-start gap-2 mb-3 flex-wrap">
                        <Badge className={`${lvlCfg.color} border-0 text-xs`}>
                          {lvlCfg.label}
                        </Badge>
                        <Badge className={`${stsCfg.color} border-0 text-xs`}>
                          {stsCfg.label}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
                        {session.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                        {session.description}
                      </p>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Meta info */}
                      <div className="space-y-2 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {new Date(session.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            {" – "}
                            {new Date(session.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{session.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {session.enrolledCount} / {session.maxParticipants} enrolled
                            {spotsLeft > 0 && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {" "}({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
                              </span>
                            )}
                            {spotsLeft <= 0 && (
                              <span className="text-muted-foreground"> — Full</span>
                            )}
                          </span>
                        </div>

                        {/* Equipment */}
                        {session.equipment.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Wrench className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <div className="flex flex-wrap gap-1.5">
                              {session.equipment.map((eq) => (
                                <span
                                  key={eq}
                                  className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                >
                                  {eq}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="pt-3 border-t border-border">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                            isOpen
                              ? "text-primary group-hover:text-primary/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {isOpen ? (
                            <>
                              <BookOpen className="h-4 w-4" />
                              View Details & Enroll
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </>
                          ) : (
                            <>
                              View Details
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
