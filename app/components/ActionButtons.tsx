import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ActionButtonsProps {
  selectedFile: File | null;
}

export default function ActionButtons({ selectedFile }: ActionButtonsProps) {
  return (
    <div className="flex justify-between gap-4 mt-4 w-[32rem] mx-auto">
      <Link href="/create">
        <Button variant="link" className={`py-2 px-6`}>
          Create new
        </Button>
      </Link>
      <div className="flex gap-4">
        {selectedFile ? (
          <Link href="/edit">
            <Button variant="default" className="py-2 px-6">
              Edit
            </Button>
          </Link>
        ) : (
          <Button
            variant="default"
            className="py-2 px-6 opacity-50 cursor-not-allowed"
            disabled
          >
            Edit
          </Button>
        )}
        {selectedFile ? (
          <Link href="/learn">
            <Button variant="default" className="py-2 px-6">
              Learn
            </Button>
          </Link>
        ) : (
          <Button
            variant="default"
            className="py-2 px-6 opacity-50 cursor-not-allowed"
            disabled
          >
            Learn
          </Button>
        )}
      </div>
    </div>
  );
}
