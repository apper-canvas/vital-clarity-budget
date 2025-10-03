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
import { formatCurrency, getMonthKey, getPreviousMonth } from "@/utils/formatters";
import expenseService from "@/services/api/expenseService";
import categoryService from "@/services/api/categoryService";

const Dashboard = () => {
const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString());
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previousMonthData, setPreviousMonthData] = useState([]);
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
  }, [selectedMonth]);

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
          <MonthSelector value={selectedMonth} onChange={handleMonthChange} />
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
          <ExpenseForm categories={categories} onSubmit={handleAddExpense} />
        </motion.div>

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