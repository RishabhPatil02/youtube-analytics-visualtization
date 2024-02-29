import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlotCatNum = ({ xData, yData , xLabel, yLabel}) => {

  console.log(xLabel,yLabel)
  const svgRef = useRef();

  let width = 600;
  let height = 500;

  useEffect(() => {
    if (!xData || !yData || xData.length !== yData.length) return;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Set margins
    const margin = { top: 20, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(xData)
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLog() // Change linear scale to log scale
      .domain(d3.extent(yData, d => parseFloat(d))) // Make sure to handle zero or negative values properly
      .nice()
      .range([innerHeight, 0]);

    // Create axes
    const formatTick = d3.format('~s');
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(4).tickFormat(d => formatTick(d).replace('G', 'B'));;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Render x-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // Render y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    // Render circles
    svg.selectAll('.dot')
    .data(xData.map((_, i) => [xData[i], yData[i]]))
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 3) // Increase point radius to 4 for better visibility
    .style('fill', 'steelblue') // Set fill color to steelblue
    .style('stroke', 'white') // Add a white stroke around the points for better contrast
    .style('stroke-width', 1) // Set stroke width to 1 for clarity
    .style('opacity', 0.8); // Reduce opacity slightly to allow better visibility of overlapping points

      // Append x-axis label
  svg.append("text")
  .attr("class", "x-label")
  .attr("text-anchor", "middle")
  .attr("x", innerWidth / 2)
  .attr("y", innerHeight + margin.top + 70)
  .text(xLabel);

  svg.append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'middle')
    .attr('x', -height / 2)
    .attr('y', -margin.left)
    .attr('dy', '.75em')
    .attr('transform', 'rotate(-90)')
    .text(yLabel);


  }, [xData, yData, width, height]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default ScatterPlotCatNum;
