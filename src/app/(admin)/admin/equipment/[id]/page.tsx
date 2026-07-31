import { redirect } from "next/navigation";

export default async function AdminEquipmentItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/equipment/${id}/edit`);
}
