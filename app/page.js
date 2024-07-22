import Image from "next/image";
import Heatmap from "./Heatmap.js"
import Head from "next/head"

import BarChart from "./BarChart.js"
import data from './data.json';
import RadarChart from "./RadarChart.js"

export default function Home() {
  return (
    <div>
      <h1>
        <title>AI Training Data Visualization</title>
      </h1>
      <div style={{
        position: 'absolute',
        top: '2vh',
        left: '2vh',
        width: '30vh',
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
        <Heatmap />
      </div>
      <div className="absolute bottom-[0px] right-[10vh]">
        <RadarChart data={data} />
      </div>
      <div className="absolute top-[3vh] right-[10vh] scale-y-70">
      
        <BarChart data={data} />
      </div>
    </div>
  );
}
