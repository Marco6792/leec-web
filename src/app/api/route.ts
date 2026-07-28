/**
 * LEEC API v1 — Root endpoint
 * Provides API metadata and links to available resources.
 */
export async function GET() {
  return Response.json({
    name: "LEEC Platform API",
    version: "1.0.0",
    baseUrl: "/api/v1",
    docs: "/api/v1/docs",
    endpoints: {
      public: [
        { path: "/api/v1/publications", methods: ["GET"] },
        { path: "/api/v1/equipment", methods: ["GET"] },
        { path: "/api/v1/projects", methods: ["GET"] },
        { path: "/api/v1/news", methods: ["GET"] },
        { path: "/api/v1/profiles", methods: ["GET"] },
        { path: "/api/v1/partners", methods: ["GET"] },
        { path: "/api/v1/grants", methods: ["GET"] },
        { path: "/api/v1/research-domains", methods: ["GET"] },
      ],
      authenticated: [
        { path: "/api/v1/equipment-bookings", methods: ["GET", "POST"] },
        { path: "/api/v1/lab-members", methods: ["GET"] },
        { path: "/api/v1/notifications", methods: ["GET"] },
      ],
      admin: [
        { path: "/api/v1/admin/users", methods: ["GET", "PUT", "DELETE"] },
        { path: "/api/v1/admin/content", methods: ["GET", "POST", "PUT", "DELETE"] },
        { path: "/api/v1/admin/compliance", methods: ["GET", "POST"] },
      ],
      webhooks: [
        { path: "/api/webhooks/instruments", methods: ["POST"] },
        { path: "/api/webhooks/orcid-sync", methods: ["POST"] },
      ],
      export: [
        { path: "/api/export/publications", methods: ["GET"] },
        { path: "/api/export/samples", methods: ["GET"] },
      ],
      import: [
        { path: "/api/import/publications", methods: ["POST"] },
      ],
    },
  });
}
