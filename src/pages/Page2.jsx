import React from 'react'
import Nav from '../components/Nav'
import { FormControl, FormControlLabel, MenuItem, Select, Switch, Radio, FormLabel, RadioGroup } from '@mui/material'
import { useState, useEffect } from 'react';
import ScatterPlotNumNum from '../graphs/ScatterPlotNumNum';
import ScatterPlotCatNum from '../graphs/ScatterPlotCatNum';
import ScatterPlotNumCat from '../graphs/ScatterPlotNumCat';
import ScatterPlotCatCat from '../graphs/ScatterPlotCatCat';

function Page2({data}) {

  const nums=["subscribers", "video views", "uploads", "video_views_for_the_last_30_days","lowest_monthly_earnings","highest_monthly_earnings","lowest_yearly_earnings","highest_yearly_earnings","subscribers_for_last_30_days","Gross tertiary education enrollment (%)","Population","Unemployment rate","Urban_population"];

  const cats=["created_date","category","Country","Abbreviation","channel_type","created_year","created_month"];

  const [curr, setCurr]=useState('x');
  const [x, setX]=useState('category');
  const [y, setY]=useState('subscribers');
  const [variable,setVariable]=useState('none');
  const [xData, setXData]=useState([]);
  const [yData, setYData]=useState([]);

  useEffect(()=>{
    let arr1=[];
    let arr2=[];
    for(let entry of data){
      arr1.push(entry[x]);
      arr2.push(entry[y]);
    }
    console.log(arr1);
    console.log(arr2);
    setXData(arr1);
    setYData(arr2);

    console.log(x,y);

  },[x,y])

  return (
    <div>
      <Nav/>
      <div class='h-screen'>
        <div class='flex'>
          <div class='flex justify-center items-center w-full'>
            
            <div class='w-1/3 flex justify-around items-center my-4'>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={curr}
                onChange={()=>{
                  if(curr=='x') setCurr('y');
                  else if(curr=='y') setCurr('x');
                }}
              >
                <FormControlLabel value="x" control={<Radio />} label="X axis" />
                <FormControlLabel value="y" control={<Radio />} label="Y axis" />
              </RadioGroup>
            </FormControl>

              <FormControl sx={{ m: 1 }}>
              <div class='flex justify-around'>
                <Select
                    value={curr=='x'?x:y}
                    onChange={(event)=>{
                      if(curr=='x') setX(event.target.value);
                      if(curr=='y') setY(event.target.value);
                      setVariable(event.target.value);
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ width: '200px' }}
                >
                    <MenuItem value={"none"} disabled>Please Select</MenuItem>
                    <MenuItem value={"category"}>Category</MenuItem>
                    <MenuItem value={"Country"}>Country</MenuItem>
                    <MenuItem value={"Abbreviation"}>Abbreviation</MenuItem>
                    <MenuItem value={"channel_type"}>Channel type</MenuItem>
                    <MenuItem value={"created_year"}>Channel creation year</MenuItem>
                    <MenuItem value={"created_month"}>Channel creation month</MenuItem>
                    <MenuItem value={"created_date"}>Channel creation date</MenuItem>

                    <MenuItem value={"subscribers"}>Number of subscribers</MenuItem>
                    <MenuItem value={"video views"}>Number of views</MenuItem>
                    <MenuItem value={"uploads"}>Number of Uploads</MenuItem>
                    <MenuItem value={"video_views_for_the_last_30_days"}>Video views for last 30 days</MenuItem>
                    <MenuItem value={"lowest_monthly_earnings"}>Lowest Monthly Earnings</MenuItem>
                    <MenuItem value={"highest_monthly_earnings"}>Highest Monthly Earnings</MenuItem>
                    <MenuItem value={"lowest_yearly_earnings"}>Lowest Yearly Earnings</MenuItem>
                    <MenuItem value={"highest_yearly_earnings"}>Highest Yearly Earnings</MenuItem>
                    <MenuItem value={"subscribers_for_last_30_days"}>Subscribers for last 30 days</MenuItem>
                    <MenuItem value={"Gross tertiary education enrollment (%)"}>Gross tertiary education enrollment (%)</MenuItem>
                    <MenuItem value={"Population"}>Population</MenuItem>
                    <MenuItem value={"Unemployment rate"}>Unemployment rate</MenuItem>
                    <MenuItem value={"Urban_population"}>Urban Population</MenuItem>
                    

                </Select>
              </div>
              </FormControl>    

            </div>

          </div>
        </div>


        <br />

        
        <div class='flex justify-center'>
          {nums.includes(x) && nums.includes(y)?
          <ScatterPlotNumNum xValues={xData} yValues={yData} xLabel={x} yLabel={y}/>
          :
          nums.includes(x) && cats.includes(y)?
          <ScatterPlotNumCat xData={xData} yData={yData} xLabel={x} yLabel={y}/>
          :
          nums.includes(y) && cats.includes(x)?
          <ScatterPlotCatNum xData={xData} yData={yData} xLabel={x} yLabel={y}/>
          :
          cats.includes(x) && cats.includes(y)?
          <ScatterPlotCatCat xData={xData} yData={yData} xLabel={x} yLabel={y}/>
          :
          <div>Error</div>
          }
        </div>
        <br /><br />
      </div>
      
    </div>
  )
}

export default Page2