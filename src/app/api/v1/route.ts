export async function GET() {
  return Response.json({
    version: "1.0.0",
    description: "LEEC Platform REST API — public, authenticated, and admin endpoints",
    auth: "Use Bearer token or Supabase session cookie. Public endpoints require no auth.",
    pagination: "Use ?page=1&limit=20 query params on list endpoints.",
    resources: [
      { path: "/api/v1/publications", description: "Publications CRUD" },
      { path: "/api/v1/equipment", description: "Equipment catalog" },
      { path: "/api/v1/projects", description: "Research projects" },
      { path: "/api/v1/news", description: "Lab news and announcements" },
      { path: "/api/v1/profiles", description: "Researcher profiles" },
      { path: "/api/v1/partners", description: "Partner institutions" },
      { path: "/api/v1/grants", description: "Research grants" },
      { path: "/api/v1/research-domains", description: "Research domains" },
      { path: "/api/v1/equipment-bookings", description: "Equipment reservations (auth)" },
      { path: "/api/v1/lab-members", description: "Lab membership (auth)" },
      { path: "/api/v1/admin/users", description: "User management (admin)" },
      { path: "/api/v1/admin/content", description: "Content management (admin)" },
    ],
  });
}
