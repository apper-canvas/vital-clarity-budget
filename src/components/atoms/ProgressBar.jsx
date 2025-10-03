import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const ProgressBar = forwardRef(
  ({ className, value = 0, max = 100, variant = "default", showLabel = false, ...props }, ref) => {
    const percentage = Math.min((value / max) * 100, 100);
    
    const getColorClass = () => {
      if (variant !== "default") {
        const variants = {
          success: "bg-success",
          warning: "bg-warning",
          error: "bg-error",
          info: "bg-info",
          primary: "bg-primary",
        };
        return variants[variant];
      }
      
      if (percentage < 70) return "bg-success";
      if (percentage < 90) return "bg-warning";
      return "bg-error";
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-medium text-slate-700">{Math.round(percentage)}%</span>
          </div>
        )}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-out",
              getColorClass()
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;