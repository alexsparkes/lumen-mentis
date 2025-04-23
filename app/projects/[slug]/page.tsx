"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, BookOpen, ArrowLeft } from "lucide-react";
import { useFile } from "@/app/context/FileContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Flashcard {
  term: string;
  definition: string;
}

export default function ProjectPage() {
  const router = useRouter();
  const { uploadedFiles } = useFile();
  const [slug, setSlug] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    // Access `window` only on the client side
    const pathSlug = decodeURIComponent(
      window.location.pathname.split("/").pop() || ""
    );
    setSlug(pathSlug);

    // Find the file content based on the slug
    const file = uploadedFiles.find((f) => f.name === pathSlug);
    if (file) {
      setFileContent(file.content);
      parseFlashcards(file.content);
    } else {
      setFileContent(null);
    }
  }, [uploadedFiles]);

  const parseFlashcards = (content: string) => {
    const lines = content.split("\n");
    const parsedFlashcards: Flashcard[] = [];
    let currentTerm = "";
    let currentDefinition = "";

    lines.forEach((line) => {
      if (line.startsWith("## ")) {
        if (currentTerm && currentDefinition) {
          parsedFlashcards.push({
            term: currentTerm,
            definition: currentDefinition,
          });
        }
        currentTerm = line.replace("## ", "").trim();
        currentDefinition = "";
      } else {
        currentDefinition += `${line.trim()} `;
      }
    });

    if (currentTerm && currentDefinition) {
      parsedFlashcards.push({
        term: currentTerm,
        definition: currentDefinition,
      });
    }

    setFlashcards(parsedFlashcards);
  };

  if (!slug) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-neutral-950 text-white">
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Project Header */}
        <div className="bg-neutral-900 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{slug}</h1>
          <p className="text-neutral-400 mb-6">
            Manage your project by editing flashcards or starting a learning
            session.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition-all"
              onClick={() => router.push(`/projects/${slug}/edit`)}
            >
              <Edit className="w-5 h-5" />
              Edit Project
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 transition-all"
              onClick={() => router.push(`/projects/${slug}/learn`)}
            >
              <BookOpen className="w-5 h-5" />
              Start Learning
            </button>
          </div>

          {/* File Content */}
          <Tabs defaultValue="standard-view" className="w-full">
            <TabsList>
              <TabsTrigger value="standard-view">Standard View</TabsTrigger>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="standard-view">
              <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Terms and Definitions
                </h2>
                {flashcards.length > 0 ? (
                  <ul className="space-y-4">
                    {flashcards.map((flashcard, index) => (
                      <li
                        key={index}
                        className="p-4 bg-neutral-900 rounded-lg shadow-md"
                      >
                        <h3 className="text-lg font-bold text-white mb-2">
                          {flashcard.term}
                        </h3>
                        <p className="text-neutral-300">
                          {flashcard.definition}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-500">
                    No terms and definitions found in this file.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="markdown">
              <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-white mb-4">
                  File Content
                </h2>
                {fileContent ? (
                  <pre className="text-neutral-300 whitespace-pre-wrap">
                    {fileContent}
                  </pre>
                ) : (
                  <p className="text-neutral-500">
                    No content available for this file.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
