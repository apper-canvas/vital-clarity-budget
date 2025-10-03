import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-sky-600 focus:ring-primary active:scale-[0.98]",
      secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300 active:scale-[0.98]",
      outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary active:scale-[0.98]",
      danger: "bg-error text-white hover:bg-red-600 focus:ring-error active:scale-[0.98]",
      ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;