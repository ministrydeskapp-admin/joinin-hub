"use client";

import { useState } from "react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}