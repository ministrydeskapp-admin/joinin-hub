import { prisma } from "@/lib/prisma";
import { updateEvent } from "../actions";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    adminKey: string;
  }>;
};

export default async function EditEventPage({ params }: PageProps) {
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

      <h1 className="text-3xl font-bold mb-2">Edit Event</h1>

      <p className="text-gray-600 mb-6">
        Update the details for this signup sheet.
      </p>

      <form action={updateEvent} className="border rounded-lg p-4 space-y-4">
        <input type="hidden" name="adminKey" value={adminKey} />

        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="title"
            defaultValue={event.title}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={event.description || ""}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={event.date?.toISOString().split("T")[0] || ""}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={event.location || ""}
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