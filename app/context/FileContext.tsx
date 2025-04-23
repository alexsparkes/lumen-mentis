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
  deleteFile: (fileName: string) => void; // New method to delete a file
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

  return (
    <FileContext.Provider value={{ file, setFile, uploadedFiles, deleteFile }}>
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
