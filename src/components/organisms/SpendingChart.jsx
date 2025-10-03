import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import ReactApexChart from "react-apexcharts";
import { formatCurrency } from "@/utils/formatters";

const SpendingChart = ({ data, title, type = "donut" }) => {
  const [chartData, setChartData] = useState({ series: [], labels: [] });

  useEffect(() => {
    if (data && data.length > 0) {
      const series = data.map(item => item.value);
      const labels = data.map(item => item.label);
      setChartData({ series, labels });
    }
  }, [data]);

  const options = {
    chart: {
      type: type,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 500,
      },
      toolbar: {
        show: false,
      },
    },
    labels: chartData.labels,
    colors: data.map(item => item.color || "#8B5CF6"),
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      fontFamily: "Inter, sans-serif",
      markers: {
        width: 8,
        height: 8,
        radius: 2,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              color: "#64748b",
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 700,
              color: "#0f172a",
              formatter: function (val) {
                return formatCurrency(val);
              },
            },
            total: {
              show: true,
              label: "Total Spent",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              color: "#64748b",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return formatCurrency(total);
              },
            },
          },
        },
      },
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
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
  };

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-accent/10 rounded-lg">
            <ApperIcon name="PieChart" size={24} className="text-accent" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
            <ApperIcon name="PieChart" size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No data available</p>
          <p className="text-sm text-slate-500">Add some expenses to see the chart</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-accent/10 rounded-lg">
          <ApperIcon name="PieChart" size={24} className="text-accent" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="w-full">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type={type}
          height={320}
        />
      </div>
    </Card>
  );
};

export default SpendingChart;