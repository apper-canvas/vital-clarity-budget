import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import ReactApexChart from "react-apexcharts";
import { formatCurrency } from "@/utils/formatters";

const ComparisonChart = ({ currentMonth, previousMonth, categories }) => {
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  useEffect(() => {
    if (currentMonth && previousMonth && categories) {
      const categoryNames = categories.map(cat => cat.name);
      const currentData = categories.map(cat => {
        const item = currentMonth.find(m => m.categoryId === cat.Id);
        return item ? item.spent : 0;
      });
      const previousData = categories.map(cat => {
        const item = previousMonth.find(m => m.categoryId === cat.Id);
        return item ? item.spent : 0;
      });

      setChartData({
        categories: categoryNames,
        series: [
          { name: "Current Month", data: currentData },
          { name: "Previous Month", data: previousData },
        ],
      });
    }
  }, [currentMonth, previousMonth, categories]);

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 500,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
          colors: "#64748b",
        },
        formatter: function (val) {
          return formatCurrency(val);
        },
      },
    },
    colors: ["#0EA5E9", "#94a3b8"],
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return formatCurrency(val);
        },
      },
      style: {
        fontSize: "13px",
        fontFamily: "Inter, sans-serif",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "13px",
      fontFamily: "Inter, sans-serif",
      markers: {
        width: 8,
        height: 8,
        radius: 2,
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
    },
  };

  if (!currentMonth || currentMonth.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-info/10 rounded-lg">
            <ApperIcon name="BarChart3" size={24} className="text-info" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Month Comparison</h2>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
            <ApperIcon name="BarChart3" size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No comparison data</p>
          <p className="text-sm text-slate-500">Add expenses to see month-over-month trends</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-info/10 rounded-lg">
          <ApperIcon name="BarChart3" size={24} className="text-info" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Month Comparison</h2>
      </div>
      <div className="w-full">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="bar"
          height={320}
        />
      </div>
    </Card>
  );
};

export default ComparisonChart;