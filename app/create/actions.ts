"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type CreateItem = {
  name: string;
  quantity: number;
  details: string | null;
};

function makeKey() {
  return crypto.randomUUID();
}

function parseItems(itemsJson: string) {
  let parsed: unknown = [];

  try {
    parsed = JSON.parse(itemsJson);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return null;
      }

      const name = String((item as { name?: unknown }).name || "").trim();
      const quantity = Number((item as { quantity?: unknown }).quantity ?? 0);
      const details = String((item as { details?: unknown }).details || "").trim();

      return name && Number.isFinite(quantity) && quantity > 0
        ? { name, quantity, details: details || null }
        : null;
    })
    .filter((item): item is CreateItem => item !== null);
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

  const items = parseItems(itemsJson);

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
            details: item.details,
            sortOrder: itemIndex * 100 + slotIndex,
          }))
        ),
      },
    },
  });

  redirect(`/admin/${adminKey}`);
}