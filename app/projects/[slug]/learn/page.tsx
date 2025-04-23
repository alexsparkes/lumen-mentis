"use client";

import { useRouter } from "next/navigation";

export default function LearnPage() {
  const router = useRouter();
  const slug = decodeURIComponent(
    window.location.pathname.split("/").slice(-2, -1)[0]
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Learn: {slug}</h1>
      <button
        className="bg-gray-500 px-4 py-2 rounded text-white"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
}
