"use client"

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState(data.ValDataSpan);
  const [dataType, setDataType] = useState('ValDataSpan');
  const [colorBy, setColorBy] = useState('BarChartType');
  const containerRef = useRef();
  const svgRef = useRef();

  const getAllPossibleValues = (attribute) => {
    const allValues = new Set();
    Object.values(data).forEach(dataSet => {
      dataSet.forEach(item => {
        if (item[attribute] !== undefined) {
          allValues.add(item[attribute]);
        }
      });
    });
    return Array.from(allValues);
  };

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      drawChart();
    }
  }, [chartData, colorBy]);

  useEffect(() => {
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, []);

  const drawChart = () => {
    //const containerWidth = containerRef.current.clientWidth;
    //const containerHeight = window.innerHeight * 0.8;

    const margin = { top: 20, right: 100, bottom: 10, left: 60 };
    const width = 300;//containerWidth - margin.left - margin.right;
    const height = 250;//containerHeight - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedData = [...chartData].sort((a, b) => a.x - b.x);

    // 根据数据类型调整柱状图间距和最小宽度
    const barPadding = dataType === 'TrainDataSpan' ? 0.1 : 0.001;
    const minBarWidth = dataType === 'TrainDataSpan' ? 1 : 0.1;

    const x = d3.scaleBand()
      .range([0, width])
      .padding(barPadding)
      .domain(sortedData.map(d => d.x));

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(sortedData, d => d.y)]);

    // 计算实际柱宽
    const barWidth = Math.max(x.bandwidth(), minBarWidth);

    const colorValues = getAllPossibleValues(colorBy);
    const colorScale = d3.scaleOrdinal()
      .domain(colorValues)
      .range(d3.schemeCategory10);

    svg.selectAll('.bar')
      .data(sortedData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.x))
      .attr('width', barWidth)
      .attr('y', d => y(d.y))
      .attr('height', d => height - y(d.y))
      .attr('fill', d => colorScale(d[colorBy]));

    // 添加x轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues([]))
      .selectAll("text")
      .remove();

    // 添加y轴
    svg.append('g')
      .call(d3.axisLeft(y));

    // 添加图例
    const legend = svg.selectAll(".legend")
      .data(colorValues)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width + 10)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

    legend.append("text")
      .attr("x", width + 35)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => d);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
    setChartData(data[e.target.value]);
  };

  const handleColorByChange = (e) => {
    setColorBy(e.target.value);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '45vh' }}>
      <div style={{ marginBottom: '10px' }}>
        <select onChange={handleDataTypeChange} value={dataType}>
          <option value="ValDataSpan">ValDataSpan</option>
          <option value="TestDataSpan">TestDataSpan</option>
          <option value="TrainDataSpan">TrainDataSpan</option>
        </select>
        <select onChange={handleColorByChange} value={colorBy} style={{ marginLeft: '10px' }}>
          <option value="BarChartType">BarChartType</option>
          <option value="DownsamplingLevel">DownsamplingLevel</option>
          <option value="SamplingMethod">SamplingMethod</option>
          <option value="SamplingTarget">SamplingTarget</option>
          <option value="ModelName">ModelName</option>
        </select>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;