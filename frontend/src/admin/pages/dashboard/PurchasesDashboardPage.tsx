import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getChartPurchase } from "../../../api/dashboard";
import "./dashboard.css";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Input from "../../../components/common/input/Input";
import DateRangePicker from "../../../components/common/dateRangePicker/DateRangePicker";
import Loading from "../../../components/common/loading/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  canceled: number[];
  delivered: number[];
  new: number[];
  labels: string[];
}

const PurchasesDashboardPage = () => {
  const [barDataDB, setBarDataDB] = useState<ChartData>({
    canceled: [],
    delivered: [],
    new: [],
    labels: [],
  });
  const [selected, setSelected] = useState<string | null>("year");
  const [year, setYear] = useState<number | null>(2025);
  const [month, setMonth] = useState<number | null>(12);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetVisitAccount();
  }, []);

  const barData = {
    labels: barDataDB?.labels,
    datasets: [
      {
        label: "Đã giao hàng",
        data: barDataDB.delivered,
        backgroundColor: "rgba(95, 192, 75, 0.5)",
      },
      {
        label: "Đã hủy đơn",
        data: barDataDB.canceled,
        backgroundColor: "rgba(218, 49, 49, 0.5)",
      },
      {
        label: "Đơn mới",
        data: barDataDB.new,
        backgroundColor: "rgba(19, 33, 228, 0.5)",
      },
    ],
  };

  const handleGetVisitAccount = () => {
    setLoading(true);
    getChartPurchase({
      type: selected || "year",
      year: year || 2025,
      month: month || 11,
      startDate: fromDate || "",
      endDate: toDate || "",
    })
      .then((response) => {
        setBarDataDB(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching chart purchase data:", error);
      }).finally(() => {
        setLoading(false);
      });
  };
  if (loading) return <Loading />;
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ width: "100%", margin: "0 auto" }}>
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "start",
                alignItems: "center",
                marginBottom: "-28px",
              }}
            >
              {selected === "range" && (
                <div>
                  <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onChangeFrom={setFromDate}
                    onChangeTo={setToDate}
                    error={
                      fromDate &&
                        toDate &&
                        new Date(fromDate) > new Date(toDate)
                        ? "Ngày bắt đầu phải nhỏ hơn ngày kết thúc"
                        : undefined
                    }
                  />
                </div>
              )}

              {selected === "month" && (
                <>
                  <div>
                    <Input
                      value={month ? month.toString() : ""}
                      onChange={(e) =>
                        setMonth(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      placeholder="Nhập tháng..."
                      style={{ width: "100%", marginBottom: "-28px" }}
                    />
                  </div>
                  <div>
                    <Input
                      value={year ? year.toString() : ""}
                      onChange={(e) =>
                        setYear(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      placeholder="Nhập năm..."
                      style={{ width: "100%", marginBottom: "-28px" }}
                    />
                  </div>
                </>
              )}
              {selected === "year" && (
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
                    { label: "Năm", value: "year" },
                    { label: "Tháng", value: "month" },
                    { label: "Khoảng ngày", value: "range" },
                  ]}
                  placeholder={null}
                  error={undefined}
                  style={{ marginBottom: "-28px" }}
                />
              </div>
              <div>
                <button
                  className="btn-chart-purchase"
                  onClick={handleGetVisitAccount}
                >
                  Thống kê
                </button>
              </div>
            </div>
          </div>
        </div>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default PurchasesDashboardPage;
