"use client"

import Image from "next/image";
import Heatmap from "./Heatmap.js";
import Head from "next/head";

import BarChart from "./BarChart.js";
// import BarChart from "./new10BarChart.js";
import data from './data.json';
import RadarChart from "./RadarChart.js";

import React, { useState } from "react";{/* 视图联动使用 */}
import Title from "./title.css";

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
          height: '45vh',
          backgroundColor: 'white',
          borderRadius: '3vh',
          padding: '3vh',
          boxShadow: ['0 2vh 4vh rgba(0, 0, 0, 0.1)', '0 -2vh 4vh rgba(0, 0, 0, 0.1)', '-2vw 2vh 4vh rgba(0, 0, 0, 0.1)', '-2vw -2vh 4vh rgba(0, 0, 0, 0.1)']
        }}>
        <h2>About us</h2>
        <div class="member">
          <h3>Antong Zhang</h3>
          <p>Class: Mixed Class 2304</p>
          <p>Major: Computer Science</p>
        </div>
        <div class="member">
          <h3>Yixin E</h3>
          <p>Class: Mixed Class 2308</p>
          <p>Major: Computer Science</p>
        </div>
        <div class="member">
          <h3>Jinkun Ying</h3>
          <p>Class: Information Security 2201</p>
          <p>Major: Information Security</p>
        </div>
      </div>
      <div style={{
          position: 'absolute',
          bottom: '2vh',
          left: '1vw',
          width: '18vw',
          height: '45vh',
          backgroundColor: 'white',
          borderRadius: '3vh',
          padding: '3vh',
          boxShadow: ['0 2vh 4vh rgba(0, 0, 0, 0.1)', '0 -2vh 4vh rgba(0, 0, 0, 0.1)', '-2vw 2vh 4vh rgba(0, 0, 0, 0.1)', '-2vw -2vh 4vh rgba(0, 0, 0, 0.1)']
        }}>
        <h2>About Dataset</h2>
        <ul>
          <li>AI training data about Cleveland and McGill’s study</li>
          <li>Investigating the impact of features and different models in the training set preparation on the estimation accuracy</li>
        </ul>

      </div>
      <div className="absolute inset-y-0 left-[37vh]" 
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
      <div className="absolute bottom-[2vh] right-[2vw] ">
        <RadarChart 
          data={data} 
          onRadarButtonClick={handleRadarButtonClick}
          stateHeatmapSelect={stateHeatmapSelected} 
        />
      </div>
      <div className="absolute top-[2vh] right-[2vw]">
        <BarChart data={data} />
      </div>
    </div>
  );
}
