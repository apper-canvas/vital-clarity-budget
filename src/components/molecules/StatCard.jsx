import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ label, value, icon, trend, trendValue, variant = "default" }) => {
  const variants = {
    default: "text-slate-900",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
          <p className={cn("text-3xl font-bold font-display", variants[variant])}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <ApperIcon
                name={trend === "up" ? "TrendingUp" : "TrendingDown"}
                size={16}
                className={trend === "up" ? "text-success" : "text-error"}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-success" : "text-error"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-xl",
            variant === "default" && "bg-slate-100",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10",
            variant === "error" && "bg-error/10"
          )}>
            <ApperIcon
              name={icon}
              size={24}
              className={variants[variant]}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;