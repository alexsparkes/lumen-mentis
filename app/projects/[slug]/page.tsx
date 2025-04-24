"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Edit, BookOpen } from "lucide-react";
import { useFile, UploadedFile } from "@/app/context/FileContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"; // Import the Button component

const ProjectHeader = memo(function ProjectHeader({
  displayName,
  description,
  slug,
}: {
  displayName: string | null;
  description: string | null;
  slug: string | null;
}) {
  if (!displayName && !description) return null; // Render nothing if no data
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{displayName || slug}</h1>
      <p className="text-neutral-400 mb-6">
        {description || "No description available."}
      </p>
    </div>
  );
});

const ActionButtons = memo(function ActionButtons({
  slug,
}: {
  slug: string | null;
}) {
  const router = useRouter();
  if (!slug) return null; // Render nothing if slug is not available
  return (
    <div className="flex gap-4 mb-6 items-center">
      <Button
        variant="secondary" // Secondary button now uses the updated gray color scheme
        className="flex items-center gap-2"
        onClick={() => router.push(`/projects/${slug}/edit`)}
      >
        <Edit className="w-5 h-5" />
        Edit Project
      </Button>
      <Button
        variant="primary" // Primary button remains with the accent color
        className="flex items-center gap-2"
        onClick={() => router.push(`/projects/${slug}/learn`)}
      >
        <BookOpen className="w-5 h-5" />
        Start Learning
      </Button>
    </div>
  );
});

const FileContent = memo(function FileContent({
  content,
}: {
  content: string | null;
}) {
  if (!content) return null; // Render nothing if content is not available
  return (
    <TabsContent value="markdown">
      <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">File Content</h2>
        <pre className="text-neutral-300 whitespace-pre-wrap">{content}</pre>
      </div>
    </TabsContent>
  );
});

const Flashcards = memo(function Flashcards({
  flashcards,
}: {
  flashcards: any[];
}) {
  if (!flashcards || flashcards.length === 0) return null; // Render nothing if no flashcards
  return (
    <TabsContent value="standard-view">
      <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          Terms and Definitions
        </h2>
        <ul className="space-y-4">
          {flashcards.map((flashcard, index) => (
            <li key={index} className="p-4 bg-neutral-900 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-white mb-2">
                {flashcard.term}
              </h3>
              <p className="text-neutral-300">{flashcard.definition}</p>
            </li>
          ))}
        </ul>
      </div>
    </TabsContent>
  );
});

export default function ProjectPage() {
  const { getFileByName } = useFile();
  const [slug, setSlug] = useState<string | null>(null);
  const [file, setFile] = useState<UploadedFile | null>(null); // Replace 'any' with 'UploadedFile | null'
  const router = useRouter();

  const fetchFile = useCallback(
    (pathSlug: string) => {
      const fetchedFile = getFileByName(pathSlug);
      setFile(fetchedFile); // Use in-memory data from context
    },
    [getFileByName]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSlug = decodeURIComponent(
        window.location.pathname.split("/").pop() || ""
      );
      setSlug(pathSlug);
      fetchFile(pathSlug);
    }
    return () => {
      setFile(null); // Cleanup file state on unmount
    };
  }, [fetchFile]);

  // Prefetch the edit and learn pages
  useEffect(() => {
    if (slug) {
      router.prefetch(`/projects/${slug}/edit`);
      router.prefetch(`/projects/${slug}/learn`);
    }
  }, [slug, router]);

  const { content, flashcards, displayName, description } = file || {};

  return (
    <div className="max-w-screen-xl mx-auto text-white p-6">
      <div>
        <div className="flex flex-row justify-between">
          <ProjectHeader
            displayName={displayName}
            description={description}
            slug={slug}
          />

          <ActionButtons slug={slug} />
        </div>

        {/* File Content */}
        <Tabs defaultValue="standard-view" className="w-full">
          <TabsList>
            <TabsTrigger value="standard-view">Standard View</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          <Flashcards flashcards={flashcards || []} />
          {/* <FileContent content={content} /> */}
        </Tabs>
      </div>
    </div>
  );
}
