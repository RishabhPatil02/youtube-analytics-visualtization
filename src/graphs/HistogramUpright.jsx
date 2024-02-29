import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HistogramUpright = ({ bins, variable }) => {
  const svgRef = useRef();

  let xLabel;
  if(variable=='subscribers') xLabel='Number of subscribers';
  if(variable=='video views') xLabel='Total video views';
  if(variable=='uploads') xLabel='Number of uploads';
  if(variable=='video_views_for_the_last_30_days') xLabel='Video views for the last 30 days';
  if(variable=='lowest_monthly_earnings') xLabel='Lowest monthly earnings';
  if(variable=='highest_monthly_earnings') xLabel='Highest monthly earnings';
  if(variable=='lowest_yearly_earnings') xLabel='Lowest yearly earnings';
  if(variable=='highest_yearly_earnings') xLabel='Highest yearly earnings';
  if(variable=='subscribers_for_last_30_days') xLabel='Subscribers for last 30 days';
  if(variable=='Population') xLabel='Population';
  if(variable=='created_date') xLabel='Channel creation date';
  if(variable=='Gross tertiary education enrollment (%)') xLabel='Gross tertiary education enrollment (%)';
  if(variable=='Unemployment rate') xLabel='Unemployment rate';
  if(variable=='Urban_population') xLabel='Urban population';

  let ticks = [bins[0].start];
  for (let bin of bins) {
    ticks.push(bin.end);
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Remove all existing elements before rendering

    const margin = { top: 20, right: 30, bottom: 100, left: 60 }; // Adjusted left margin for y-axis label
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const newSvg = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Get the maximum count to determine the height of the bars
    const maxCount = d3.max(bins, d => d.count);

    const xScale = d3.scaleLinear()
      .domain([bins[0].start, bins[bins.length - 1].end]) // Set the domain to cover the range of all bins
      .range([0, width]);

    const yScale = d3.scaleLog() // Use log scaling for the y-axis
      .domain([1, maxCount]) // Start from 1 since log(0) is undefined
      .nice()
      .range([height, 0]);

    // Draw the bars with animation
// Define colors
const barColor = 'rgb(59, 130, 246)';

// Append bars to the SVG
newSvg.selectAll('.bar')
  .data(bins)
  .enter().append('rect')
  .attr('class', 'bar')
  .attr('x', d => xScale(d.start))
  .attr('y', height) // Start from the bottom for animation
  .attr('width', d => xScale(d.end) - xScale(d.start)) // Width is determined by the bin range
  .attr('height', 0) // Start from zero height for animation
  .attr('fill', barColor)
  .transition() // Apply transition to animate
  .duration(1000) // Duration of the animation in milliseconds
  .attr('y', d => yScale(d.count))
  .attr('height', d => height - yScale(d.count))
  .attr('opacity', 0.9) // Adjust opacity for better visibility
  .attr('rx', 3) // Rounded corners
  .attr('ry', 3); // Rounded corners


    const xAxis = d3.axisBottom(xScale)
      .tickValues(ticks) // Your own scale values
      .tickFormat(d3.format('.2s')); // Format the tick labels to "M" format

    // Add x-axis with rotated labels
    newSvg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // Add x-axis label
    newSvg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.top + 40)
      .style('text-anchor', 'middle')
      .text(xLabel);

    // Add y-axis
    newSvg.append('g')
      .call(d3.axisLeft(yScale));

    // Add y-axis label
    newSvg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Number of Channels');

  }, [bins]);

  return <svg ref={svgRef}></svg>;
};

export default HistogramUpright;
