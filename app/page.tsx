import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4">
        JoinIn Hub
      </h1>

      <p className="text-lg max-w-2xl mb-8">
        Create simple signup sheets for potlucks, volunteers,
        events, and community needs.
      </p>

      <Link
        href="/create"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Create a Signup Sheet
      </Link>
    </main>
  );
}