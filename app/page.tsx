"use client";

import { useState, useRef } from "react";
import FileDropArea from "./components/FileDropArea";
import UploadButton from "./components/UploadButton";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".md")) {
      setSelectedFile(file);
      console.log("File dropped:", file);
    } else {
      alert("Only markdown files are allowed.");
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.name.endsWith(".md")) {
      alert("Only markdown files are allowed.");
      e.target.value = ""; // Reset the input
    } else if (file) {
      setSelectedFile(file);
      console.log("File selected:", file);
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
          selectedFile={selectedFile}
          handleChooseFileClick={handleChooseFileClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
        <UploadButton selectedFile={selectedFile} />
      </main>
    </div>
  );
}
