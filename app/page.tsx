"use client";

import { useState } from "react";
import { useFile } from "./context/FileContext";
import FileDropArea from "./components/FileDropArea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const { file, uploadedFiles } = useFile();

  return (
    <div
      className={`flex flex-col items-center justify-center transition-colors duration-300 w-full ${
        isDragging ? "bg-neutral-800" : "bg-neutral-950"
      }`}
    >
      <main className="w-full px-6 py-10">
        <h1 className="text-5xl font-bold text-white text-center mb-8">
          Welcome to Lumen Mentis
        </h1>
        <p className="text-neutral-400 text-center mb-12 text-lg">
          Manage your markdown files, create flashcards, and track your learning
          progress.
        </p>

        {/* File Drop Area */}
        <div className="max-w-6xl mx-auto">
          <FileDropArea
            isDragging={isDragging}
            selectedFile={file}
            handleChooseFileClick={() => {}}
            fileInputRef={{ current: null }}
            handleFileChange={() => {}}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
          />
        </div>

        {/* Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Link href="/projects">
            <Button className="w-full flex items-center justify-center gap-2 bg-[#6B00FF] text-white font-semibold py-4 rounded-lg shadow-md hover:bg-[#5800cc] transition-all duration-300">
              <FolderOpen className="w-6 h-6" />
              View Projects
            </Button>
          </Link>
          <Button
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-4 rounded-lg shadow-md hover:bg-green-500 transition-all duration-300"
            onClick={() => alert("Create New Project clicked!")}
          >
            <Plus className="w-6 h-6" />
            Create New Project
          </Button>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-16 max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-white mb-6">
              Recently Uploaded Files
            </h2>
            <ul className="space-y-4">
              {uploadedFiles.map((file) => (
                <li
                  key={file.name}
                  className="p-4 bg-neutral-900 rounded-lg shadow-md flex items-center justify-between"
                >
                  <span className="text-white">{file.name}</span>
                  <Link
                    href={`/projects/${encodeURIComponent(file.name)}`}
                    className="text-[#6B00FF] hover:underline"
                  >
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
