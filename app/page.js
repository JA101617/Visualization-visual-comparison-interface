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
        top: '20px',
        left: '20px',
        width: '280px',
        height: '800px',
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Our Group</h2>
        <p>Introduction about the group.</p>
        <h2>Dataset</h2>
        <p>Information about the dataset.</p>
      </div>
      <div className="absolute inset-y-0 left-[300px]" 
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          height: 'auto' 
        }}
      >
        <Heatmap />
      </div>
      <div className="absolute bottom-[20px] right-[170px]">
        <RadarChart data={data} />
      </div>
      <div className="absolute top-[50px] right-[200px] scale-y-70">
      
        <BarChart data={data} />
      </div>
    </div>
  );
}
