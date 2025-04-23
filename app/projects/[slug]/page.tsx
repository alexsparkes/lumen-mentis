"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectPage() {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    // Access `window` only on the client side
    const pathSlug = decodeURIComponent(
      window.location.pathname.split("/").pop() || ""
    );
    setSlug(pathSlug);
  }, []);

  if (!slug) {
    return null; // Render nothing until the slug is available
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-white">
      <h1 className="text-2xl font-bold mb-4">{slug}</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 px-4 py-2 rounded text-white"
          onClick={() => router.push(`/projects/${slug}/edit`)}
        >
          Edit
        </button>
        <button
          className="bg-green-500 px-4 py-2 rounded text-white"
          onClick={() => router.push(`/projects/${slug}/learn`)}
        >
          Learn
        </button>
      </div>
    </div>
  );
}
