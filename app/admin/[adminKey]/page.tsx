import { prisma } from "@/lib/prisma";
import CopyLinkButton from "./CopyLinkButton";
import { deleteClaim, deleteSlot } from "./actions";

type PageProps = {
  params: Promise<{
    adminKey: string;
  }>;
};

export default async function AdminPage({ params }: PageProps) {
  const { adminKey } = await params;

  const event = await prisma.event.findUnique({
    where: { adminKey },
    include: {
      slots: {
        include: {
          claim: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!event) {
    return <main className="p-6">Signup sheet not found.</main>;
  }

  const totalSlots = event.slots.length;
  const claimedSlots = event.slots.filter(
  (slot: (typeof event.slots)[number]) => slot.claim
).length;
  const remainingSlots = totalSlots - claimedSlots;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

      <p className="text-gray-600 mb-4">Admin view</p>

<div className="border rounded-lg p-4 mb-6">
  <p className="font-semibold mb-2">Public Signup Link</p>

  <p className="break-all text-blue-600">
    {appUrl}/e/{event.publicSlug}
  </p>

  <CopyLinkButton link={`${appUrl}/e/${event.publicSlug}`} />
</div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Needed</p>
          <p className="text-2xl font-bold">{totalSlots}</p>
        </div>

        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Claimed</p>
          <p className="text-2xl font-bold text-green-600">{claimedSlots}</p>
        </div>

        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-2xl font-bold text-orange-600">
            {remainingSlots}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <p>
          <strong>Description:</strong> {event.description || "None"}
        </p>
        <p>
          <strong>Date:</strong> {event.date?.toLocaleDateString() || "None"}
        </p>
        <p>
          <strong>Location:</strong> {event.location || "None"}
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <a
          href={`/admin/${adminKey}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Edit Event
        </a>

        <a
          href={`/admin/${adminKey}/items`}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Add Items
        </a>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Signup Slots</h2>

      <div className="space-y-3">
        {event.slots.map((slot: (typeof event.slots)[number]) => (
          <div key={slot.id} className="border rounded-lg p-4">
            <p className="font-medium">{slot.name}</p>

            {slot.claim ? (
              <div>
                <p className="text-green-700 mb-2">
                  Claimed by {slot.claim.personName}
                  {slot.claim.description ? ` — ${slot.claim.description}` : ""}
                </p>

                <form action={deleteClaim}>
                  <input type="hidden" name="claimId" value={slot.claim.id} />
                  <input type="hidden" name="adminKey" value={adminKey} />

                  <button
                    type="submit"
                    className="border border-orange-500 text-orange-600 px-3 py-1 rounded"
                  >
                    Remove Claim
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-2">Open</p>

                <form action={deleteSlot}>
                  <input type="hidden" name="slotId" value={slot.id} />
                  <input type="hidden" name="adminKey" value={adminKey} />

                  <button
                    type="submit"
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Remove Item
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}