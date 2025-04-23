"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPage() {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSlug = decodeURIComponent(
        window.location.pathname.split("/").slice(-2, -1)[0]
      );
      setSlug(pathSlug);
    }
  }, []);

  if (!slug) {
    return null; // Render nothing until the slug is available
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Edit: {slug}</h1>
      <button
        className="bg-gray-500 px-4 py-2 rounded text-white"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
}
