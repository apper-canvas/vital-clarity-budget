import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 bg-white text-slate-900 border rounded-md transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "placeholder:text-slate-400",
          error ? "border-error focus:ring-error" : "border-slate-300",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;