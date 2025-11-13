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
  Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getChartWidgets } from '../../../api/dashboard';

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

  const [lineDataDB, setLineDataDB] = useState<(number[] | string[] | number | number)[]>([]);


  useEffect(() => {
    handleGetVisitAccount();
  }, []);

  console.log('lineDataDB', lineDataDB);


  const handleGetVisitAccount = () => {
    getChartWidgets(1).then((response) => {
      setLineDataDB(response?.data);
    }).catch((error) => {
      console.error('Error fetching chart widgets:', error);
    });
  }

  const lineData = {
    labels: (lineDataDB[1] as string[]) || [],
    datasets: [
      {
        label: 'Lượt truy cập',
        data: (lineDataDB[0] as number[]) || [],
        borderColor: 'rgba(53, 162, 235, 0.8)',
        backgroundColor: 'rgba(53, 162, 235, 0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Colors',
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ width: '90%' }}>
        <div style={{ marginBottom: '20px' }}>
          <div></div>
          <div></div>
        </div>
        <Line data={lineData} />
      </div>

      {/* <div style={{ width: '400px' }}>
        <h3>Colors Pie Chart</h3>
        <Pie data={pieData} />
      </div> */}
    </div>
  );
};

export default AnalyticsPage;
