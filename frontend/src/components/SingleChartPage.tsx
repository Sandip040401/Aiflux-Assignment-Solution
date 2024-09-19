import React from 'react';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';

const chartComponents: any = {
  line: Line,
  bar: Bar,
  radar: Radar,
  doughnut: Doughnut,
};

interface SingleChartPageProps {
  chartData: any;
  options: any;
  onBack: () => void; // Added prop for back button handling
}

const SingleChartPage: React.FC<SingleChartPageProps> = ({ chartData, options, onBack }) => {
  const { chartType } = useParams<{ chartType: string }>();
  const navigate = useNavigate();
  // @ts-ignore
  const ChartComponent = chartComponents[chartType];

  const handleBackClick = () => {
    onBack(); // Reset the chart format
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={handleBackClick}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
        >
          Back
        </button>
        <h1 className="text-3xl font-semibold text-center mb-4 capitalize">{chartType} Chart</h1>
        <div className="w-full h-[500px]">
          {ChartComponent ? (
            <ChartComponent data={chartData} options={options} />
          ) : (
            <p className="text-center text-red-500 text-lg">Invalid Chart Type</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleChartPage;
