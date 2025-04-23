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

  return (
    <FileContext.Provider value={{ file, setFile, uploadedFiles }}>
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
