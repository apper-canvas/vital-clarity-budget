import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MonthSelector from "@/components/molecules/MonthSelector";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import BudgetOverview from "@/components/organisms/BudgetOverview";
import ExpenseForm from "@/components/organisms/ExpenseForm";
import SpendingChart from "@/components/organisms/SpendingChart";
import ExpenseList from "@/components/organisms/ExpenseList";
import ComparisonChart from "@/components/organisms/ComparisonChart";
import { formatCurrency, getMonthKey, getPreviousMonth, formatMonthYear } from "@/utils/formatters";
import expenseService from "@/services/api/expenseService";
import categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { toast } from "react-toastify";
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});
const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString());
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previousMonthData, setPreviousMonthData] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [apperClient, setApperClient] = useState(null);

  useEffect(() => {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    setApperClient(client);
  }, []);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoriesData, expensesData] = await Promise.all([
        categoryService.getAll(),
        expenseService.getByMonth(getMonthKey(selectedMonth)),
      ]);

      setCategories(categoriesData);
      setExpenses(expensesData);

      const budgetsWithSpending = categoriesData.map(category => {
        const categoryExpenses = expensesData.filter(
          exp => exp.categoryId === category.Id
        );
        const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        return {
          ...category,
          spent,
        };
      });

      setBudgets(budgetsWithSpending);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadData();
    setAiSummary(null);
    setSummaryError("");
  }, [selectedMonth]);

  const generateAISummary = async () => {
    if (!apperClient) {
      toast.error("ApperClient not initialized");
      return;
    }

    if (expenses.length === 0) {
      toast.info("No expenses to analyze for this period");
      return;
    }

    try {
      setGeneratingSummary(true);
      setSummaryError("");
      
      const expensesWithCategories = expenses.map(exp => {
        const category = categories.find(cat => cat.Id === exp.categoryId);
        return {
          ...exp,
          categoryName: category?.name || 'Uncategorized'
        };
      });

      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_ANALYZE_SPENDING,
        {
          body: JSON.stringify({
            expenses: expensesWithCategories,
            dateRange: formatMonthYear(selectedMonth),
            categories: categories
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (result.success === false) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_ANALYZE_SPENDING}. The response body is: ${JSON.stringify(result)}.`);
        setSummaryError(result.error || "Failed to generate AI summary");
        toast.error(result.error || "Failed to generate AI summary");
        return;
      }

      setAiSummary(result.summary);
      toast.success("AI spending summary generated!");
      
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_ANALYZE_SPENDING}. The error is: ${error.message}`);
      setSummaryError(error.message || "Failed to generate AI summary");
      toast.error("Failed to generate AI summary");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const loadPreviousMonth = async () => {
    try {
      const prevExpenses = await expenseService.getByMonth(previousMonthKey);
      const prevData = categories.map(category => {
        const categoryExpenses = prevExpenses.filter(
          exp => exp.categoryId === category.Id
        );
        const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        return {
          categoryId: category.Id,
          spent,
        };
      });
      setPreviousMonthData(prevData);
    } catch (err) {
      console.error("Failed to load previous month data:", err);
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      loadPreviousMonth();
    }
  }, [selectedMonth, categories]);

  const handleAddExpense = async (expenseData) => {
    await expenseService.create(expenseData);
    await loadData();
  };

  const handleEditExpense = async (id, data) => {
    await expenseService.update(id, data);
    await loadData();
  };

  const handleDeleteExpense = async (id) => {
    await expenseService.delete(id);
    await loadData();
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <Loading type="stats" />
          <div className="h-[200px] bg-slate-200 rounded-xl animate-pulse"></div>
          <Loading type="budgets" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Loading type="list" />
            <Loading type="chart" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getOverallVariant = () => {
    if (overallPercentage >= 100) return "error";
    if (overallPercentage >= 90) return "warning";
    return "success";
  };

const chartData = budgets
    .filter(b => b.spent > 0)
    .map(b => ({
      label: b.name,
      value: b.spent,
      color: b.color,
    }));
  const currentMonthData = budgets.map(b => ({
    categoryId: b.Id,
    spent: b.spent,
}));

  const previousMonthKey = getMonthKey(getPreviousMonth(selectedMonth));
  return (
<div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-slate-900 mb-1">
              Clarity Budget
            </h1>
            <p className="text-slate-600">Track your spending with ease</p>
          </div>
          <div className="flex items-center gap-3">
            <MonthSelector value={selectedMonth} onChange={handleMonthChange} />
            <Button
              onClick={generateAISummary}
              disabled={generatingSummary || loading || expenses.length === 0}
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <ApperIcon name="Sparkles" size={16} />
              {generatingSummary ? "Analyzing..." : "AI Summary"}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatCard
            label="Total Budget"
            value={formatCurrency(totalBudget)}
            icon="Wallet"
            variant="default"
          />
          <StatCard
            label="Total Spent"
            value={formatCurrency(totalSpent)}
            icon="TrendingUp"
            variant={getOverallVariant()}
          />
          <StatCard
            label="Remaining"
            value={formatCurrency(totalRemaining)}
            icon="PiggyBank"
            variant={totalRemaining >= 0 ? "success" : "error"}
          />
        </motion.div>

<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ExpenseForm categories={categories} onSubmit={handleAddExpense} apperClient={apperClient} />
        </motion.div>

        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ApperIcon name="Sparkles" size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    AI Spending Analysis
                  </h3>
                  <p className="text-sm text-slate-600">
                    Powered by Claude AI • {formatMonthYear(selectedMonth)}
                  </p>
                </div>
                <button
                  onClick={() => setAiSummary(null)}
                  className="p-1 hover:bg-white/50 rounded transition-colors"
                >
                  <ApperIcon name="X" size={18} className="text-slate-500" />
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {aiSummary}
              </div>
            </Card>
          </motion.div>
        )}

        {summaryError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <ApperIcon name="AlertCircle" size={18} />
                <p className="text-sm font-medium">{summaryError}</p>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BudgetOverview budgets={budgets} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <ExpenseList
            expenses={expenses}
            categories={categories}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
          <div className="space-y-6">
            <SpendingChart data={chartData} title="Spending Distribution" />
            <ComparisonChart
              currentMonth={currentMonthData}
              previousMonth={previousMonthData}
              categories={categories}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;