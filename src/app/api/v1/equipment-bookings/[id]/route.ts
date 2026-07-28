import { eq } from "drizzle-orm";
import { db } from "@/db";
import { equipmentBookings } from "@/db/schema";
import { ok, notFound, serverError, requireUser, forbidden } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const [booking] = await db
      .select()
      .from(equipmentBookings)
      .where(eq(equipmentBookings.id, id));

    if (!booking) return notFound("Booking not found");
    if (booking.userId !== user.id) return forbidden();
    return ok(booking);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const body = await request.json();

    const [existing] = await db
      .select()
      .from(equipmentBookings)
      .where(eq(equipmentBookings.id, id));

    if (!existing) return notFound("Booking not found");
    if (existing.userId !== user.id) return forbidden();

    const [updated] = await db
      .update(equipmentBookings)
      .set(body)
      .where(eq(equipmentBookings.id, id))
      .returning();

    return ok(updated);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;

    const [existing] = await db
      .select()
      .from(equipmentBookings)
      .where(eq(equipmentBookings.id, id));

    if (!existing) return notFound("Booking not found");
    if (existing.userId !== user.id) return forbidden();

    await db.delete(equipmentBookings).where(eq(equipmentBookings.id, id));
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
