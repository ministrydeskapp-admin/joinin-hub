"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function claimSlots(formData: FormData) {
  const publicSlug = String(formData.get("publicSlug") || "").trim();
  const personName = String(formData.get("personName") || "").trim();
  const selectedSlotIds = formData
    .getAll("slotIds")
    .map(String)
    .filter(Boolean);

  if (!publicSlug || !personName || selectedSlotIds.length === 0) {
    return;
  }

  const validSlots = await prisma.signupSlot.findMany({
    where: {
      id: { in: selectedSlotIds },
      event: { publicSlug },
      claim: null,
    },
    select: { id: true },
  });

  if (validSlots.length === 0) {
    return;
  }

  await prisma.signupClaim.createMany({
    data: validSlots.map((slot) => ({
      personName,
      description:
        String(formData.get(`description-${slot.id}`) || "").trim() || null,
      slotId: slot.id,
    })),
    skipDuplicates: true,
  });

  revalidatePath(`/e/${publicSlug}`);
}