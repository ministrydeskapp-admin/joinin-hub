import { prisma } from "@/lib/prisma";
import CopyLinkButton from "./CopyLinkButton";
import { deleteClaim, deleteSlot } from "./actions";

type PageProps = {
  params: Promise<{
    adminKey: string;
  }>;
};

type Slot = {
  id: string;
  name: string;
  details: string | null;
  sortOrder: number;
  eventId: string;
  createdAt: Date;
  claim: {
    id: string;
    personName: string;
    description: string | null;
    slotId: string;
    createdAt: Date;
  } | null;
};

function groupSlotsByName(slots: Slot[]) {
  return slots.reduce<Record<string, Slot[]>>((groups, slot) => {
    if (!groups[slot.name]) {
      groups[slot.name] = [];
    }

    groups[slot.name].push(slot);
    return groups;
  }, {});
}

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

  const slots = event.slots as Slot[];

  const totalSlots = slots.length;
  const claimedSlots = slots.filter((slot) => slot.claim).length;
  const remainingSlots = totalSlots - claimedSlots;
  const groupedSlots = groupSlotsByName(slots);

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

      <h2 className="text-2xl font-semibold mb-3">Signup Items</h2>

      <div className="space-y-4">
        {Object.entries(groupedSlots).map(([name, group]) => {
          const claimed = group.filter((slot) => slot.claim);
          const open = group.filter((slot) => !slot.claim);

          return (
            <div key={name} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold">{name}</h3>

              <p className="text-gray-600 mb-3">
                {group.length} total · {claimed.length} claimed · {open.length} remaining
              </p>

              {claimed.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="font-medium text-green-700">Claimed</p>

                  {claimed.map((slot) => (
                    <div key={slot.id} className="border rounded-lg p-3">
                      <p className="text-green-700 mb-2">
                        {slot.claim?.personName}
                        {slot.claim?.description
                          ? ` — ${slot.claim.description}`
                          : ""}
                      </p>

                      <form action={deleteClaim}>
                        <input
                          type="hidden"
                          name="claimId"
                          value={slot.claim?.id}
                        />
                        <input
                          type="hidden"
                          name="adminKey"
                          value={adminKey}
                        />

                        <button
                          type="submit"
                          className="border border-orange-500 text-orange-600 px-3 py-1 rounded"
                        >
                          Remove Claim
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}

              {open.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Open</p>

                  {open.map((slot) => (
                    <div key={slot.id} className="border rounded-lg p-3">
                      <p className="text-gray-500 mb-2">Open {slot.name}</p>

                      <form action={deleteSlot}>
                        <input type="hidden" name="slotId" value={slot.id} />
                        <input
                          type="hidden"
                          name="adminKey"
                          value={adminKey}
                        />

                        <button
                          type="submit"
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Remove Item
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}