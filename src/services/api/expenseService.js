import expensesData from "@/services/mockData/expenses.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let expenses = [...expensesData];

const expenseService = {
  getAll: async () => {
    await delay(300);
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getById: async (id) => {
    await delay(200);
    const expense = expenses.find(exp => exp.Id === parseInt(id));
    if (!expense) {
      throw new Error("Expense not found");
    }
    return { ...expense };
  },

  create: async (expenseData) => {
    await delay(300);
    const maxId = expenses.length > 0 ? Math.max(...expenses.map(e => e.Id)) : 0;
    const newExpense = {
      Id: maxId + 1,
      ...expenseData,
      createdAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  update: async (id, data) => {
    await delay(250);
    const index = expenses.findIndex(exp => exp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    expenses[index] = { ...expenses[index], ...data };
    return { ...expenses[index] };
  },

  delete: async (id) => {
    await delay(250);
    const index = expenses.findIndex(exp => exp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    expenses.splice(index, 1);
    return { success: true };
  },

  getByMonth: async (monthKey) => {
    await delay(300);
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
      return expenseMonthKey === monthKey;
    });
    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  },
};

export default expenseService;