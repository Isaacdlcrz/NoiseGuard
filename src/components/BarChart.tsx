import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// TypeScript interface for the props
interface BarChartProps {
    dataValues: number[]; // Array of numeric values
}

const BarChart: React.FC<BarChartProps> = ({ dataValues }) => {
    // Chart.js data configuration
    const data = {
        labels: dataValues.map((value) => value.toString()), // Convert the numbers to strings for the X-axis
        datasets: [
            {
                label: 'Value',
                data: dataValues, // Use the array as Y-axis values
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Bar color
                borderColor: 'rgba(75, 192, 192, 1)', // Border color
                borderWidth: 1, // Border width for the bars
            },
        ],
    };

    // Chart.js options configuration
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false }, // Hide the legend
        },
        scales: {
            y: {
                beginAtZero: true, // Y-axis starts at 0
                suggestedMax: Math.max(...dataValues) + 10, // Adjust max value for better display
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default BarChart;
