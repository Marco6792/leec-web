export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          institution: string | null;
          department: string | null;
          title: string | null;
          biography: string | null;
          research_interests: string[] | null;
          orcid: string | null;
          google_scholar: string | null;
          research_gate: string | null;
          linked_in: string | null;
          website: string | null;
          phone: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      education: {
        Row: {
          id: string;
          profile_id: string;
          degree: string;
          institution: string;
          field: string | null;
          start_year: number | null;
          end_year: number | null;
          grade: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["education"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["education"]["Row"]>;
      };
      lab_members: {
        Row: {
          lab_id: string;
          user_id: string;
          role: "director" | "pi" | "researcher" | "phd_student" | "master_student" | "technician" | "visitor" | "external" | "client";
          status: "active" | "inactive" | "alumni";
          joined_at: string;
          left_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["lab_members"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["lab_members"]["Row"]>;
      };
      publication_authors: {
        Row: {
          publication_id: string;
          profile_id: string;
          author_order: number;
          corresponding: boolean | null;
          affiliation: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["publication_authors"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["publication_authors"]["Row"]>;
      };
      publications: {
        Row: {
          id: string;
          type: "journal" | "conference" | "book" | "chapter" | "report" | "dataset" | "thesis" | "patent" | "software" | "preprint";
          title: string;
          abstract: string | null;
          year: number;
          doi: string | null;
          journal: string | null;
          conference: string | null;
          publisher: string | null;
          volume: string | null;
          issue: string | null;
          pages: string | null;
          isbn: string | null;
          issn: string | null;
          citation_count: number;
          pdf_url: string | null;
          keywords: string[] | null;
          research_domains: string[] | null;
          open_access: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["publications"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["publications"]["Row"]>;
      };
      projects: {
        Row: {
          id: string;
          lab_id: string | null;
          title: string;
          description: string | null;
          status: "active" | "completed" | "on_hold" | "cancelled" | "proposed";
          pi_id: string | null;
          start_date: string | null;
          end_date: string | null;
          funding_source: string | null;
          funding_amount: string | null;
          researcher_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      equipment: {
        Row: {
          id: string;
          lab_id: string | null;
          name: string;
          slug: string;
          category: string | null;
          status: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["equipment"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["equipment"]["Row"]>;
      };
      research_domains: {
        Row: {
          id: string;
          lab_id: string | null;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          lead_researcher_id: string | null;
          featured_image_url: string | null;
          tags: string[] | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["research_domains"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["research_domains"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
