import { serverError, requireUser } from "@/lib/api-helpers";

/**
 * Export samples as CSV.
 * NOTE: The samples table is part of the lab measurements layer
 * which hasn't been implemented in Drizzle yet. This route will be
 * activated once the schema is added.
 */
export async function GET() {
  try {
    await requireUser();
    return Response.json({
      message: "Samples export not yet available — lab measurements schema coming in Phase 2",
      data: [],
      count: 0,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
