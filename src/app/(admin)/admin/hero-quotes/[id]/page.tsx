import { redirect } from "next/navigation";

export default async function AdminHeroQuoteItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/hero-quotes/${id}/edit`);
}
