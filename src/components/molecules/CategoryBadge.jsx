import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryBadge = ({ category, size = "md" }) => {
  const sizes = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizes[size]
      )}
      style={{
        backgroundColor: `${category.color}15`,
        color: category.color,
      }}
    >
      <ApperIcon name={category.icon} size={iconSizes[size]} />
      <span>{category.name}</span>
    </span>
  );
};

export default CategoryBadge;