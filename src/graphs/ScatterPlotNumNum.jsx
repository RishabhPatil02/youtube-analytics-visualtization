import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlotNumNum = ({ xValues, yValues, xLabel, yLabel }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const newSvg = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLog()
      .domain(d3.extent(xValues, d => parseFloat(d)))
      .range([0, width]);

    const yScale = d3
      .scaleLog()
      .domain(d3.extent(yValues, d => parseFloat(d)))
      .range([height, 0]);

    const formatTick = d3.format('~s');
    const customXAxis = d3.axisBottom(xScale).ticks(4).tickFormat(d => formatTick(d).replace('G', 'B'));
    const customYAxis = d3.axisLeft(yScale).ticks(4).tickFormat(d => formatTick(d).replace('G', 'B'));

    newSvg.selectAll('.dot')
      .data(xValues.map((_, i) => [xValues[i], yValues[i]]))
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(d[1]))
      .attr('r', 3)
      .style('fill', 'steelblue')
      .style('stroke', 'white')
      .style('stroke-width', 1)
      .style('opacity', 0.8)
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration('50').attr('r', 6);
        newSvg.append('rect')
          .attr('id', 'tooltip-box')
          .attr('x', xScale(d[0]) + 10)
          .attr('y', yScale(d[1]) - 30)
          .attr('width', 200)
          .attr('height', 20)
          .style('fill', 'rgba(255,255,255,0.8)')
          .style('stroke', 'black');
        newSvg.append('text')
          .attr('id', 'tooltip-text')
          .attr('x', xScale(d[0]) + 15)
          .attr('y', yScale(d[1]) - 15)
          .text(`(${d[0]}, ${d[1]})`);
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration('50').attr('r', 3);
        d3.select('#tooltip-box').remove();
        d3.select('#tooltip-text').remove();
      });

    newSvg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(customXAxis);

    newSvg.append('g')
      .call(customYAxis);

    newSvg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .text(xLabel);

    newSvg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'middle')
      .attr('x', -height / 2)
      .attr('y', -margin.left)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(yLabel);

  }, [xValues, yValues, xLabel, yLabel]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlotNumNum;
