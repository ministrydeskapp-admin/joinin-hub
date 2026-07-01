"use client";

import { useState } from "react";
import DeleteEventModal from "./DeleteEventModal";

type DeleteEventButtonProps = {
  adminKey: string;
  deleteEvent: (formData: FormData) => Promise<void>;
};

export default function DeleteEventButton({
  adminKey,
  deleteEvent,
}: DeleteEventButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function submitDelete() {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("adminKey", adminKey);
      await deleteEvent(formData);
    } finally {
      setIsPending(false);
      setIsModalOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Delete Event"}
      </button>

      <DeleteEventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={submitDelete}
      />
    </>
  );
}
