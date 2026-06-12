"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function makeKey() {
  return Math.random().toString(36).substring(2, 10);
}

export async function createSignupSheet(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const dateValue = String(formData.get("date") || "");
  const location = String(formData.get("location") || "").trim();
  const itemsJson = String(formData.get("items") || "[]");

  if (!title) {
    throw new Error("Event name is required.");
  }

  const items = JSON.parse(itemsJson) as {
    name: string;
    quantity: number;
  }[];

  const publicSlug = makeKey();
  const adminKey = makeKey();

  await prisma.event.create({
    data: {
      title,
      description: description || null,
      date: dateValue ? new Date(dateValue) : null,
      location: location || null,
      publicSlug,
      adminKey,
      slots: {
        create: items.flatMap((item, itemIndex) =>
          Array.from({ length: item.quantity }).map((_, slotIndex) => ({
            name: item.name,
            sortOrder: itemIndex * 100 + slotIndex,
          }))
        ),
      },
    },
  });

  redirect(`/admin/${adminKey}`);
}