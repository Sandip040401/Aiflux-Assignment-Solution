import React, { useEffect, useState } from 'react';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  RadarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
  Filler,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { RiTempHotLine } from 'react-icons/ri';
import SingleChartPage from './SingleChartPage';

ChartJS.register(
  LineElement,
  BarElement,
  RadarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
  Filler,
  ArcElement,
  RadialLinearScale
);

// Define TypeScript types
interface TemperatureData {
  timestamp: string;
  value: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor: string;
    fill: boolean;
    tension: number;
  }[];
}

const TemperatureGraph: React.FC = () => {
  const [data, setData] = useState<TemperatureData[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get<TemperatureData[]>('http://localhost:5000/temperatures');
      const currentTime = new Date().getTime();

      const filteredData = response.data.filter((item) => {
        const itemTime = new Date(item.timestamp).getTime();
        return currentTime - itemTime <= 60000;
      });

      // Optional: Reduce data points
      const reducedData = filteredData.filter((_, index) => index % 5 === 0);

      setData(reducedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const labels = data.map((item) => new Date(item.timestamp).toLocaleTimeString());
  const values = data.map((item) => item.value);

  const commonData: ChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: '#FF6384',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#FFCE56',
        pointHoverBorderColor: '#FF6384',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#4b5563',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#4b5563',
        },
        grid: {
          borderColor: '#e5e7eb',
        },
        suggestedMin: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#4b5563',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}°C`,
        },
      },
    },
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
              <div className="max-w-7xl w-full bg-white rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                <header className="flex justify-between items-center bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-5 rounded-t-3xl shadow-lg">
                  <h1 className="text-3xl font-semibold flex items-center gap-3 tracking-wide">
                    <RiTempHotLine size={35} className="text-yellow-300 animate-bounce" />
                    Real-Time Temperature Monitor (Last 1 Minute)
                  </h1>
                  <span className="text-sm bg-white bg-opacity-20 rounded-full px-4 py-1 shadow-lg">
                    Updated every 2 seconds
                  </span>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gradient-to-br from-gray-50 to-white">
                  {/* Line Chart */}
                  <Link to="/chart/line" className="block">
                    <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-5 transition transform hover:-translate-y-2 hover:shadow-xl">
                      <h2 className="text-lg font-medium mb-3 text-gray-700">Line Chart</h2>
                      <div className="w-full h-64">
                        <Line data={commonData} options={options} />
                      </div>
                    </div>
                  </Link>

                  {/* Bar Chart */}
                  <Link to="/chart/bar" className="block">
                    <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-5 transition transform hover:-translate-y-2 hover:shadow-xl">
                      <h2 className="text-lg font-medium mb-3 text-gray-700">Bar Chart</h2>
                      <div className="w-full h-64">
                        <Bar data={commonData} options={options} />
                      </div>
                    </div>
                  </Link>

                  {/* Radar Chart */}
                  <Link to="/chart/radar" className="block">
                    <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-5 transition transform hover:-translate-y-2 hover:shadow-xl">
                      <h2 className="text-lg font-medium mb-3 text-gray-700">Radar Chart</h2>
                      <div className="w-full h-64">
                        <Radar data={commonData} options={options} />
                      </div>
                    </div>
                  </Link>

                  {/* Doughnut Chart */}
                  <Link to="/chart/doughnut" className="block">
                    <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-5 transition transform hover:-translate-y-2 hover:shadow-xl">
                      <h2 className="text-lg font-medium mb-3 text-gray-700">Doughnut Chart</h2>
                      <div className="w-full h-64">
                        <Doughnut data={commonData} options={options} />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/chart/:chartType" element={<SingleChartPage chartData={commonData} options={options} />} />
      </Routes>
    </Router>
  );
};

export default TemperatureGraph;
