import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HistogramSideways = ({ bins, variable }) => {
  const svgRef = useRef();

  let xLabel = 'Number of channels';
  let yLabel;
  if(variable=='subscribers') yLabel='Number of subscribers';
  if(variable=='video views') yLabel='Total video views';
  if(variable=='uploads') yLabel='Number of uploads';
  if(variable=='video_views_for_the_last_30_days') yLabel='Video views for the last 30 days';
  if(variable=='lowest_monthly_earnings') yLabel='Lowest monthly earnings';
  if(variable=='highest_monthly_earnings') yLabel='Highest monthly earnings';
  if(variable=='lowest_yearly_earnings') yLabel='Lowest yearly earnings';
  if(variable=='highest_yearly_earnings') yLabel='Highest yearly earnings';
  if(variable=='subscribers_for_last_30_days') yLabel='Subscribers for last 30 days';
  if(variable=='Population') xLabel='Population';
  if(variable=='created_date') yLabel='Channel creation date';
  if(variable=='Gross tertiary education enrollment (%)') yLabel='Gross tertiary education enrollment (%)';
  if(variable=='Unemployment rate') yLabel='Unemployment rate';
  if(variable=='Urban_population') yLabel='Urban population';

  let ticks = [bins[0].start];

  for (let bin of bins) {
    ticks.push(bin.end);
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Remove all existing elements before rendering

    const margin = { top: 20, right: 30, bottom: 50, left: 80 };
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const newSvg = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Get the maximum count to determine the width of the bars
    const maxCount = d3.max(bins, (d) => d.count);

    const yScale = d3
      .scaleLinear()
      .domain([bins[bins.length - 1].end, bins[0].start]) // Reverse the domain for vertical layout
      .range([0, height]);

    const xScale = d3
      .scaleLog() // Use log scaling for the x-axis
      .domain([1, maxCount]) // Start from 1 since log(0) is undefined
      .nice()
      .range([0, width]);

      const barColor = 'rgb(59, 130, 246)';
    // Draw the bars
    newSvg
      .selectAll('.bar')
      .data(bins)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => yScale(d.end))
      .attr('x', 0)
      .attr('height', (d) => yScale(d.start) - yScale(d.end)) // Height is determined by the bin range
      .attr('width', 0) // Set initial width to 0
      .attr('fill', barColor)
      .transition() // Apply transition to the bars
      .duration(1000) // Duration of transition
      .attr('width', (d) => xScale(d.count))
      .attr('opacity', 0.9) // Adjust opacity for better visibility
  .attr('rx', 3) // Rounded corners
  .attr('ry', 3); // Rounded corners; // Transition to final width

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(ticks) // Your own scale values
      .tickFormat(d3.format('.2s')); // Format the tick labels to "M" format

    // Add y-axis
    newSvg.append('g').call(yAxis);

    // Add y-axis label
    newSvg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(yLabel);

    // Add x-axis
    newSvg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // Add x-axis label
    newSvg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.top + 20)
      .style('text-anchor', 'middle')
      .text(xLabel);
  }, [bins, xLabel, yLabel]);

  return <svg ref={svgRef}></svg>;
};

export default HistogramSideways;
