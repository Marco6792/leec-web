import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────

export interface ProfileData {
  id: string;
  full_name: string;
  avatar_url: string | null;
  cover_url: string | null;
  institution: string | null;
  department: string | null;
  title: string | null;
  biography: string | null;
  research_interests: string[];
  orcid: string | null;
  google_scholar: string | null;
  research_gate: string | null;
  linked_in: string | null;
  website: string | null;
  phone: string | null;
  email: string;
}

export interface EducationRow {
  id: string;
  degree: string;
  institution: string;
  field: string | null;
  start_year: number | null;
  end_year: number | null;
}

export interface PubRow {
  id: string;
  type: string;
  title: string;
  year: number;
  doi: string | null;
  journal: string | null;
  conference: string | null;
  publisher: string | null;
  citation_count: number;
}

export interface ProjectRow {
  id: string;
  title: string;
  status: string;
  pi_id: string | null;
  start_date: string | null;
  end_date: string | null;
}

type ProfileState = {
  // Primary data
  profile: ProfileData | null;
  education: EducationRow[];
  publications: PubRow[];
  projects: ProjectRow[];

  // Loading state
  profileLoading: boolean;
  relatedLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: (profileId: string, currentUserId: string | null) => Promise<void>;
  fetchRelatedData: (profileId: string) => Promise<void>;
  setProfile: (profile: ProfileData) => void;
  setEducation: (education: EducationRow[]) => void;
  setPublications: (publications: PubRow[]) => void;
  setProjects: (projects: ProjectRow[]) => void;
  clear: () => void;

  // Convenience
  isOwner: (userId: string | null) => boolean;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  education: [],
  publications: [],
  projects: [],
  profileLoading: false,
  relatedLoading: false,
  error: null,

  fetchProfile: async (profileId, currentUserId) => {
    console.log("[profile store] fetchProfile start", { profileId, currentUserId });
    set({ profileLoading: true, error: null });

    const supabase = createClient();
    if (!supabase) {
      console.error("[profile store] Supabase client is null");
      set({ error: "Supabase not configured", profileLoading: false });
      return;
    }

    try {
      const { data: rows, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .limit(1) as unknown as { data: any[] | null; error: any };

      console.log("[profile store] fetch result", { rows, fetchError });

      if (fetchError) {
        console.error("[profile store] Supabase error:", fetchError);
        set({ error: fetchError.message, profileLoading: false });
        return;
      }

      const row = rows?.[0] ?? null;
      if (!row) {
        console.warn("[profile store] No profile row found for", profileId);
        set({ profile: null, profileLoading: false });
        return;
      }

      console.log("[profile store] Profile found:", row.full_name);

      const email =
        currentUserId === profileId
          ? (await supabase.auth.getUser()).data.user?.email ?? ""
          : "";

      set({
        profile: { ...row, email, research_interests: row.research_interests ?? [] },
        profileLoading: false,
      });

      // Fetch related data automatically after profile loads
      get().fetchRelatedData(profileId);
    } catch (err) {
      console.error("[profile store] Exception in fetchProfile:", err);
      set({ error: err instanceof Error ? err.message : "Failed to fetch profile", profileLoading: false });
    }
  },

  fetchRelatedData: async (profileId) => {
    console.log("[profile store] fetchRelatedData start", profileId);
    set({ relatedLoading: true });

    const supabase = createClient();
    if (!supabase) {
      console.error("[profile store] fetchRelatedData: Supabase client is null");
      set({ relatedLoading: false });
      return;
    }

    try {
      // Education
      const { data: edu, error: eduError } = await supabase
        .from("education")
        .select("*")
        .eq("profile_id", profileId)
        .order("end_year", { ascending: false }) as unknown as { data: EducationRow[] | null; error: any };
      if (eduError) console.error("[profile store] Education fetch error:", eduError);
      else if (edu) set({ education: edu });

      // Publications
      const { data: ae, error: aeError } = await supabase
        .from("publication_authors")
        .select("publication_id")
        .eq("profile_id", profileId) as unknown as { data: { publication_id: string }[] | null; error: any };
      if (aeError) console.error("[profile store] Publication authors fetch error:", aeError);
      else {
        const pids = ae?.map((a) => a.publication_id).filter(Boolean) ?? [];
        if (pids.length > 0) {
          const { data: pubs, error: pubsError } = await supabase
            .from("publications")
            .select("*")
            .in("id", pids) as unknown as { data: PubRow[] | null; error: any };
          if (pubsError) console.error("[profile store] Publications fetch error:", pubsError);
          else if (pubs) set({ publications: pubs });
        }
      }

      // Projects
      const { data: projs, error: projError } = await supabase
        .from("projects")
        .select("*")
        .overlaps("researcher_ids", [profileId]) as unknown as { data: ProjectRow[] | null; error: any };
      if (projError) console.error("[profile store] Projects fetch error:", projError);
      else if (projs) set({ projects: projs });
    } catch (err) {
      console.error("[profile store] Exception in fetchRelatedData:", err);
    } finally {
      set({ relatedLoading: false });
    }
  },

  setProfile: (profile) => set({ profile }),
  setEducation: (education) => set({ education }),
  setPublications: (publications) => set({ publications }),
  setProjects: (projects) => set({ projects }),

  clear: () =>
    set({
      profile: null,
      education: [],
      publications: [],
      projects: [],
      profileLoading: false,
      relatedLoading: false,
      error: null,
    }),

  isOwner: (userId) => {
    const { profile } = get();
    return profile?.id === userId;
  },
}));
