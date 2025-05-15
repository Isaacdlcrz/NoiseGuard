import React from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface BarChartProps {
    dataValues: number[];
}

const BarChart: React.FC<BarChartProps> = ({ dataValues }) => {
    const data = {
        labels: dataValues.map((value) => `${value.toFixed(2)} dB`),
        datasets: [
            {
                label: 'Value',
                data: dataValues.map((value, index) => ({ x: index, y: value })),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 5,
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
            x: {
                title: {
                    display: true,
                    text: 'Index',
                },
            },
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...dataValues) + 10,
                suggestedMin: 0,
                ticks: {
                    callback: (value: number) => `${value} dB`
                }
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Scatter data={data} options={options} />
        </div>
    );
};

export default BarChart;
