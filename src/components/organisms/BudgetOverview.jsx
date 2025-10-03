import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/atoms/ProgressBar";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";

const BudgetOverview = ({ budgets }) => {
  const getStatusIcon = (percentage) => {
    if (percentage < 70) return "CheckCircle2";
    if (percentage < 90) return "AlertCircle";
    return "XCircle";
  };

  const getStatusColor = (percentage) => {
    if (percentage < 70) return "text-success";
    if (percentage < 90) return "text-warning";
    return "text-error";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget, index) => {
        const percentage = budget.monthlyLimit > 0 
          ? (budget.spent / budget.monthlyLimit) * 100 
          : 0;
        const remaining = Math.max(0, budget.monthlyLimit - budget.spent);

        return (
          <motion.div
            key={budget.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 hover:shadow-card-hover transition-shadow duration-150">
              <div className="flex items-start justify-between mb-4">
                <CategoryBadge category={budget} size="lg" />
                <ApperIcon
                  name={getStatusIcon(percentage)}
                  size={20}
                  className={getStatusColor(percentage)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-slate-600">Spent</span>
                  <span className="text-2xl font-bold font-display text-slate-900">
                    {formatCurrency(budget.spent)}
                  </span>
                </div>

                <ProgressBar value={budget.spent} max={budget.monthlyLimit} />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    of {formatCurrency(budget.monthlyLimit)}
                  </span>
                  <span className={percentage >= 100 ? "text-error font-medium" : "text-success font-medium"}>
                    {formatCurrency(remaining)} left
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BudgetOverview;