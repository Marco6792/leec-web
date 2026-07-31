import { redirect } from "next/navigation";

export default async function AdminNewsItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/news/${id}/edit`);
}
