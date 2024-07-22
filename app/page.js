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
      <div className="absolute inset-y-0 left-[100px] items-start h-screen">
        <h1>
          <title>Heatmap Visualization</title>
        </h1>
        <main style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100vh' }}>
          <Heatmap />
        </main>
      </div>
      <div className="absolute bottom-[10px] right-[200px]">
        <RadarChart data={data} />
      </div>
      <div className="absolute top-[30px] right-[100px]">
      
        <BarChart data={data} />
      </div>
    </div>
  );
}
