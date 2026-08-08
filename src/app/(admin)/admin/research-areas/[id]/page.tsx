import { redirect } from "next/navigation";

export default async function AdminResearchAreaItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/research-areas/${id}/edit`);
}
