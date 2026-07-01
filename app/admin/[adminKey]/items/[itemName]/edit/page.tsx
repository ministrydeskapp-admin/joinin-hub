import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateItemGroup } from "../../../actions";

type PageProps = {
  params: Promise<{
    adminKey: string;
    itemName: string;
  }>;
};

export default async function EditItemGroupPage({ params }: PageProps) {
  const { adminKey, itemName } = await params;
  const decodedItemName = decodeURIComponent(itemName);

  const event = await prisma.event.findUnique({
    where: { adminKey },
    select: { id: true, title: true },
  });

  if (!event) {
    redirect("/admin");
  }

  const slot = await prisma.signupSlot.findFirst({
    where: {
      eventId: event.id,
      name: decodedItemName,
    },
    select: {
      name: true,
      details: true,
    },
  });

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link
        href={`/admin/${adminKey}`}
        className="border px-4 py-2 rounded-lg inline-block mb-4"
      >
        ← Back to Event
      </Link>

      <h1 className="text-3xl font-bold mb-2">Edit Item</h1>
      <p className="text-gray-600 mb-6">
        Update the item name and description for {event.title}.
      </p>

      <form action={updateItemGroup} className="border rounded-lg p-4 space-y-4">
        <input type="hidden" name="adminKey" value={adminKey} />
        <input type="hidden" name="currentName" value={decodedItemName} />

        <div>
          <label className="block font-medium mb-1">Item Name</label>
          <input
            type="text"
            name="name"
            defaultValue={slot?.name || decodedItemName}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Item Description (optional)</label>
          <textarea
            name="details"
            defaultValue={slot?.details || ""}
            placeholder="Each signup is for two 2-liter drinks."
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>

          <Link
            href={`/admin/${adminKey}`}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
