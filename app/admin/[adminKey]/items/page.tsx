import { prisma } from "@/lib/prisma";
import { addSlots } from "../actions";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    adminKey: string;
  }>;
};

export default async function AddItemsPage({ params }: PageProps) {
  const { adminKey } = await params;

  const event = await prisma.event.findUnique({
    where: { adminKey },
  });

  if (!event) {
    return <main className="p-6">Signup sheet not found.</main>;
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link
        href={`/admin/${adminKey}`}
        className="border px-4 py-2 rounded-lg inline-block mb-4"
      >
        ← Back to Event
      </Link>

      <h1 className="text-3xl font-bold mb-2">Add Items</h1>

      <p className="text-gray-600 mb-6">
        Add more signup items to {event.title}.
      </p>

      <form action={addSlots} className="border rounded-lg p-4 space-y-4">
        <input type="hidden" name="adminKey" value={adminKey} />
        <input type="hidden" name="eventId" value={event.id} />

        <div>
          <label className="block font-medium mb-1">Item Needed</label>
          <input
            type="text"
            name="name"
            placeholder="Napkins, Bread, Drinks"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">How Many?</label>
          <input
            type="number"
            name="quantity"
            min="1"
            defaultValue="1"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Add Items
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