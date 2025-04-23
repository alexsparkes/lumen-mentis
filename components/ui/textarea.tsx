import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-[#6B00FF] focus-visible:ring-[#6B00FF]/50 dark:focus-visible:ring-[#6B00FF]/40 flex min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-sm transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
