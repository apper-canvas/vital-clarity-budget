import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatMonthYear } from "@/utils/formatters";

const MonthSelector = ({ value, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(value);

  useEffect(() => {
    setCurrentMonth(value);
  }, [value]);

  const handlePrevious = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    const newMonth = date.toISOString();
    setCurrentMonth(newMonth);
    onChange(newMonth);
  };

  const handleNext = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    const newMonth = date.toISOString();
    setCurrentMonth(newMonth);
    onChange(newMonth);
  };

  const handleToday = () => {
    const today = new Date().toISOString();
    setCurrentMonth(today);
    onChange(today);
  };

  const isCurrentMonth = () => {
    const today = new Date();
    const selected = new Date(currentMonth);
    return (
      today.getMonth() === selected.getMonth() &&
      today.getFullYear() === selected.getFullYear()
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevious}
        className="p-2"
      >
        <ApperIcon name="ChevronLeft" size={20} />
      </Button>
      
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-slate-900 min-w-[160px] text-center">
          {formatMonthYear(currentMonth)}
        </h2>
        {!isCurrentMonth() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="text-primary hover:text-sky-700"
          >
            Today
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNext}
        className="p-2"
      >
        <ApperIcon name="ChevronRight" size={20} />
      </Button>
    </div>
  );
};

export default MonthSelector;