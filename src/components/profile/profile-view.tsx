"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { signout } from "@/lib/auth/actions";
import {
  updateProfile,
  updateInterests,
  updateLinks,
  addEducation,
  removeEducation,
  updateAvatar,
  deleteAccount,
} from "@/lib/profile/actions";
import {
  ExternalLink,
  GraduationCap,
  Globe,
  BookOpen,
  FileText,
  Building2,
  Quote,
  Mail,
  Beaker,
  Calendar,
  Bookmark,
  BarChart3,
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
  Save,
  User,
} from "lucide-react";
import { useProfileStore } from "@/lib/stores/profile";
import type { ProfileData, EducationRow } from "@/lib/stores/profile";

// ─── SVG Icons ─────────────────────────────────────────────────────────

const OrcidIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-3.903-3.722h-2.416z" />
  </svg>
);

// ─── Progress ──────────────────────────────────────────────────────────

function calcProgress(profile: ProfileData, education: EducationRow[]) {
  let score = 0;
  if (profile.avatar_url) score++;
  if (profile.biography && profile.biography.length > 20) score += 2;
  if (profile.title) score++;
  if (profile.institution) score++;
  if (profile.research_interests.length > 0) score += 2;
  if (education.length > 0) score += 2;
  if (profile.orcid || profile.google_scholar || profile.linked_in) score++;
  if (profile.phone) score++;
  return Math.round((score / 10) * 100);
}

// ─── Editable Field ────────────────────────────────────────────────────

