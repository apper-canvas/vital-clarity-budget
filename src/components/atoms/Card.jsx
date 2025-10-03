import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-xl shadow-card transition-all duration-150",
          hover && "hover:shadow-card-hover hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;