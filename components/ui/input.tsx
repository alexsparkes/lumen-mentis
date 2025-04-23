import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-[#6B00FF] focus-visible:ring-[#6B00FF]/50 dark:focus-visible:ring-[#6B00FF]/40 flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
