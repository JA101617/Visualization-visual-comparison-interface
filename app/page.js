"use client"

import Image from "next/image";
import Heatmap from "./Heatmap.js";
import Head from "next/head";

import BarChart from "./BarChart.js";
// import BarChart from "./new10BarChart.js";
import data from './data.json';
import RadarChart from "./RadarChart.js";

import React, { useState } from "react";{/* 视图联动使用 */}

export default function Home() {
  const [HeatmapYAxis,setHeatmapYAxis] = useState('BarChartType');
  const [HeatmapXAxis,setHeatmapXAxis] = useState('DownsamplingLevel');


  const handleRadarButtonClick = (newXAxis,newYAxis) => {
    console.log('handleRadarButtonClick', { newXAxis, newYAxis });
    //if(HeatmapXAxis!=newXAxis) 
      setHeatmapXAxis(newXAxis);
    //if(HeatmapYAxis!=newYAxis) 
      setHeatmapYAxis(newYAxis);
    //console.log('After handle X Y', { HeatmapXAxis, HeatmapYAxis });
  }

  const [stateHeatmapSelected,setHeatmapSelect] = useState(null);
  const radarOnHandleHeatmapSelect = (control) => {
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
          boxShadow: ['0 2vh 4vh rgba(0, 0, 0, 0.1)', '0 -2vh 4vh rgba(0, 0, 0, 0.1)', '-2vw 2vh 4vh rgba(0, 0, 0, 0.1)', '-2vw -2vh 4vh rgba(0, 0, 0, 0.1)']
        }}>
        <h2>About us</h2>
        <p>Introduction about the group.</p>
        <h2 style={{fontSize:'20px'}}>About Dataset</h2>
        <p>The dataset we are working with consists of empirical study results from several AI algorithms reading charts. These charts include five different types of bar charts, each with unique characteristics. The study aims to understand the differences in AI model outcomes based on the input chart types. Specifically, the dataset explores how well AI models can estimate the ratio between two bars in the charts. </p>

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
          onHeatmapSelect={radarOnHandleHeatmapSelect ? radarOnHandleHeatmapSelect : ()=>{
            console.log("dummy onHeatmapSelect 1");
          }}
          xUpdater={setHeatmapXAxis}
        />
      </div>
      <div className="absolute bottom-[30vh] right-[5vw] scale-60" style={{height:'25vh'}}>
        <RadarChart 
          data={data} 
          onRadarButtonClick={handleRadarButtonClick}
          stateHeatmapSelect={stateHeatmapSelected} 
        />
      </div>
      <div className="absolute top-[2vh] right-[13vw]">
        <BarChart data={data} />
      </div>
    </div>
  );
}
