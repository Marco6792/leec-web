import { redirect } from "next/navigation";

export default async function AdminEventItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/events/${id}/edit`);
}
