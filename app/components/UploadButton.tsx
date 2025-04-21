interface UploadButtonProps {
  selectedFile: File | null;
}

export default function UploadButton({ selectedFile }: UploadButtonProps) {
  return (
    <div className="flex justify-end mt-4 w-[32rem] mx-auto">
      <button
        type="submit"
        className={`btn btn-primary bg-[#6B00FF] hover:bg-[#5800cc] text-white font-semibold py-2 px-6 rounded ${
          !selectedFile ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!selectedFile}
      >
        Upload
      </button>
    </div>
  );
}
