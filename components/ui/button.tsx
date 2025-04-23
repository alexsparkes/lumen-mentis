import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "link" | "primary" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2"; // Added 'px-4 py-2' for padding
    const variants = {
      default: "bg-[#6B00FF] text-white hover:bg-[#5800cc]",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      link: "text-white hover:text-[#5800cc]",
      primary: "bg-[#6B00FF] text-white hover:bg-[#5800cc]", // Primary button with accent color
      secondary: "bg-neutral-700 text-white hover:bg-neutral-600", // Updated secondary button to fit the dark theme
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
