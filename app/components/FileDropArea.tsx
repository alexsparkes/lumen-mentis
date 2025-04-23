import { FaFolderOpen } from "react-icons/fa";

interface FileDropAreaProps {
  isDragging: boolean;
  selectedFile: File | null;
  handleChooseFileClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>; // Allow null
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileDropArea({
  isDragging,
  selectedFile,
  handleChooseFileClick,
  fileInputRef,
  handleFileChange,
}: FileDropAreaProps) {
  return (
    <div
      className={`bg-neutral-900 p-10 rounded-lg border-2 border-dashed transition-all duration-300 ${
        isDragging ? "border-[#6B00FF]" : "border-neutral-800"
      } shadow-lg w-[32rem] mx-auto text-center`}
    >
      <div className="flex justify-center mb-4">
        <div className="bg-[#6B00FF] w-16 h-16 rounded-full flex items-center justify-center">
          <FaFolderOpen className="text-white text-2xl" />
        </div>
      </div>
      <div>
        {selectedFile ? (
          <p className="text-neutral-300">{selectedFile.name}</p>
        ) : (
          <p className="text-sm text-neutral-400 mt-2">
            Drag and drop your markdown file here or{" "}
            <span
              className="text-[#6B00FF] underline cursor-pointer"
              onClick={handleChooseFileClick}
            >
              choose file
            </span>
            .
          </p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        className="hidden"
        accept=".md"
        onChange={handleFileChange}
        title="Upload a markdown file"
      />
      <p className="text-xs text-neutral-500 mt-4">
        Supported format: Markdown (.md)
      </p>
    </div>
  );
}
