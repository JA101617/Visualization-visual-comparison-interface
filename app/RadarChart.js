import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js/auto';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 颜色主题 - 使用更柔和、易于区分的颜色
const chartColors = {
  resnet: {
    background: 'rgba(255, 159, 64, 0.2)', // 橙色
    border: 'rgba(255, 159, 64, 1)',
    point: 'rgba(255, 159, 64, 1)',
  },
  vgg: {
    background: 'rgba(75, 192, 192, 0.2)', // 青色
    border: 'rgba(75, 192, 192, 1)',
    point: 'rgba(75, 192, 192, 1)',
  }
};

// 按钮样式
const buttonStyles = {
  padding: '8px 16px',
  margin: '5px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: 'white',
};

const RadarChart = () => {
  const [selectedLabelType, setSelectedLabelType] = useState('train_method');
  const [showBothDatasets, setShowBothDatasets] = useState(false);

  // 数据集
  const datasets = [
    {
      label: 'ResNet50',
      data: [0.1527, 0.0536, 0.0745, 0.2256],
      chartData: [0.11319, 0.12486, 0.13203, 0.12482, 0.13804],
      backgroundColor: chartColors.resnet.background,
      borderColor: chartColors.resnet.border,
      pointBackgroundColor: chartColors.resnet.point, // 点颜色
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      borderWidth: 2,
      labels: ['ADV', 'COV', 'IID', 'OOD'],
      chartLabels: ['1', '2', '3', '4', '5'],
    },
    {
      label: 'VGG19',
      data: [0.1328, 0.0369, 0.0561, 0.2093],
      chartData: [0.09548, 0.10958, 0.10857, 0.11361, 0.11666],
      backgroundColor: chartColors.vgg.background,
      borderColor: chartColors.vgg.border,
      pointBackgroundColor: chartColors.vgg.point, // 点颜色
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      borderWidth: 2,
      labels: ['ADV', 'COV', 'IID', 'OOD'],
      chartLabels: ['1', '2', '3', '4', '5'],
    },
  ];

  // 处理标签类型切换
  const handleChangeLabelType = (labelType) => {
    setSelectedLabelType(labelType);
  };

  // 处理数据集显示切换
  const handleShowBothDatasets = () => {
    setShowBothDatasets(!showBothDatasets);
  };

  // 图表数据
  const chartData = {
    labels: datasets[0][selectedLabelType === 'train_method' ? 'labels' : 'chartLabels'],
    datasets: showBothDatasets
      ? datasets.map(dataset => ({
          ...dataset,
          data: dataset[selectedLabelType === 'train_method' ? 'data' : 'chartData'],
        }))
      : [{
          ...datasets[0],
          data: datasets[0][selectedLabelType === 'train_method' ? 'data' : 'chartData'],
        }],
  };

  // 图表配置
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(128, 128, 128, 0.2)',
          lineWidth: 1,
          count: selectedLabelType === 'train_method' ? 4 : 5,
        },
        grid: {
          circular: true,
          color: 'rgba(128, 128, 128, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          beginAtZero: true,
          font: {
            size: 12,
          },
          color: 'rgba(0, 0, 0, 0.8)',
          stepSize: 0.1, // 设置刻度间隔
        },
        suggestedMin: 0,
        suggestedMax: 0.25, // 调整最大值以更好地适应数据范围
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top', // 将图例移动到顶部
        align: 'end', // 右对齐图例
        labels: {
          font: {
            size: 14,
          },
          color: 'rgba(0, 0, 0, 0.8)',
          boxWidth: 12, // 调整图例框大小
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.formattedValue}`; // 显示标签和数值
          }
        }
      },
    },
    interaction: {
      mode: 'nearest', // 设置交互模式为最近的点
      intersect: false,
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}> 
        <button
          onClick={() => handleChangeLabelType('train_method')}
          style={{ ...buttonStyles, backgroundColor: chartColors.resnet.border }}
        >
          训练方法
        </button>
        <button
          onClick={() => handleChangeLabelType('chart_type')}
          style={{ ...buttonStyles, backgroundColor: chartColors.vgg.border }}
        >
          图表类型
        </button>
        <button onClick={handleShowBothDatasets} style={{ ...buttonStyles, backgroundColor: '#6c757d' }}> {/* 灰色按钮 */}
          {showBothDatasets ? '显示单个数据集' : '显示所有数据集'}
        </button>
      </div>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;