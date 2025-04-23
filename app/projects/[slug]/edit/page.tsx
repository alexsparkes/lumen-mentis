"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFile } from "@/app/context/FileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Flashcard {
  term: string;
  definition: string;
}

export default function EditPage() {
  const router = useRouter();
  const { uploadedFiles, getFileByName, updateFile } = useFile();
  const [slug, setSlug] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSlug = decodeURIComponent(
        window.location.pathname.split("/").slice(-2, -1)[0]
      );
      setSlug(pathSlug);

      const file = getFileByName(pathSlug);
      if (file) {
        setTitle(file.displayName || file.name);
        setDescription(file.description || "");
        setFlashcards(file.flashcards); // Use pre-parsed flashcards
      }
    }
  }, [getFileByName]);

  const handleFlashcardChange = (
    index: number,
    field: "term" | "definition",
    value: string
  ) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index][field] = value;
    setFlashcards(updatedFlashcards);
  };

  const addFlashcard = () => {
    setFlashcards([...flashcards, { term: "", definition: "" }]);
  };

  const removeFlashcard = (index: number) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
  };

  const saveChanges = () => {
    if (!slug) return;

    // Generate updated markdown content
    const updatedContent = `# ${title}\n\n${description}\n\n${flashcards
      .map((fc) => `## ${fc.term}\n\n${fc.definition}\n`)
      .join("")}`;

    // Use the context's updateFile method to update the file
    updateFile(slug, flashcards);

    alert("Changes saved successfully!");
  };

  if (!slug) {
    return null; // Render nothing until the slug is available
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Flashcards</h1>
          <p className="text-neutral-500 mb-6">{slug}</p>
        </div>
        <Button
          onClick={saveChanges}
          className="py-2 px-4 bg-green-600 text-white hover:bg-green-500"
        >
          Save Changes
        </Button>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-400 mb-1">
          Title
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-400 mb-1">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Flashcards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Flashcards</h2>
        {flashcards.map((flashcard, index) => (
          <div
            key={index}
            className="mb-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700"
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Term
              </label>
              <Input
                type="text"
                value={flashcard.term}
                onChange={(e) =>
                  handleFlashcardChange(index, "term", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Definition
              </label>
              <Textarea
                value={flashcard.definition}
                onChange={(e) =>
                  handleFlashcardChange(index, "definition", e.target.value)
                }
                rows={2}
              />
            </div>
            <button
              onClick={() => removeFlashcard(index)}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <Button
          onClick={addFlashcard}
          className="mt-4 py-2 px-4 bg-[#6B00FF] text-white hover:bg-[#5800cc]"
        >
          Add Flashcard
        </Button>
      </div>
    </div>
  );
}
