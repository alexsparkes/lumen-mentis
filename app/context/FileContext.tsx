"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Flashcard {
  term: string;
  definition: string;
}

interface UploadedFile {
  name: string;
  content: string;
}

interface FileContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  uploadedFiles: UploadedFile[];
  deleteFile: (fileName: string) => void;
  downloadFile: (fileName: string) => void; // New method to download a file
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    // Load uploaded files from localStorage on initialization
    const storedFiles = localStorage.getItem("uploadedFiles");
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, []);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile = { name: file.name, content };
        const updatedFiles = [...uploadedFiles, newFile];

        // Save to state and localStorage
        setUploadedFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
      };
      reader.readAsText(file);
    }
  }, [file]);

  const deleteFile = (fileName: string) => {
    const updatedFiles = uploadedFiles.filter((f) => f.name !== fileName);
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    // If the currently selected file is deleted, reset the file state
    if (file?.name === fileName) {
      setFile(null);
    }
  };

  const downloadFile = (fileName: string) => {
    const file = uploadedFiles.find((f) => f.name === fileName);
    if (file) {
      const blob = new Blob([file.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <FileContext.Provider
      value={{ file, setFile, uploadedFiles, deleteFile, downloadFile }}
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
