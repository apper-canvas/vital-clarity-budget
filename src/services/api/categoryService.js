import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoriesData];

const categoryService = {
  getAll: async () => {
    await delay(300);
    return [...categories];
  },

  getById: async (id) => {
    await delay(200);
    const category = categories.find(cat => cat.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  update: async (id, data) => {
    await delay(250);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    categories[index] = { ...categories[index], ...data };
    return { ...categories[index] };
  },
};

export default categoryService;