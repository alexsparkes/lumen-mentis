"use client";

import { useFile } from "../context/FileContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditPage() {
  const { file } = useFile();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flashcards, setFlashcards] = useState<
    { term: string; definition: string }[]
  >([]);

  useEffect(() => {
    if (!file) {
      router.push("/");
    }
  }, [file, router]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        parseMarkdown(content);
      };
      reader.readAsText(file);
    }
  }, [file]);

  const parseMarkdown = (content: string) => {
    const lines = content.split("\n");
    let currentTitle = "";
    let currentDescription = "";
    const parsedFlashcards: { term: string; definition: string }[] = [];

    let currentTerm = "";
    let currentDefinition = "";

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        currentTitle = line.slice(2).trim();
      } else if (line.startsWith("## ")) {
        if (currentTerm && currentDefinition) {
          parsedFlashcards.push({
            term: currentTerm,
            definition: currentDefinition.trim(),
          });
        }
        currentTerm = line.slice(3).trim();
        currentDefinition = "";
      } else if (line.trim() === "") {
        // Skip empty lines
      } else {
        currentDefinition += `${line.trim()}\n`;
      }
    });

    // Add the last flashcard if it exists
    if (currentTerm && currentDefinition) {
      parsedFlashcards.push({
        term: currentTerm,
        definition: currentDefinition.trim(),
      });
    }

    setTitle(currentTitle);
    setDescription(currentDescription);
    setFlashcards(parsedFlashcards);
  };

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

  const exportFlashcards = () => {
    const markdownContent = `# ${title}\n\n${description}\n\n${flashcards
      .map((flashcard) => `## ${flashcard.term}\n\n${flashcard.definition}\n`)
      .join("")}`;
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!file) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Flashcards</h1>
          <p className="text-neutral-500 mb-6">{file.name}</p>
        </div>
        <Button
          onClick={exportFlashcards}
          className="py-2 px-4 bg-green-600 text-white hover:bg-green-500"
        >
          Export Flashcards
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
