"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const BarChart = ({ data }) => {
  const [dataType, setDataType] = useState('ValDataSpan');
  const [colorBy, setColorBy] = useState('BarChartType');
  const containerRef = useRef();
  const svgRef = useRef();

  const chartData = useMemo(() => {
    if (data && typeof data === 'object' && dataType in data) {
      return data[dataType];
    }
    return [];
  }, [data, dataType]);

  const getAllPossibleValues = useMemo(() => {
    return (attribute) => {
      const allValues = new Set();
      if (data && typeof data === 'object') {
        Object.values(data).forEach(dataSet => {
          if (Array.isArray(dataSet)) {
            dataSet.forEach(item => {
              if (item && typeof item === 'object' && attribute in item) {
                allValues.add(item[attribute]);
              }
            });
          }
        });
      }
      return Array.from(allValues);
    };
  }, [data]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      console.log('Effect triggered with dataType:', dataType);
      drawChart();
    }
  }, [chartData, colorBy, dataType]);

  useEffect(() => {
    const handleResize = () => drawChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartData, colorBy]);

  const drawChart = () => {
    const containerWidth = 475;
    const containerHeight = 355;

    const margin = { top: 70, right: 100, bottom: 30, left: 50 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedData = [...chartData].sort((a, b) => a.x - b.x);

    const xValues = Array.from(new Set(sortedData.map(d => d.x))).sort((a, b) => a - b);
    const colorValues = getAllPossibleValues(colorBy);

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(xValues)
      .paddingInner(0.1)
      .paddingOuter(0.05);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(sortedData, d => d.y)]);

    const colorScale = d3.scaleOrdinal()
      .domain(colorValues)
      .range(d3.schemePastel2);

    const opacity = 0.8;
    

if (dataType === 'TrainDataSpan') {
  const bars = svg.selectAll('.bar')
    .data(sortedData)
    .enter().append('g')
    .attr('class', 'bar-group');

  bars.append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.x))
    .attr('y', d => y(d.y))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - y(d.y))
    .attr('fill', d => d3.color(colorScale(d[colorBy])).copy({opacity}))
    .attr('stroke', 'none')
    .attr('stroke-width', 2);

  bars.append('text')
    .attr('class', 'x-label')
    .attr('x', d => xScale(d.x) + xScale.bandwidth() / 2)
    .attr('y', height + 20)
    .attr('text-anchor', 'middle')
    .text(d => d.x.toLocaleString())
    .style('font-size', '10px')
    .style('fill', 'black')
    .style('opacity', 0);

  bars.on('mouseover', function(event, d) {
    d3.select(this).select('.x-label').style('opacity', 1);
    d3.select(this).select('.bar').attr('stroke', 'black');
  })
  .on('mouseout', function() {
    d3.select(this).select('.x-label').style('opacity', 0);
    d3.select(this).select('.bar').attr('stroke', 'none');
  });
}else {
      const xSubgroup = d3.scaleBand()
        .domain(colorValues)
        .range([0, xScale.bandwidth()])
        .padding(0.05);
    
      const barWidth = xSubgroup.bandwidth();
    
      const groups = svg.selectAll('.group')
        .data(xValues)
        .enter().append('g')
        .attr('class', 'group')
        .attr('transform', d => `translate(${xScale(d)},0)`);
    
      const bars = groups.selectAll('.bar')
        .data(d => sortedData.filter(item => item.x === d))
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xSubgroup(d[colorBy]))
        .attr('y', d => y(d.y))
        .attr('width', barWidth)
        .attr('height', d => height - y(d.y))
        .attr('fill', d => d3.color(colorScale(d[colorBy])).copy({opacity}))
        .attr('stroke', 'none')
        .attr('stroke-width', 2);

      groups.append('text')
        .attr('class', 'x-label')
        .attr('x', xScale.bandwidth() / 2)
        .attr('y', height + 20)
        .attr('text-anchor', 'middle')
        .text(d => d.toLocaleString())
        .style('font-size', '10px')
        .style('fill', 'black')
        .style('opacity', 0);

      bars.on('mouseover', function(event, d) {
        d3.select(this).attr('stroke', 'black');
        d3.select(this.parentNode).select('.x-label').style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke', 'none');
        d3.select(this.parentNode).select('.x-label').style('opacity', 0);
      });

      groups.on('mouseover', function() {
        d3.select(this).select('.x-label').style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).select('.x-label').style('opacity', 0);
      });
    }
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(0).tickFormat(''));

    svg.append('g')
      .attr('transform', `translate(-10,0)`)
      .call(d3.axisLeft(y));

    const legend = svg.selectAll(".legend")
      .data(colorValues)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width + 10)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", d => d3.color(colorScale(d)).copy({opacity}));

    legend.append("text")
      .attr("x", width + 35)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => d);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
  };

  const handleColorByChange = (e) => {
    setColorBy(e.target.value);
  };

  return (
    <div ref={containerRef} style={{ width: '95%', height: '90%', position: 'relative' }} >
      <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', top: '10px', left: '80px', zIndex: 10 }}>
        <FormControl style={{ marginRight: '10px', marginBottom:'10px', minWidth: '100px', maxWidth: '150px', width: '10vw', height:'5vh'}}>
          <InputLabel id="demo-simple-select-label">Select X Axis</InputLabel>
          <Select
            labelId="data-type-select-label"
            id="data-type-select"
            value={dataType}
            label="Select Data Type"
            onChange={handleDataTypeChange}
            style={{ width: '100%' }} // Set width to 100% to fill the FormControl
          >
            <MenuItem value="ValDataSpan">ValDataSpan</MenuItem>
            <MenuItem value="TestDataSpan">TestDataSpan</MenuItem>
            <MenuItem value="TrainDataSpan">TrainDataSpan</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ marginRight: '10px',marginBottom:'10px', minWidth: '100px', maxWidth: '150px', width: '10vw', height:'5vh'}}>
          <InputLabel id="color-by-select-label">Color By</InputLabel>
          <Select
            labelId="color-by-select-label"
            id="color-by-select"
            value={colorBy}
            label="Color By"
            onChange={handleColorByChange}
            style={{ width: '100%' }} // Set width to 100% to fill the FormControl
          >
            <MenuItem value="BarChartType">BarChartType</MenuItem>
            <MenuItem value="DownsamplingLevel">DownsamplingLevel</MenuItem>
            <MenuItem value="SamplingMethod">SamplingMethod</MenuItem>
            <MenuItem value="SamplingTarget">SamplingTarget</MenuItem>
            <MenuItem value="ModelName">ModelName</MenuItem>
          </Select>
        </FormControl>
      </div>
      {chartData.length > 0 ? (
        <>
          <svg ref={svgRef} style={{ width: '165%', height: '100%' }}></svg>
          <div id="tooltip" style={{
            position: 'absolute',
            display: 'none',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '3px'
          }}></div>
        </>
      ) : (
        <p>所选类型没有可用数据。</p>
      )}
    </div>
  );
};

export default BarChart;