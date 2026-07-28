"use server";

import { db } from "@/db";
import {
  collaborationRequests,
  collaborationProjects,
  collaborationMilestones,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function approveRequest(requestId: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db
    .update(collaborationRequests)
    .set({
      status: "approved",
      respondedAt: new Date(),
    })
    .where(eq(collaborationRequests.id, requestId));

  revalidatePath("/admin/collaboration");
}

export async function rejectRequest(requestId: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db
    .update(collaborationRequests)
    .set({
      status: "rejected",
      respondedAt: new Date(),
    })
    .where(eq(collaborationRequests.id, requestId));

  revalidatePath("/admin/collaboration");
}

export async function createProject(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const partnerId = formData.get("partnerId") as string;
  const requestId = formData.get("requestId") as string;
  const piId = formData.get("piId") as string;

  if (!title || !partnerId) {
    redirect("/admin/collaboration?error=Missing+required+fields");
  }

  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

  await db.insert(collaborationProjects).values({
    title,
    slug,
    description: description || null,
    partnerId,
    requestId: requestId || null,
    piId: piId || null,
    labId: "5826efb9-5ad6-4acb-8420-e32e6b47998c", // LEEC lab ID
    status: "active",
  });

  revalidatePath("/admin/collaboration");
  redirect("/admin/collaboration?saved=true");
}

export async function updateProjectStatus(projectId: string, status: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db
    .update(collaborationProjects)
    .set({
      status: status as any,
      updatedAt: new Date(),
    })
    .where(eq(collaborationProjects.id, projectId));

  revalidatePath("/admin/collaboration");
}

export async function addMilestone(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!projectId || !title) {
    redirect("/admin/collaboration?error=Missing+required+fields");
  }

  await db.insert(collaborationMilestones).values({
    projectId,
    title,
    dueDate: dueDate || null,
    isPublic: true,
  });

  revalidatePath("/admin/collaboration");
}
