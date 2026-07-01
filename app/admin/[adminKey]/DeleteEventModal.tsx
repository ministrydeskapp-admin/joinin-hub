"use client";

type DeleteEventModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteEventModal({
  open,
  onClose,
  onConfirm,
}: DeleteEventModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Delete Event</h2>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          This will permanently delete:
        </p>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>the event</li>
          <li>all signup slots</li>
          <li>all claims</li>
        </ul>

        <p className="mt-4 text-sm font-medium text-red-400">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}
