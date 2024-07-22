import Image from "next/image";
import Heatmap from "./Heatmap.js"
import Head from "next/head"

import BarChart from "./BarChart.js"
import data from './data.json';
import RadarChart from "./RadarChart.js"

export default function Home() {
  return (
    <div>
      <Head>
        <title>Data Visualization</title>
      </Head>
      <div className="absolute inset-y-0 left-[300px] items-start h-screen">
        <h1>
          <title>AI Training Data Visualization</title>
        </h1>
        <main style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100vh' }}>
          <Heatmap />
        </main>
      </div>
      <div className="absolute bottom-[20px] right-[250px]">
        <RadarChart data={data} />
      </div>
      <div className="absolute top-[30px] right-[150px] scale-y-70">
      
        <BarChart data={data} />
      </div>
    </div>
  );
}
