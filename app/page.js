"use client"

import Image from "next/image";
import Heatmap from "./Heatmap.js";
import Head from "next/head";

import BarChart from "./BarChart.js";
import data from './data.json';
import RadarChart from "./RadarChart.js";

import React, { useState } from "react";{/* 视图联动使用 */}

export default function Home() {
  const [HeatmapYAxis,setHeatmapYAxis] = useState('BarChartType');
  const [HeatmapXAxis,setHeatmapXAxis] = useState('ModelName');

  const handleRadarButtonClick = (newXAxis,newYAxis) => {
    setHeatmapXAxis(newXAxis);
    setHeatmapYAxis(newYAxis);
  }
  return (
    <div>
      <h1>
        <title>AI Training Data Visualization</title>
      </h1>
      <div style={{
        position: 'absolute',
        top: '2vh',
        left: '1vw',
        width: '18vw',
        height: '95vh',
        backgroundColor: 'white',
        borderRadius: '3vh',
        padding: '3vh',
        boxShadow: '0 2vh 4vh rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Our Group</h2>
        <p>Introduction about the group.</p>
        <h2>Dataset</h2>
        <p>Information about the dataset.</p>
      </div>
      <div className="absolute inset-y-0 left-[33vh]" 
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          height: 'auto' 
        }}
      >
        <Heatmap xOption={HeatmapXAxis} yOption={HeatmapYAxis} />
      </div>
      <div className="absolute bottom-[23vh] right-[5vw] scale-70" style={{height:'30vh'}}>
        <RadarChart data={data} onRadarButtonClick={handleRadarButtonClick} />
      </div>
      <div className="absolute top-[3vh] right-[1vw] scale-y-70">
      
        <BarChart data={data} />
      </div>
    </div>
  );
}
