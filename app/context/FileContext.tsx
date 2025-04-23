"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Flashcard {
  term: string;
  definition: string;
}

interface FileContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  title: string;
  description: string;
  flashcards: Flashcard[];
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

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
    const currentDescription = "";
    const parsedFlashcards: Flashcard[] = [];

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

  return (
    <FileContext.Provider
      value={{ file, setFile, title, description, flashcards }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
}
