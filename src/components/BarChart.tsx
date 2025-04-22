import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    dataValues: number[];
}

const BarChart: React.FC<BarChartProps> = ({ dataValues }) => {
    const data = {
        labels: dataValues.map((value) => value.toString()),
        datasets: [
            {
                label: 'Value',
                data: dataValues,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...dataValues) + 10,
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
