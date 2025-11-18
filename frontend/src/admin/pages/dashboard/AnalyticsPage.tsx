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
import { Line } from "react-chartjs-2";
import { getChartWidgets } from "../../../api/dashboard";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";

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

const AnalyticsPage = () => {
  const [lineDataDB, setLineDataDB] = useState<
    (number[] | string[] | number | number)[]
  >([]);
  const [selected, setSelected] = useState<string | null>("1");

  useEffect(() => {
    handleGetVisitAccount();
  }, []);

  const handleGetVisitAccount = () => {
    getChartWidgets(Number(selected))
      .then((response) => {
        setLineDataDB(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching chart widgets:", error);
      });
  };

  const lineData = {
    labels: (lineDataDB[1] as string[]) || [],
    datasets: [
      {
        label: "Lượt truy cập",
        data: (lineDataDB[0] as number[]) || [],
        borderColor: "rgba(53, 162, 235, 0.8)",
        backgroundColor: "rgba(53, 162, 235, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Biểu đồ lượt truy cập" },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <div className="dashboard-header">
          <div className="dashboard-header-title">Thông kê truy cập</div>
          <div
            style={{
              width: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StringDropdown
              value={selected}
              onChange={setSelected}
              options={[
                { label: "Số lượng truy cập website", value: "1" },
                { label: "Số lượng truy cập sản phẩm", value: "2" },
                { label: "Số lượng hàng bán được", value: "3" },
              ]}
              placeholder={null}
              error={undefined}
              style={{ marginBottom: "-28px" }}
            />

          </div>
        </div>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
