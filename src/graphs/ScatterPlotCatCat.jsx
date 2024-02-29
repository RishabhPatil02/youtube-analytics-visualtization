import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ScatterPlotCatCat = ({ xData, yData, xLabel, yLabel }) => {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 100, left: 100 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const xScale = d3
      .scaleBand()
      .domain(xData)
      .range([margin.left, margin.left + plotWidth])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(yData)
      .range([margin.top + plotHeight, margin.top])
      .padding(0.1);

    const jitter = (range) => {
      return range + Math.random() * xScale.bandwidth();
    };

    svg
      .selectAll('circle')
      .data(xData)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => jitter(xScale(d)))
      .attr('cy', (d, i) => jitter(yScale(yData[i])))
      .attr('r', 1)
      .attr('fill', 'steelblue');

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);

    svg
      .append('g')
      .attr('transform', `translate(0, ${margin.top + plotHeight})`)
      .call(xAxis)
      .selectAll('text') // Select all text elements
      .attr('transform', 'rotate(-45)') // Rotate the text elements
      .style('text-anchor', 'end'); // Adjust text anchor

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Append x label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height )
      .attr('text-anchor', 'middle')
      .text(xLabel);

    // Append y label
    svg
      .append('text')
      .attr('transform', `translate(${margin.left / 2}, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(yLabel);

  }, [xData, yData, xLabel, yLabel]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlotCatCat;
