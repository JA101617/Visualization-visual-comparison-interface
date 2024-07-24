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

const Heatmap = ({xOption: propsXOption, yOption: propsYOption, onHeatmapSelect, xUpdater}) => {
  
  const [data, setData] = useState([]);
  const [stateXOption, setXOption] = useState(propsXOption);
  const [stateYOption, setYOption] = useState(propsYOption);

  useEffect(() => {
    fetchData().then((parsedData) => {
      setData(parsedData);
    });
  }, []);
  useEffect(() => {
      console.log('set x: x propx',{stateXOption,propsXOption});
      setXOption(propsXOption);
      console.log('After set x: x propx',{stateXOption,propsXOption});
  }, [propsXOption]);

  useEffect(() => {
      console.log('set y: y propy',{stateYOption,propsYOption});
      setYOption(propsYOption);
      console.log('After set y: y propy',{stateYOption,propsYOption});
    //setYOption(propsYOption)
  }, [propsYOption]);


/* 响应点击选项处理器 */
  const handleXOptionChange = (newXOption) => {
    console.log('onHandleXOptionChange');
    if (propsXOption != newXOption) {
      xUpdater(newXOption);
    }
    setXOption(newXOption);
    if (newXOption === 'ModelName' && (stateYOption === 'SamplingMethod' || stateYOption === 'BarChartType')) {
      console.log('change radar from heatmap newX Y ohs',newXOption,stateYOption,onHeatmapSelect);
      onHeatmapSelect && onHeatmapSelect({ type: stateYOption });
    } else if (stateYOption === 'ModelName' && (newXOption === 'SamplingMethod' || newXOption === 'BarChartType')) {
      console.log('change radar from heatmap newX Y',newXOption,stateYOption);
      onHeatmapSelect && onHeatmapSelect({ type: newXOption });
    }
  };
  const handleYOptionChange = (newYOption) => {
    console.log('onHandleYOptionChange')
    setYOption(newYOption);
    if (stateXOption === 'ModelName' && (newYOption === 'SamplingMethod' || newYOption === 'BarChartType')) {
      console.log('change radar from heatmap X newY',stateXOption,newYOption);
      onHeatmapSelect && onHeatmapSelect({ type: newYOption });
    } else if (newYOption === 'ModelName' && (stateXOption === 'SamplingMethod' || stateXOption === 'BarChartType')) {
      console.log('change radar from heatmap X newY',stateXOption,newYOption);
      onHeatmapSelect && onHeatmapSelect({ type: stateXOption });
    }
  };


  const filteredData = React.useMemo(() => {
    if (!data.length) return [];
    const rows = options[stateYOption].length;
    const cols = options[stateXOption].length;
    const newData = Array(rows).fill(null).map(() => Array(cols).fill(null));

    let minValue = Infinity;
    let maxValue = -Infinity;
    data.forEach((row) => {
      if (row.xVariable === stateXOption && row.yVariable === stateYOption) {
        const value = parseFloat(row['Average Error']);
        if (value < minValue) minValue = value;
        if (value > maxValue) maxValue = value;
      }
    });

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

  const rows = options[stateYOption].length;
  const cols = options[stateXOption].length;
  //const blockSize = Math.min(600 / cols, 600 / rows); // 600是容器的最大宽度和高度

  return ( 
    <div style={{
      display: 'inline-block',
      backgroundColor: 'white',
      borderRadius: '3vh',
      padding: '3vh',
      boxShadow: '0 2vh 4vh rgba(0, 0, 0, 0.1), 0 -2vh 4vh rgba(0, 0, 0, 0.1), -2vw 2vh 4vh rgba(0, 0, 0, 0.1), -2vw -2vh 4vh rgba(0, 0, 0, 0.1)',
      width: '550px',  // 固定宽度
      height: '600px', // 固定高度
      position: 'relative'
    }}>
      <div style={{display:'flex', alignItems: 'center'}}>
        <FormControl style={{ margin: '10px ', width: '15vw' }}>
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
                >
                  {cell !== null ? cell.value.toFixed(2) : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;
