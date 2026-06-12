"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteClaim(formData: FormData) {
  const claimId = String(formData.get("claimId") || "");
  const adminKey = String(formData.get("adminKey") || "");

  if (!claimId || !adminKey) return;

  await prisma.signupClaim.delete({
    where: {
      id: claimId,
    },
  });

  revalidatePath(`/admin/${adminKey}`);
}

export async function deleteSlot(formData: FormData) {
  const slotId = String(formData.get("slotId") || "");
  const adminKey = String(formData.get("adminKey") || "");

  if (!slotId || !adminKey) return;

  await prisma.signupSlot.delete({
    where: {
      id: slotId,
    },
  });

  revalidatePath(`/admin/${adminKey}`);
}
export async function addSlots(formData: FormData) {
  const adminKey = String(formData.get("adminKey") || "");
  const eventId = String(formData.get("eventId") || "");
  const name = String(formData.get("name") || "").trim();
  const quantity = Number(formData.get("quantity") || 1);

  if (!adminKey || !eventId || !name || quantity < 1) return;

  await prisma.signupSlot.createMany({
    data: Array.from({ length: quantity }).map((_, index) => ({
      name,
      eventId,
      sortOrder: index,
    })),
  });

  revalidatePath(`/admin/${adminKey}`);
  redirect(`/admin/${adminKey}`);
}

export async function updateEvent(formData: FormData) {
  const adminKey = String(formData.get("adminKey") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const dateValue = String(formData.get("date") || "");
  const location = String(formData.get("location") || "").trim();

  if (!adminKey || !title) return;

  await prisma.event.update({
    where: { adminKey },
    data: {
      title,
      description: description || null,
      date: dateValue ? new Date(dateValue) : null,
      location: location || null,
    },
  });

  revalidatePath(`/admin/${adminKey}`);
  redirect(`/admin/${adminKey}`);
}