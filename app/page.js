import Image from "next/image";
import Heatmap from "./Heatmap.js"
import Head from "next/head"

import BarChart from "./BarChart.js"
import data from './data.json';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Data Visualization</title>
      </Head>
      <div className="absolute inset-y-0 left-10 items-start h-screen">
        <h1>
          <title>Heatmap Visualization</title>
        </h1>
        <main style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100vh' }}>
          <Heatmap />
        </main>
      </div>
      <div className="absolute bottom-12 right-5">
        <BarChart data={data} />
      </div>
    </div>
  );
}
