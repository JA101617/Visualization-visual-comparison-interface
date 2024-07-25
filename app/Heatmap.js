"use client"

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// 定义颜色比例函数
const getColor = (value, minval, maxval) => {
  let newvalue = (value - minval) / (maxval - minval);
  const r = Math.floor(254 * newvalue + 134 * (1 - newvalue));
  const g = Math.floor(181 * newvalue + 196 * (1 - newvalue));
  const b = Math.floor(109 * newvalue + 255 * (1 - newvalue));
  return `rgb(${r}, ${g}, ${b})`;
};

// 可选轴
const options = {
  BarChartType: [1, 2, 3, 4, 5],
  ModelName: ['VGG19', 'ResNet50'],
  SamplingTarget: ['Ratio', 'Height'],
  SamplingMethod: ['IID', 'COV', 'ADV', 'OOD'],
  DownsamplingLevel: [2, 4, 8, 16],
};

// 生成数据
const fetchData = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  return d3.csvParse(text);
};

const Heatmap = ({ xOption: propsXOption, yOption: propsYOption, onHeatmapSelect, xUpdater, yUpdater }) => {
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [stateXOption, setXOption] = useState(propsXOption);
  const [stateYOption, setYOption] = useState(propsYOption);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0});

  useEffect(() => {
    fetchData('/Heatmap_data.csv').then((parsedData) => {
      setData(parsedData);
    });
  }, []);

  useEffect(() => {
    setXOption(propsXOption);
  }, [propsXOption]);

  useEffect(() => {
    setYOption(propsYOption);
  }, [propsYOption]);

  /* 响应点击选项处理器 */
  const handleXOptionChange = (newXOption) => {
    if (propsXOption !== newXOption) {
      xUpdater(newXOption);
    }
    setXOption(newXOption);
    if (newXOption === 'ModelName' && (stateYOption === 'SamplingMethod' || stateYOption === 'BarChartType')) {
      onHeatmapSelect && onHeatmapSelect({ type: stateYOption });
    } else if (stateYOption === 'ModelName' && (newXOption === 'SamplingMethod' || newXOption === 'BarChartType')) {
      onHeatmapSelect && onHeatmapSelect({ type: newXOption });
    }
  };

  const handleYOptionChange = (newYOption) => {
    if (propsYOption !== newYOption) {
      yUpdater(newYOption);
    }
    setYOption(newYOption);
    if (stateXOption === 'ModelName' && (newYOption === 'SamplingMethod' || newYOption === 'BarChartType')) {
      onHeatmapSelect && onHeatmapSelect({ type: newYOption });
    } else if (newYOption === 'ModelName' && (stateXOption === 'SamplingMethod' || stateXOption === 'BarChartType')) {
      onHeatmapSelect && onHeatmapSelect({ type: stateXOption });
    }
  };
  //  const handleMouseEnter = async (xValue, yValue) => {
  //   const mergedData = await fetchData('/merged_table.csv');
  //   const filteredData = mergedData.filter(d =>
  //     d[stateXOption] === xValue.toString() && d[stateYOption] === yValue.toString()
  //   );
  //   setTooltip({ show: true, x: xValue, y: yValue });
  //   // 计算每个 Average Error 出现的次数
  //   const errorCounts = {};
  //   filteredData.forEach(d => {
  //     const error = parseFloat(d['Average Error']).toFixed(2);
  //     if (!errorCounts[error]) {
  //       errorCounts[error] = 0;
  //     }
  //     errorCounts[error]++;
  //   });

  //   // 将数据转换为线图格式
  //   const lineDataArray = Object.entries(errorCounts).map(([error, count]) => ({
  //     value: parseFloat(error),
  //     count: count
  //   }));

  //   setLineData(lineDataArray);
  // };  

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0 });
  };

  const handleMouseEnter = async (xValue, yValue) => {
    const mergedData = await fetchData('/merged_table.csv');
    const filteredData = mergedData.filter(d =>
      d[stateXOption] === xValue.toString() && d[stateYOption] === yValue.toString()
    );
    setTooltip({ show: true, x: xValue, y: yValue });

    const errorCounts = {};
    filteredData.forEach(d => {
      const value = parseFloat(d['Average Error']).toFixed(2);
      if (!errorCounts[value]) {
        errorCounts[value] = 0;
      }
      errorCounts[value]++;
    });

    const lineData = Object.entries(errorCounts).map(([key, count]) => ({
      error: parseFloat(key).toFixed(2),
      count: count
    }))
    .sort((a, b) => a.error - b.error);

    setLineData(lineData);
  };
  
  const rows = options[stateYOption].length;
  const cols = options[stateXOption].length;

  const filteredData = React.useMemo(() => {
    if (!data.length) return [];

    let minValue = Infinity;
    let maxValue = -Infinity;
    data.forEach((row) => {
      if (row.xVariable === stateXOption && row.yVariable === stateYOption) {
        const value = parseFloat(row['Average Error']);
        if (value < minValue) minValue = value;
        if (value > maxValue) maxValue = value;
      }
    });

    const newData = Array(rows).fill(null).map(() => Array(cols).fill(null));
    data.forEach((row) => {
      if (row.xVariable === stateXOption && row.yVariable === stateYOption) {
        const xValue = parseInt(row.xValue) || row.xValue;
        const yValue = parseInt(row.yValue) || row.yValue;
        const value = parseFloat(row['Average Error']);
        const xIndex = options[stateXOption].indexOf(xValue);
        const yIndex = options[stateYOption].indexOf(yValue);
        if (xIndex >= 0 && yIndex >= 0) {
          newData[yIndex][xIndex] = { value, color: getColor(value, minValue, maxValue) };
        }
      }
    });

    return newData;
  }, [data, stateXOption, stateYOption]);



  useEffect(() => {
    if (lineData.length) {
      const svg = d3.select("#line-chart");
      svg.selectAll("*").remove();

      const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      const x = d3.scaleLinear()
        .domain([0, d3.max(lineData, d => d.error)])
        .range([0, height]);
        

      const y = d3.scaleLinear()
        .domain([0, d3.max(lineData, d => d.count)])
        .range([width, 0]);


      const line = d3.line()
        .x(d => x(d.error))
        .y(d => y(d.count));

      svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y).ticks(5))
        .append('text')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 40)
        .attr('fill', '#000')
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Count');

      svg.append("g")
        .attr("transform", `translate(${margin.left},${height + margin.top + 10})`)
        .call(d3.axisBottom(x).ticks(10))
        .append('text')
        .attr('x', width / 2)
        .attr('y', margin.bottom)
        .attr('fill', '#000')
        .style('text-anchor', 'middle')
        .text('Average Error');

        svg.selectAll('.dot')
        .data(lineData)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(parseFloat(d.error)))
        .attr('cy', d => y(parseFloat(d.count)))
        .attr('r', 3) // Increase the size for visibility
        .attr('fill', 'steelblue')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1)
        .attr("transform", `translate(${margin.left},${margin.top})`);;


      svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }
  }, [lineData]);

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      backgroundColor: 'white',
      borderRadius: '3vh',
      padding: '3vh',
      boxShadow: '0 2vh 4vh rgba(0, 0, 0, 0.1), 0 -2vh 4vh rgba(0, 0, 0, 0.1), -2vw 2vh 4vh rgba(0, 0, 0, 0.1), -2vw -2vh 4vh rgba(0, 0, 0, 0.1)',
      width: '550px',
      height: '600px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormControl style={{ margin: '10px', width: '15vw' }}>
          <InputLabel id="x-axis-select-label">Select X Axis</InputLabel>
          <Select
            labelId="x-axis-select-label"
            id="x-axis-select"
            value={stateXOption}
            label="Select X Axis"
            onChange={(opt_click) => handleXOptionChange(opt_click.target.value)}
          >
            {Object.keys(options).filter(key => key !== stateYOption).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ marginLeft: '10px', width: '15vw' }}>
          <InputLabel id="y-axis-select-label">Select Y Axis</InputLabel>
          <Select
            labelId="y-axis-select-label"
            id="y-axis-select"
            value={stateYOption}
            label="Select Y Axis"
            onChange={(opt_click) => handleYOptionChange(opt_click.target.value)}
          >
            {Object.keys(options).filter(key => key !== stateXOption).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            <th></th>
            {options[stateXOption].map((label, index) => (
              <th key={index} className="text-center font-bold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i}>
              <td className="text-right pr-3 font-bold">{options[stateYOption][i]}</td>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="text-center text-white"
                  style={{
                    width: `${55 / cols}vh`,
                    height: `${55 / rows}vh`,
                    backgroundColor: cell !== null ? cell.color : 'gray',
                  }}
                  onMouseEnter={() => handleMouseEnter(options[stateXOption][j], options[stateYOption][i])}
                  onMouseLeave={handleMouseLeave}
                >
                  {cell !== null ? cell.value.toFixed(2) : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {tooltip.show && (
      <div
        className='absolute'
        style={{
          top: '-12vh',
          left: '40vw', // 调整此值使图表更靠右
          width: '500px',
          height: '450px',
          backgroundColor: 'white',
          border: '1px solid black',
          padding: '10px',
          borderRadius: '5px',
          overflow: 'hidden',
          zIndex: 20
        }}
      >
        <svg id="line-chart" width="500" height="500"></svg>
      </div>
    )}
  </div>
);
};

export default Heatmap;
