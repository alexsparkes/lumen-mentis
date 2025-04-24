"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

interface Flashcard {
  term: string;
  definition: string;
}

interface UploadedFile {
  name: string;
  flashcards: Flashcard[];
  displayName: string;
  description: string;
  stats: {
    quizScores: number[];
    firstUploaded: string;
    lastModified: string;
  };
}

interface FileContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  uploadedFiles: UploadedFile[];
  deleteFile: (fileName: string) => void;
  downloadFile: (fileName: string) => void;
  updateFile: (fileName: string, updatedFlashcards: Flashcard[]) => void;
  recordQuizScore: (fileName: string, score: number) => void;
  getFileByName: (fileName: string) => UploadedFile | undefined;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedFiles = localStorage.getItem("uploadedFiles");
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  const persistToLocalStorage = (files: UploadedFile[]) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      localStorage.setItem("uploadedFiles", JSON.stringify(files));
    }, 300);
  };

  const parseFileContent = (content: string) => {
    const lines = content.split("\n");
    const flashcards: Flashcard[] = [];
    let displayName = "";
    let description = "";
    let currentTerm = "";
    let currentDefinition = "";

    lines.forEach((line, index) => {
      if (index === 0) {
        displayName = line.replace("# ", "").trim();
      } else if (index === 1) {
        description = line.trim();
      } else if (line.startsWith("## ")) {
        if (currentTerm && currentDefinition) {
          flashcards.push({ term: currentTerm, definition: currentDefinition });
        }
        currentTerm = line.replace("## ", "").trim();
        currentDefinition = "";
      } else {
        currentDefinition += `${line.trim()} `;
      }
    });

    if (currentTerm && currentDefinition) {
      flashcards.push({ term: currentTerm, definition: currentDefinition });
    }

    return { displayName, description, flashcards };
  };

  const convertToMarkdown = (file: UploadedFile) => {
    let markdown = `# ${file.displayName}\n${file.description}\n`;
    file.flashcards.forEach((flashcard) => {
      markdown += `## ${flashcard.term}\n${flashcard.definition}\n`;
    });
    return markdown;
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const { displayName, description, flashcards } =
          parseFileContent(content);
        const now = new Date().toISOString();
        const newFile: UploadedFile = {
          name: file.name,
          flashcards,
          displayName,
          description,
          stats: {
            quizScores: [],
            firstUploaded: now,
            lastModified: now,
          },
        };
        addFile(newFile);
      };
      reader.readAsText(file);
    }
  }, [file]);

  const getFileByName = (fileName: string): UploadedFile | undefined => {
    return uploadedFiles.find((file) => file.name === fileName);
  };

  const addFile = (newFile: UploadedFile) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, newFile];
      persistToLocalStorage(updatedFiles);
      return updatedFiles;
    });
  };

  const deleteFile = (fileName: string) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((f) => f.name !== fileName);
      persistToLocalStorage(updatedFiles);
      if (file?.name === fileName) setFile(null);
      return updatedFiles;
    });
  };

  const downloadFile = (fileName: string) => {
    const file = uploadedFiles.find((f) => f.name === fileName);
    if (file) {
      const markdown = convertToMarkdown(file);
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const updateFile = (fileName: string, updatedFlashcards: Flashcard[]) => {
    const now = new Date().toISOString();
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) => {
        if (file.name === fileName) {
          const stats = file.stats || {
            quizScores: [],
            firstUploaded: now,
            lastModified: now,
          };

          return {
            ...file,
            flashcards: updatedFlashcards,
            stats: { ...stats, lastModified: now },
          };
        }
        return file;
      });
      persistToLocalStorage(updatedFiles);
      return updatedFiles;
    });
  };

  const recordQuizScore = (fileName: string, score: number) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) => {
        if (file.name === fileName) {
          const stats = file.stats || {
            quizScores: [],
            firstUploaded: new Date().toISOString(),
            lastModified: new Date().toISOString(),
          };

          return {
            ...file,
            stats: {
              ...stats,
              quizScores: [...stats.quizScores, score],
            },
          };
        }
        return file;
      });
      persistToLocalStorage(updatedFiles);
      return updatedFiles;
    });
  };

  return (
    <FileContext.Provider
      value={{
        file,
        setFile,
        uploadedFiles,
        deleteFile,
        downloadFile,
        updateFile,
        recordQuizScore,
        getFileByName,
      }}
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
