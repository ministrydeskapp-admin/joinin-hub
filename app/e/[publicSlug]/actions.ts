"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function claimSlots(formData: FormData) {
  const publicSlug = String(formData.get("publicSlug") || "");
  const personName = String(formData.get("personName") || "").trim();
  const selectedSlotIds = formData.getAll("slotIds").map(String);

  if (!personName || selectedSlotIds.length === 0) {
    return;
  }

  for (const slotId of selectedSlotIds) {
    const description = String(formData.get(`description-${slotId}`) || "").trim();

    await prisma.signupClaim.create({
      data: {
        personName,
        description: description || null,
        slotId,
      },
    });
  }

  revalidatePath(`/e/${publicSlug}`);
}