function EditableField({
  label,
  value,
  name,
  rows,
  onSubmit,
}: {
  label: string;
  value: string;
  name: string;
  rows?: number;
  onSubmit: (fd: FormData) => Promise<{ error?: string } | undefined>;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setVal(value), [value]);

  async function handleSave() {
    const fd = new FormData();
    fd.set(name, val);
    const result = await onSubmit(fd);
    if (result?.error) setError(result.error);
    else setEditing(false);
  }

  if (!editing) {
    return (
      <div className="group relative">
        {label && <p className="text-xs text-muted-foreground mb-0.5">{label}</p>}
        <p className="text-sm">{val || <span className="italic text-muted-foreground/50">Not set</span>}</p>
        <button onClick={() => setEditing(true)}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
          aria-label={`Edit ${label}`}>
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div>
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      {rows ? (
        <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={rows}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 resize-none" />
      ) : (
        <input type="text" value={val} onChange={(e) => setVal(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50" />
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <Button size="sm" onClick={handleSave} className="gap-1 cursor-pointer"><Save className="h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" variant="ghost" onClick={() => { setVal(value); setEditing(false); setError(null); }} className="gap-1 cursor-pointer"><X className="h-3.5 w-3.5" /> Cancel</Button>
      </div>
    </div>
  );
}

// ─── Profile View ───────────────────────────────────────────────────────

export function ProfileView({ profileId, currentUserId, initialProfile }: { profileId: string; currentUserId: string | null; initialProfile?: ProfileData }) {
  const profile = useProfileStore((s) => s.profile);
  const education = useProfileStore((s) => s.education);
  const publications = useProfileStore((s) => s.publications);
  const projects = useProfileStore((s) => s.projects);
  const profileLoading = useProfileStore((s) => s.profileLoading);
  const error = useProfileStore((s) => s.error);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const setProfile = useProfileStore((s) => s.setProfile);

  const [addingEdu, setAddingEdu] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", field: "", start_year: "", end_year: "" });
  const [eduError, setEduError] = useState<string | null>(null);

  // Track whether we've kicked off the initial fetch (to distinguish
  // "haven't started yet" from "fetch completed with no result")
  const hasAttemptedFetch = useRef(!!initialProfile);

  const isOwner = currentUserId === profileId;

  // Sync server-fetched profile into the Zustand store, or kick off a
  // client-side fetch. The cleanup marks the effect as stale so a
  // late-arriving promise doesn't overwrite a newer request's data.
  useEffect(() => {
    hasAttemptedFetch.current = true;
    let stale = false;

    if (initialProfile) {
      setProfile(initialProfile);
      useProfileStore.getState().fetchRelatedData(profileId);
    } else {
      fetchProfile(profileId, currentUserId).then(() => {
        if (stale) {
          // Component unmounted during fetch — reset to avoid leaking
          // stale data into a subsequent mount of a different profileId.
          useProfileStore.getState().clear();
        }
      });
    }

    return () => {
      stale = true;
    };
  }, [profileId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show the spinner while the store is actively loading, OR on the very
  // first render before the effect has kicked off.
  const loading = profileLoading || (!hasAttemptedFetch.current && !profile);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading profile...</div>
    </div>;
  }

  if (!profile) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <h1 className="text-3xl font-bold mb-2">Profile Not Found</h1>
      <p className="text-muted-foreground">{error || "This user does not have a public profile."}</p>
    </div>;
  }

  const progress = calcProgress(profile, education);
  const initials = profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const pubCount = publications.length;
  const totalCitations = publications.reduce((s, p) => s + p.citation_count, 0);

  const links = [
    { key: "orcid", href: profile.orcid, label: "ORCID", icon: <OrcidIcon /> },
    { key: "google_scholar", href: profile.google_scholar, label: "Google Scholar", icon: <BookOpen className="h-4 w-4" /> },
    { key: "research_gate", href: profile.research_gate, label: "ResearchGate", icon: <FileText className="h-4 w-4" /> },
    { key: "linked_in", href: profile.linked_in, label: "LinkedIn", icon: <Building2 className="h-4 w-4" /> },
    { key: "website", href: profile.website, label: "Website", icon: <Globe className="h-4 w-4" /> },
  ].filter((l) => l.href);

  async function handleSaveAvatar() {
    const fd = new FormData(); fd.set("avatar_url", avatarUrl);
    const result = await updateAvatar(fd);
    if (result?.error) setAvatarError(result.error);
    else {
      setProfile({ ...(profile as ProfileData), avatar_url: avatarUrl || null });
      setEditingAvatar(false);
      setAvatarError(null);
    }
  }

  async function handleAddEducation() {
    if (!newEdu.degree || !newEdu.institution) { setEduError("Degree and institution are required"); return; }
    const fd = new FormData();
    fd.set("degree", newEdu.degree); fd.set("institution", newEdu.institution);
    fd.set("field", newEdu.field); fd.set("start_year", newEdu.start_year); fd.set("end_year", newEdu.end_year);
    const result = await addEducation(fd);
    if (result?.error) setEduError(result.error);
    else {
      setNewEdu({ degree: "", institution: "", field: "", start_year: "", end_year: "" });
      setAddingEdu(false);
      setEduError(null);
      useProfileStore.getState().fetchRelatedData(profileId);
    }
  }

  async function handleRemoveEducation(id: string) {
    const result = await removeEducation(id);
    if (result?.error) setEduError(result.error);
    else useProfileStore.getState().fetchRelatedData(profileId);
  }

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ─── Sidebar ──────────────────────────────────────────── */}
        <div className="lg:w-72 shrink-0 space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="size-28 mx-auto rounded-2xl overflow-hidden border bg-muted">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center text-3xl font-bold text-muted-foreground">{initials}</div>
                )}
              </div>
              {isOwner && (
                <button onClick={() => { setEditingAvatar(true); setAvatarUrl(profile.avatar_url ?? ""); }}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity shadow"
                  aria-label="Edit avatar">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {editingAvatar && isOwner && (
              <div className="mt-3 space-y-2">
                <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Avatar URL"
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-ring" />
                {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
                <div className="flex gap-2 justify-center">
                  <Button size="sm" onClick={handleSaveAvatar} className="cursor-pointer"><Check className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingAvatar(false)} className="cursor-pointer"><X className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            )}
            <h2 className="text-lg font-bold mt-3">{profile.full_name}</h2>
            <p className="text-sm text-muted-foreground">{profile.title || "Researcher"}</p>
            <p className="text-xs text-muted-foreground">{profile.institution}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold">{pubCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Pubs</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{totalCitations}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Citations</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{projects.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Projects</div>
            </div>
          </div>

          {isOwner && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Profile completion</span>
                  <span className="text-xs font-bold">{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="mt-3 space-y-1">
                  {[
                    { label: "Photo", done: !!profile.avatar_url },
                    { label: "Biography", done: (profile.biography?.length ?? 0) > 20 },
                    { label: "Title", done: !!profile.title },
                    { label: "Institution", done: !!profile.institution },
                    { label: "Research interests", done: profile.research_interests.length > 0 },
                    { label: "Education", done: education.length > 0 },
                    { label: "External links", done: !!(profile.orcid || profile.google_scholar || profile.linked_in) },
                    { label: "Phone", done: !!profile.phone },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`size-3 rounded-full border ${item.done ? "bg-foreground border-foreground" : "border-border"}`} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <form action={signout}>
                <Button type="submit" variant="outline" size="sm" className="w-full cursor-pointer">Sign Out</Button>
              </form>
            </>
          )}
        </div>

        {/* ─── Main Content ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Quote className="h-5 w-5 text-muted-foreground" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isOwner ? (
                <EditableField label="Biography" name="biography" value={profile.biography ?? ""} rows={5} onSubmit={updateProfile} />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{profile.biography || <span className="italic">No biography</span>}</p>
              )}
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bookmark className="h-5 w-5 text-muted-foreground" />
                Research Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isOwner ? (
                <EditableField label="Comma-separated interests" name="research_interests" value={profile.research_interests.join(", ")} onSubmit={updateInterests} />
              ) : null}
              {profile.research_interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.research_interests.map((i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                  ))}
                </div>
              )}
              {profile.research_interests.length === 0 && !isOwner && (
                <p className="text-sm text-muted-foreground italic">No research interests listed.</p>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                Education
              </CardTitle>
              {isOwner && (
                <Button variant="ghost" size="sm" onClick={() => setAddingEdu(true)} className="gap-1 cursor-pointer">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {education.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No education entries yet.</p>
              )}
              {education.map((edu) => (
                <div key={edu.id} className="flex items-start gap-4 p-4 rounded-xl border group">
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}{edu.field ? ` — ${edu.field}` : ""}</p>
                    <p className="text-xs text-muted-foreground">{edu.start_year}{edu.end_year ? ` — ${edu.end_year}` : ""}</p>
                  </div>
                  {isOwner && (
                    <button onClick={() => handleRemoveEducation(edu.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-destructive shrink-0"
                      aria-label="Remove education">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {addingEdu && isOwner && (
                <div className="p-4 rounded-xl border space-y-3 bg-muted/30">
                  <input placeholder="Degree *" value={newEdu.degree} onChange={(e) => setNewEdu((p) => ({ ...p, degree: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
                  <input placeholder="Institution *" value={newEdu.institution} onChange={(e) => setNewEdu((p) => ({ ...p, institution: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
                  <input placeholder="Field of study" value={newEdu.field} onChange={(e) => setNewEdu((p) => ({ ...p, field: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Start year" value={newEdu.start_year} onChange={(e) => setNewEdu((p) => ({ ...p, start_year: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
                    <input type="number" placeholder="End year" value={newEdu.end_year} onChange={(e) => setNewEdu((p) => ({ ...p, end_year: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
                  </div>
                  {eduError && <p className="text-xs text-destructive">{eduError}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddEducation} className="gap-1 cursor-pointer"><Plus className="h-3.5 w-3.5" /> Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setAddingEdu(false); setEduError(null); }} className="cursor-pointer">Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
                Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {links.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {links.map((link) => (
                    <a key={link.key} href={link.href!} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs hover:bg-muted transition-colors">
                      {link.icon} {link.label} <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              )}
              {links.length === 0 && <p className="text-sm text-muted-foreground italic mb-4">No links added yet.</p>}
              {isOwner && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EditableField label="ORCID" name="orcid" value={profile.orcid ?? ""} onSubmit={updateLinks} />
                  <EditableField label="Google Scholar URL" name="google_scholar" value={profile.google_scholar ?? ""} onSubmit={updateLinks} />
                  <EditableField label="ResearchGate URL" name="research_gate" value={profile.research_gate ?? ""} onSubmit={updateLinks} />
                  <EditableField label="LinkedIn URL" name="linked_in" value={profile.linked_in ?? ""} onSubmit={updateLinks} />
                  <EditableField label="Website URL" name="website" value={profile.website ?? ""} onSubmit={updateLinks} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publications */}
          {publications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  Publications ({pubCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id} className="p-4 rounded-xl border hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <Badge variant="secondary" className="w-fit shrink-0 text-xs">{pub.type}</Badge>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-snug mb-1">{pub.title}</h3>
                        <p className="text-xs text-muted-foreground">{pub.journal || pub.conference || pub.publisher}{pub.year ? ` (${pub.year})` : ""}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {pub.doi && (
                            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                              DOI: {pub.doi.slice(0, 30)}… <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {pub.citation_count > 0 && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" /> {pub.citation_count} citations
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Beaker className="h-5 w-5 text-muted-foreground" />
                  Projects ({projects.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm leading-snug">{proj.title}</h3>
                      <Badge variant="outline" className="shrink-0 text-[10px]">{proj.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {proj.pi_id === profileId ? "Principal Investigator" : "Researcher"}
                    </p>
                    {proj.start_date && (
                      <p className="text-xs text-muted-foreground mt-1">{proj.start_date}{proj.end_date ? ` — ${proj.end_date}` : ""}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Contact (only owner sees email) */}
          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{profile.email}</span>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">Verified</Badge>
                  </div>
                  <form action={async (fd: FormData) => { await updateProfile(fd); }}>
                    <EditableField label="Phone" name="phone" value={profile.phone ?? ""} onSubmit={updateProfile} />
                  </form>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone (only owner) */}
          {isOwner && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <form
                  action={async () => {
                    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      await deleteAccount();
                    }
                  }}
                >
                  <Button type="submit" variant="destructive" size="sm" className="cursor-pointer">
                    Delete my account
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
