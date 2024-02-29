import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChartSideways = ({ xData, yData, variable }) => {
  const svgRef = useRef();

  var xLabel='';
  var yLabel='Number of Channels';

  if(variable === 'category') xLabel = 'Channel Category';
  if(variable === 'Country') xLabel = 'Channel Country';
  if(variable === 'Abbreviation') xLabel = 'Channel Country Abbreviation';
  if(variable === 'channel_type') xLabel = 'Channel Type';
  if(variable === 'created_year') xLabel = 'Channel Creation Year';
  if(variable === 'created_month') xLabel = 'Channel Creation Month';


  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 130 };
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const pastelColors = [
      "#8CBF85", "#FFA09D", "#7AAACD", "#D48B86", "#8C8CA6", 
      "#C4B2A7", "#7FA172", "#B79183", "#7694C4", "#C89F9B"
    ];

    var adjustedXData = xData;
    var adjustedYData = yData;

    if (variable !== 'created_year' && variable !== 'created_month') {
      const threshold = 15; // Threshold for considering categories
      if (xData.length > threshold) {
        // Sort data based on frequencies
        const sortedData = xData.map((item, index) => ({
          category: item,
          frequency: yData[index]
        })).sort((a, b) => b.frequency - a.frequency);
    
        // Extract categories and frequencies
        const categories = sortedData.map(item => item.category);
        const frequencies = sortedData.map(item => item.frequency);
    
        // Calculate sum of frequencies for categories beyond threshold
        const otherFrequency = frequencies.slice(threshold).reduce((acc, val) => acc + val, 0);
    
        // Update xData and yData
        adjustedXData = [...categories.slice(0, threshold), 'Other'];
        adjustedYData = [...frequencies.slice(0, threshold), otherFrequency];
      } else {
        adjustedXData = xData;
        adjustedYData = yData;
      }
    }

    if(variable=='created_year'){
      let temp=adjustedXData.map(x => parseInt(x));
      let combo=[];
      for(let i=0;i<temp.length;i++){
        if(temp[i]==1970) continue;
        combo.push([temp[i], adjustedYData[i]]);
      }
      combo.sort((a,b)=>a[0]-b[0]);
      adjustedXData=[];
      adjustedYData=[];
      for(let x of combo){
        adjustedXData.push(x[0]);
        adjustedYData.push(x[1]);
      }
    }

    if(variable=='created_month'){
      let months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      let y=[];
      for(let month of months){
        y.push(adjustedYData[adjustedXData.indexOf(month)])
      }
      adjustedXData=months;
      adjustedYData=y;
    }

    

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, adjustedXData.length])
      .interpolator((t) => d3.interpolateRgb("#5ea0d2", "#aed6ff")(t));

    const newSvg = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(adjustedYData)])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(adjustedXData)
      .range([height, 0])
      .padding(0.1);

    newSvg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    newSvg.append('g')
      .call(d3.axisLeft(yScale));

    newSvg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .text(yLabel);

    newSvg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'middle')
      .attr('x', -height / 2)
      .attr('y', -margin.left)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(xLabel);

    newSvg.selectAll('.bar')
      .data(adjustedXData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('y', d => yScale(d))
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('width', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('x', 0)
      .attr('width', (d, i) => xScale(adjustedYData[i]));

    if(variable === 'created_year' || variable === 'created_month'){
      newSvg.selectAll('.bar')
        .attr('fill', (d, i) => colorScale(i));
    } else {
      newSvg.selectAll('.bar')
        .attr('fill', (d, i) => pastelColors[i % pastelColors.length]);
    }

  }, [xData, yData]);

  return <svg ref={svgRef}></svg>;
};

export default BarChartSideways;
