"use client"

import React, { useState,useEffect } from 'react';
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
import Button from '@mui/material/Button'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


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

const RadarChart = ({onRadarButtonClick, onHeatmapSelect}) => {
  const [stateSelectedLabelType, setSelectedLabelType] = useState('SamplingMethod');
  const [stateShowBothDatasets, setShowBothDatasets] = useState(false);

  useEffect(()=>{
    console.log('useEffect for heatmapselect or labeltype change')
    if(onHeatmapSelect && onHeatmapSelect.type && stateSelectedLabelType !== onHeatmapSelect.type ){
      console.log('useEffect for onHeatmapSelect', { onHeatmapSelect, selectedLabelType: stateSelectedLabelType });
      setSelectedLabelType(onHeatmapSelect.type);
      setShowBothDatasets(true);
    }
  },[onHeatmapSelect,stateSelectedLabelType]);
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
    onRadarButtonClick('ModelName',labelType);
  };

  // 处理数据集显示切换
  const handleShowBothDatasets = () => {
    setShowBothDatasets(!stateShowBothDatasets);
  };

  // 图表数据
  const chartData = {
    labels: datasets[0][stateSelectedLabelType === 'SamplingMethod' ? 'labels' : 'chartLabels'],
    datasets: stateShowBothDatasets
      ? datasets.map(dataset => ({
          ...dataset,
          data: dataset[stateSelectedLabelType === 'SamplingMethod' ? 'data' : 'chartData'],
        }))
      : [{
          ...datasets[0],
          data: datasets[0][stateSelectedLabelType === 'SamplingMethod' ? 'data' : 'chartData'],
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
          count: stateSelectedLabelType === 'SamplingMethod' ? 4 : 5,
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
          stepSize: 0.1, 
        },
        suggestedMin: 0,
        suggestedMax: 0.25, 
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top', 
        align: 'end', 
        labels: {
          font: {
            size: 14,
          },
          color: 'rgba(0, 0, 0, 0.8)',
          boxWidth: 12, 
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
            return `${context.dataset.label}: ${context.formattedValue}`; 
          }
        }
      },
    },
    interaction: {
      mode: 'nearest', 
      intersect: false,
    },
  };

  return (
    <div >
      <div style={{ display: 'flex', justifyContent: 'center' }}> 
        <Button variant="outlined"
          onClick={() => {
            console.log('receive sampling method changing request');
            handleChangeLabelType('SamplingMethod');
            onRadarButtonClick('ModelName','SamplingMethod');
          }}
          style={{marginRight:'10px'}}
          sx={{ 
            borderColor: 'rgb(164,168,169)',
            color: 'black',
            fontSize: '17px'
          }}
          //style={{ ...buttonStyles, backgroundColor: chartColors.resnet.border }}
        >
          采样方法
        </Button>
        <Button variant="outlined"
          onClick={() => {
            handleChangeLabelType('BarChartType');
            onRadarButtonClick('ModelName', 'BarChartType'); 
          }}
          style={{marginRight:'10px'}}
          sx={{ 
            borderColor: 'rgb(164,168,169)',
            color: 'black', 
            fontSize: '17px'
          }}
          //style={{ ...buttonStyles, backgroundColor: chartColors.vgg.border }}
        >
          图表类型
        </Button>
        <Button variant="outlined"
          onClick={handleShowBothDatasets} 
          style={{marginRight:'10px'}}
          sx={{ //样式统一
            borderColor: 'rgb(164,168,169)',
            color: 'black',
            fontSize: '17px'
          }}
        > {/* 灰色按钮 */}
          {stateShowBothDatasets ? '显示单个数据集' : '显示所有数据集'}
        </Button>
      </div>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
