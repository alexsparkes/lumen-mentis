"use client";

import { useFile } from "../context/FileContext";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

export default function ProjectsPage() {
  const { uploadedFiles } = useFile();

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-6">Projects</h1>
      <p className="text-neutral-400 mb-10">
        Browse and manage your uploaded markdown files.
      </p>

      {uploadedFiles.length === 0 ? (
        <p className="text-neutral-500">
          No projects found. Upload a file to get started.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadedFiles.map((file) => (
            <li
              key={file.name}
              className="p-4 bg-neutral-900 rounded-lg shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                <FolderOpen className="text-[#6B00FF] w-6 h-6" />
                <span className="text-white font-semibold">{file.name}</span>
              </div>
              <Link
                href={`/projects/${encodeURIComponent(file.name)}`}
                className="mt-auto py-2 px-4 bg-[#6B00FF] text-white text-center rounded-lg hover:bg-[#5800cc] transition-all duration-300"
              >
                Open Project
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
