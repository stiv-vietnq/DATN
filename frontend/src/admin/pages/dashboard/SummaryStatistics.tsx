// chartjs-setup.ts
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { useEffect, useState } from 'react';
import { Chart, Line } from 'react-chartjs-2';
import { getChartRevenue } from "../../../api/dashboard";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Input from "../../../components/common/input/Input";
import DateRangePicker from "../../../components/common/dateRangePicker/DateRangePicker";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface RevenueData {
  growthPercent: number[];
  revenues: number[];
  labels: string[];
}

const SummaryStatistics = () => {

  const [revenueDB, setRevenueDB] = useState<RevenueData>({
    growthPercent: [],
    revenues: [],
    labels: [],
  });
  const [selected, setSelected] = useState<string | null>("2");
  const [year, setYear] = useState<number | null>(2025);
  const [month, setMonth] = useState<number | null>(11);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  useEffect(() => {
    handleChartRevenue();
  }, []);

  const handleChartRevenue = () => {
    getChartRevenue({
      type: Number(selected) || 3,
      year: year || 2025,
      month: month || 11,
      startDate: fromDate || "",
      endDate: toDate || ""
    }).then((response) => {
      setRevenueDB(response?.data);
    }).catch((error) => {
      console.error('Error fetching chart widgets:', error);
    });
  }

  const data = {
    labels: revenueDB?.labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Doanh thu (triệu)",
        backgroundColor: "#4e79a7",
        data: revenueDB?.revenues,
        borderRadius: 6,
      },
      {
        type: "line" as const,
        label: "Tăng trưởng (%)",
        borderColor: "#e15759",
        borderWidth: 3,
        data: revenueDB?.growthPercent,
        tension: 0.3,
        yAxisID: "percentageAxis",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Doanh thu & tăng trưởng theo tháng",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Doanh thu (Triệu)" },
      },
      percentageAxis: {
        position: "right" as const,
        beginAtZero: true,
        title: { display: true, text: "Tăng trưởng (%)" },
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <div className="dashboard-header">
          <div className='dashboard-header-title'>Thống kê doanh thu</div>
          <div className='dashboard-header-content'>
            <div style={{ display: "flex", gap: "10px", justifyContent: "end", alignItems: "center", marginBottom: "-28px" }}>
              {selected === "1" && (
                <div>
                  <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onChangeFrom={setFromDate}
                    onChangeTo={setToDate}
                    error={
                      fromDate && toDate && new Date(fromDate) > new Date(toDate)
                        ? "Ngày bắt đầu phải nhỏ hơn ngày kết thúc"
                        : undefined
                    }
                  />
                </div>
              )}

              {selected === "2" && (
                <>
                  <div>
                    <Input
                      value={month ? month.toString() : ""}
                      onChange={(e) =>
                        setMonth(e.target.value ? parseInt(e.target.value) : null)
                      }
                      placeholder="Nhập tháng..."
                      style={{ width: "100%", marginBottom: "-28px" }}
                    />
                  </div>
                  <div>
                    <Input
                      value={year ? year.toString() : ""}
                      onChange={(e) =>
                        setYear(e.target.value ? parseInt(e.target.value) : null)
                      }
                      placeholder="Nhập năm..."
                      style={{ width: "100%", marginBottom: "-28px" }}
                    />
                  </div>
                </>
              )}
              {selected === "3" && (
                <div>
                  <Input
                    value={year ? year.toString() : ""}
                    onChange={(e) =>
                      setYear(e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="Nhập năm..."
                    style={{ width: "100%", marginBottom: "-28px" }}
                  />
                </div>
              )}
              <div>
                <StringDropdown
                  value={selected}
                  onChange={setSelected}
                  options={[
                    { label: "Năm", value: "3" },
                    { label: "Tháng", value: "2" },
                    { label: "Khoảng ngày", value: "1" },
                  ]}
                  placeholder={null}
                  error={undefined}
                  style={{ marginBottom: "-28px" }}
                />
              </div>
              <div>
                <button className="btn-chart-purchase" onClick={handleChartRevenue}>Thống kê</button>
              </div>
            </div>
          </div>
        </div>
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
};

export default SummaryStatistics;
