"use client";

import { useState, useRef } from "react";
import { useFile } from "./context/FileContext";
import FileDropArea from "./components/FileDropArea";
import ActionButtons from "./components/ActionButtons";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, setFile } = useFile();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".md")) {
      setFile(droppedFile);
      console.log("File dropped:", droppedFile);
    } else {
      alert("Only markdown files are allowed.");
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !selectedFile.name.endsWith(".md")) {
      alert("Only markdown files are allowed.");
      e.target.value = ""; // Reset the input
    } else if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile);
    }
  };

  return (
    <div
      className={`grid place-content-center h-screen w-screen transition-colors duration-300 ${
        isDragging ? "bg-neutral-800" : "bg-neutral-950"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <main>
        <FileDropArea
          isDragging={isDragging}
          selectedFile={file}
          handleChooseFileClick={handleChooseFileClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
        <ActionButtons selectedFile={file} />
      </main>
    </div>
  );
}
