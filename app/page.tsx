"use client";

import { useState } from "react";
import { useFile } from "./context/FileContext";
import ActionButtons from "./components/ActionButtons";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const { file } = useFile();

  return (
    <div
      className={`grid place-content-center transition-colors duration-300 ${
        isDragging ? "bg-neutral-800" : "bg-neutral-950"
      }`}
    >
      <main>
        <ActionButtons selectedFile={file} />
      </main>
    </div>
  );
}
