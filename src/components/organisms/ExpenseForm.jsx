import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const ExpenseForm = ({ categories, onSubmit, apperClient }) => {
const [formData, setFormData] = useState({
    amount: "",
    categoryId: categories.length > 0 ? categories[0].Id : "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [generatingDescription, setGeneratingDescription] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

const validate = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateDescription = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter an amount first");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category first");
      return;
    }

    const selectedCategory = categories.find(cat => cat.Id === parseInt(formData.categoryId));
    if (!selectedCategory) {
      toast.error("Invalid category selected");
      return;
    }

    try {
      setGeneratingDescription(true);
      
      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_GENERATE_EXPENSE_DESCRIPTION,
        {
          body: JSON.stringify({
            amount: parseFloat(formData.amount),
            categoryName: selectedCategory.name
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (result.success) {
        setFormData(prev => ({ ...prev, note: result.description }));
        toast.success("Description generated successfully!");
      } else {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_EXPENSE_DESCRIPTION}. The response body is: ${JSON.stringify(result)}.`);
        toast.error(result.error || "Failed to generate description");
      }
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_GENERATE_EXPENSE_DESCRIPTION}. The error is: ${error.message}`);
      toast.error("Failed to generate description. Please try again.");
    } finally {
      setGeneratingDescription(false);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (generatingDescription) {
      toast.info("Please wait for description generation to complete");
      return;
    }

    try {
      await onSubmit({
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        date: new Date(formData.date).toISOString(),
        note: formData.note.trim(),
      });

      setFormData({
        amount: "",
        categoryId: categories.length > 0 ? categories[0].Id : "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
      
      toast.success("Expense added successfully!");
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-lg">
          <ApperIcon name="PlusCircle" size={24} className="text-primary" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Add Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                $
              </span>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="pl-7"
                error={errors.amount}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-error mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <Label required>Category</Label>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              error={errors.categoryId}
            >
              {categories.map(category => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-error mt-1">{errors.categoryId}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              error={errors.date}
            />
            {errors.date && (
              <p className="text-sm text-error mt-1">{errors.date}</p>
            )}
          </div>

          <div>
<Label>Note (Optional)</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="e.g., Grocery shopping"
                maxLength={100}
                disabled={generatingDescription}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={generatingDescription || !formData.amount || !formData.categoryId}
                className="px-3 shrink-0"
                title="Generate description with AI"
              >
                {generatingDescription ? (
                  <ApperIcon name="Loader2" size={18} className="animate-spin" />
                ) : (
                  <ApperIcon name="Sparkles" size={18} />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
<Button type="submit" size="lg" className="gap-2" disabled={generatingDescription}>
            <ApperIcon name="Plus" size={18} />
            Add Expense
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExpenseForm;