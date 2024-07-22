"use client"

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


// 定义颜色比例函数
const getColor = (value,minval,maxval) => {
  let newvalue = (value - minval)/(maxval-minval);

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
const fetchData = async () => {
  const response = await fetch('/Heatmap_data.csv');
  const text = await response.text();
  return d3.csvParse(text);
};

const parseCSV = (text) => {
  const rows = text.trim().split('\n').map(row => row.split(','));
  const headers = rows[0];
  const data = rows.slice(1).map(row => {
    let obj = {};
    row.forEach((value, index) => {
      obj[headers[index]] = value;
    });
    return obj;
  });
  return data;
};

const Heatmap = () => {
  
  const [data, setData] = useState([]);
  const [xOption, setXOption] = useState('BarChartType');
  const [yOption, setYOption] = useState('ModelName');

  useEffect(() => {
    fetchData().then((parsedData) => {
      setData(parsedData);
    });
  }, []);

  const filteredData = React.useMemo(() => {
    if (!data.length) return [];
    const rows = options[yOption].length;
    const cols = options[xOption].length;
    const newData = Array(rows).fill(null).map(() => Array(cols).fill(null));

    let minValue = Infinity;
    let maxValue = -Infinity;

    data.forEach((row) => {
      if (row.xVariable === xOption && row.yVariable === yOption) {
        const value = parseFloat(row['Average Error']);
        if (value < minValue) minValue = value;
        if (value > maxValue) maxValue = value;
      }
    });

    data.forEach((row) => {
      if (row.xVariable === xOption && row.yVariable === yOption) {
        const xValue = parseInt(row.xValue) || row.xValue;
        const yValue = parseInt(row.yValue) || row.yValue;
        const value = parseFloat(row['Average Error']);
        const xIndex = options[xOption].indexOf(xValue);
        const yIndex = options[yOption].indexOf(yValue);
        if (xIndex >= 0 && yIndex >= 0) {
          newData[yIndex][xIndex] = { value, color: getColor(value, minValue, maxValue) };
        }
      }
    });

    return newData;
  }, [data, xOption, yOption]);

  const rows = options[yOption].length;
  const cols = options[xOption].length;
  //const blockSize = Math.min(600 / cols, 600 / rows); // 600是容器的最大宽度和高度

  return (
    <div className="flex justify-start p-5" style={{ height: 'auto' }}>
    <div className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
      <FormControl style={{ marginLeft: '180px' }}>
        <InputLabel id="demo-simple-select-label">Select X Axis</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={xOption}
          label="Select X Axis"
          onChange={(opt_click) => setXOption(opt_click.target.value)}
        >
          {Object.keys(options).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl  style={{ marginLeft: '10px' }}>
        <InputLabel id="demo-simple-select-label">Select Y Axis</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={yOption}
          label="Select Y Axis"
          onChange={(opt_click) => setYOption(opt_click.target.value)}
        >
          {Object.keys(options).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th></th>
            {options[xOption].map((label, index) => (
              <th key={index} className="text-center font-bold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i}>
              <td className="text-center font-bold">{options[yOption][i]}</td>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="text-center text-white"
                  style={{
                    width: `${60 / cols}vh`,
                    height: `${60 / rows}vh`,
                    backgroundColor: cell !== null ? cell.color : 'gray',
                  }}
                >
                  {cell !== null ? cell.value.toFixed(2) : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Heatmap;
