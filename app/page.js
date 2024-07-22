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
  const [HeatmapXAxis,setHeatmapXAxis] = useState('DownsamplingLevel');

  const handleRadarButtonClick = (newXAxis,newYAxis) => {
    console.log('handleRadarButtonClick', { newXAxis, newYAxis });
    if(HeatmapXAxis!=newXAxis) setHeatmapXAxis(newXAxis);
    if(HeatmapYAxis!=newYAxis) setHeatmapYAxis(newYAxis);
  }

  const [stateHeatmapSelected,setHeatmapSelect] = useState(null);
  const handleHeatmapSelect = (control) => {
    console.log('handleHeatmapSelect', { control });
    setHeatmapSelect(prevControl => {
      if (prevControl && prevControl.type === control.type) {
        return prevControl; // 没有变化，保持原值
      }
      return control; // 值发生变化，更新
    });
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
        <Heatmap 
          xOption={HeatmapXAxis} 
          yOption={HeatmapYAxis} 
          onHeatmapSelect={handleHeatmapSelect ? handleHeatmapSelect : ()=>{
            console.log("dummy onHeatmapSelect 1");
          }}
        />
      </div>
      <div className="absolute bottom-[23vh] right-[5vw] scale-70" style={{height:'30vh'}}>
        <RadarChart 
          data={data} 
          onRadarButtonClick={handleRadarButtonClick}
          onHeatmapSelect={handleHeatmapSelect ? handleHeatmapSelect : ()=>{
            console.log('dummy onHeatmapSelect 2');
          }} 
        />
      </div>
      <div className="absolute top-[3vh] right-[1vw] scale-y-70">
      
        <BarChart data={data} />
      </div>
    </div>
  );
}
