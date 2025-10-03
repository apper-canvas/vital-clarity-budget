import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const ExpenseList = ({ expenses, categories, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [filter, setFilter] = useState("");

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  const filteredExpenses = expenses.filter(expense => {
    const category = getCategoryById(expense.categoryId);
    if (!category) return false;
    
    const searchLower = filter.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchLower) ||
      (expense.note && expense.note.toLowerCase().includes(searchLower)) ||
      formatCurrency(expense.amount).toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (expense) => {
    setEditingId(expense.Id);
    setEditAmount(expense.amount.toString());
    setEditNote(expense.note || "");
  };

  const handleSaveEdit = async (expense) => {
    if (!editAmount || parseFloat(editAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await onEdit(expense.Id, {
        amount: parseFloat(editAmount),
        note: editNote.trim(),
      });
      setEditingId(null);
      toast.success("Expense updated successfully!");
    } catch (error) {
      toast.error("Failed to update expense");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditNote("");
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await onDelete(expenseId);
        toast.success("Expense deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete expense");
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 rounded-lg">
            <ApperIcon name="Receipt" size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Expenses</h2>
            <p className="text-sm text-slate-600">{filteredExpenses.length} transactions</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <ApperIcon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            type="text"
            placeholder="Search expenses..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {filteredExpenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                <ApperIcon name="SearchX" size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">No expenses found</p>
              <p className="text-sm text-slate-500">
                {filter ? "Try adjusting your search" : "Add your first expense to get started"}
              </p>
            </motion.div>
          ) : (
            filteredExpenses.map((expense, index) => {
              const category = getCategoryById(expense.categoryId);
              if (!category) return null;

              const isEditing = editingId === expense.Id;

              return (
                <motion.div
                  key={expense.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all duration-150"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                              $
                            </span>
                            <Input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              step="0.01"
                              min="0"
                              className="pl-7"
                              autoFocus
                            />
                          </div>
                        </div>
                        <CategoryBadge category={category} />
                      </div>
                      <Input
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder="Add a note..."
                        maxLength={100}
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSaveEdit(expense)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <CategoryBadge category={category} />
                          <span className="text-sm text-slate-500">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                        {expense.note && (
                          <p className="text-sm text-slate-600 truncate">{expense.note}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-lg font-bold font-display text-slate-900 whitespace-nowrap">
                          {formatCurrency(expense.amount)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(expense)}
                            className="p-1.5"
                          >
                            <ApperIcon name="Pencil" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.Id)}
                            className="p-1.5 text-error hover:bg-error/10"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default ExpenseList;