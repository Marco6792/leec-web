import { redirect } from "next/navigation";

export default async function AdminLabMemberItemPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  redirect(`/admin/lab-members/${userId}/edit`);
}
