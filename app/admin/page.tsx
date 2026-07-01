import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  let events;

  try {
    events = await prisma.event.findMany({
      include: {
        slots: {
          include: {
            claim: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    return (
      <main className="min-h-screen p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>

        <div className="rounded-lg border border-red-300 bg-red-50 p-6">
          <p className="font-semibold text-red-700 mb-2">
            Could not connect to the database.
          </p>
          <p className="text-gray-700">
            Please check that your `DATABASE_URL` is correct and that the database server
            is reachable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-gray-600">
          View and manage all JoinIn Hub signup sheets.
        </p>

        <Link
          href="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Create New Signup Sheet
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-600">No signup sheets created yet.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const total = event.slots.length;
            const claimed = event.slots.filter((slot) => slot.claim).length;
            const remaining = total - claimed;

            return (
              <div key={event.id} className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold">{event.title}</h2>

                <p className="text-gray-600">
                  {event.date?.toLocaleDateString() || "No date"} ·{" "}
                  {event.location || "No location"}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {total} needed · {claimed} claimed · {remaining} remaining
                </p>

                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/admin/${event.adminKey}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Open Admin
                  </Link>

                  <Link
                    href={`/e/${event.publicSlug}`}
                    className="border px-4 py-2 rounded-lg"
                  >
                    Public Page
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}