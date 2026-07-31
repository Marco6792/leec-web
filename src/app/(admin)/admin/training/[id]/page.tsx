import { redirect } from "next/navigation";

export default async function AdminTrainingItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/training/${id}/edit`);
}
