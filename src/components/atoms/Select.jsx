import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(
  ({ className, children, error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 bg-white text-slate-900 border rounded-md transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "appearance-none bg-no-repeat bg-right pr-10",
          error ? "border-error focus:ring-error" : "border-slate-300",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "1.5em 1.5em",
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;