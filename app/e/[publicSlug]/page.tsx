import { prisma } from "@/lib/prisma";
import { claimSlots } from "./actions";

type PageProps = {
  params: Promise<{
    publicSlug: string;
  }>;
};

export default async function PublicSignupPage({ params }: PageProps) {
  const { publicSlug } = await params;

  const event = await prisma.event.findUnique({
    where: { publicSlug },
    include: {
      slots: {
        include: { claim: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!event) {
    return <main className="p-6">Signup sheet not found.</main>;
  }

  const openSlots = event.slots.filter(
    (slot: (typeof event.slots)[number]) => !slot.claim
  );

  const claimedSlots = event.slots.filter(
    (slot: (typeof event.slots)[number]) => slot.claim
  );

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

      {event.description && (
        <p className="text-gray-600 mb-4">{event.description}</p>
      )}

      <div className="border rounded-lg p-4 mb-6">
        <p>
          <strong>Date:</strong> {event.date?.toLocaleDateString() || "None"}
        </p>
        <p>
          <strong>Location:</strong> {event.location || "None"}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Available Items</h2>

      {openSlots.length === 0 ? (
        <p className="text-gray-600 mb-6">Everything has been claimed.</p>
      ) : (
        <form action={claimSlots} className="space-y-4 mb-8">
          <input type="hidden" name="publicSlug" value={publicSlug} />

          <div>
            <label className="block font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="personName"
              required
              placeholder="Your name"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="space-y-3">
            {openSlots.map((slot: (typeof openSlots)[number]) => (
              <div key={slot.id} className="border rounded-lg p-4">
                <label className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    name="slotIds"
                    value={slot.id}
                    className="mt-1"
                  />

                  <div className="w-full">
                    <p className="font-medium">{slot.name}</p>
                    <input
                      type="text"
                      name={`description-${slot.id}`}
                      placeholder={`Description for ${slot.name} - ex: Doritos`}
                      className="w-full border rounded-lg p-2 mt-2"
                    />
                  </div>
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Claim Selected Items
          </button>
        </form>
      )}

      <h2 className="text-2xl font-semibold mb-3">Already Claimed</h2>

      {claimedSlots.length === 0 ? (
        <p className="text-gray-600">No one has signed up yet.</p>
      ) : (
        <div className="space-y-3">
          {claimedSlots.map((slot: (typeof claimedSlots)[number]) => (
            <div key={slot.id} className="border rounded-lg p-4">
              <p className="font-medium">{slot.name}</p>
              <p className="text-green-700">
                {slot.claim?.personName}
                {slot.claim?.description ? ` — ${slot.claim.description}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}