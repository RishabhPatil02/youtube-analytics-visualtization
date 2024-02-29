import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import { InputLabel, Select,  MenuItem, FormControl, RadioGroup, Radio, FormLabel, FormControlLabel, Button, Switch} from '@mui/material'
import { useState } from 'react';
import Papa from 'papaparse';
import * as d3 from 'd3';
import BarChartSideways from '../graphs/BarChartSideways';
import BarChartUpright from '../graphs/BarChartUpright';
import HistogramUpright from '../graphs/HistogramUpright';
import HistogramSideways from '../graphs/HistogramSideways';


function Page1({data}) {

    const [variable, setVariable]=useState('category');
    const[x,setX]=useState('subscribers');
    const[y,setY]=useState('views');
    const[orientation, setOrientation]=useState('upright');
    const[graph1X, setGraph1X]=useState([]);
    const[graph1Y, setGraph1Y]=useState([]);
    const[graph2Bins, setGraph2Bins]=useState([{ start: 0, end: 0, count: 0 }]);
    const[graph3Store, setGraph3Store]=useState([{0: {subscribers:0, views:0, uploads:0, created_year:'0000'}}])

    function setGraph1(attr){
        setVariable(attr);

        //for bar chart pre processing
        let counts=new Map();
        for(let entry of data){
            if(!counts.has(entry[attr])) counts.set(entry[attr],0);
            counts.set(entry[attr], counts.get(entry[attr])+1);
        }
        let x=[];
        let y=[];
        for(let [key,val] of counts){
            if(key==undefined || key=="nan") continue;
            x.push(key);
            y.push(val);
        }
        setGraph1X(x);
        setGraph1Y(y);
    }

    function createBins(bin_size,min,max){
        let bins=[];
        for(let i=min;i<max;i+=bin_size){
            bins.push({start: i, end: i+bin_size, count:0});
        }
        return bins;
    }
    

    function setGraph2(attr){
        setVariable(attr);
        let arr=[];
        for(let entry of data){
            arr.push(entry[attr]);
        }

        console.log(attr, Math.min(...arr), Math.max(...arr));

        let bins;
        if(attr=='subscribers') bins=createBins(20000000, 0, 260000000);
        else if(attr=='video views') bins=createBins(30000000,0,300000000);
        else if(attr=='uploads') bins=createBins(35000,0,350000);
        else if(attr=='video_views_for_the_last_30_days') bins=createBins(250000000,0,2500000000);
        else if(attr=='lowest_monthly_earnings') bins=createBins(60000,0,600000);
        else if(attr=='highest_monthly_earnings') bins=createBins(950000,0,9500000);
        else if(attr=='lowest_yearly_earnings') bins=createBins(700000,0,7000000);
        else if(attr=='highest_yearly_earnings') bins=createBins(15000000,0,150000000);
        else if(attr=='subscribers_for_last_30_days') bins=createBins(800000,0,8000000);
        else if(attr=='created_date') {
            bins=createBins(3,0,30);
            bins[bins.length-1].end=31;
        }else if(attr=='Gross tertiary education enrollment (%)') bins=createBins(12,0,120);
        else if(attr=='Population') bins=createBins(140000000,0,1400000000);
        else if(attr=='Unemployment rate') bins=createBins(2,0,16);
        else if(attr=='Urban_population') bins=createBins(100000000,0,900000000);
        
        for(let entry of data){
            for(let bin of bins){
                if(entry[attr]>bin.start && entry[attr]<=bin.end) bin.count+=1;
            }
        }

        setGraph2Bins(bins);
    }

    useEffect(()=>{
        setGraph1(variable);
    },[data]);

  return (
    <div>
        <Nav/>
        <div class=''>
            
        <div class="flex m-4 mt-8 justify-center">
                
                <div class='w-1/3'>
                    <FormControl sx={{ m: 1, minWidth: 400 }}>
                    <div class='flex justify-around'>
                    <Select
                        value={variable}
                        onChange={(event)=>{
                            let x=event.target.value;
                            if(x=='category' || x=='Country' || x=='Abbreviation' || x=='channel_type' || x=='created_year' || x=='created_month'){
                                setGraph1(x);
                            }else{
                                setGraph2(x);
                            }

                            }}
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ width: '200px' }}
                    >
                        <MenuItem value={"category"}>Category</MenuItem>
                        <MenuItem value={"Country"}>Country</MenuItem>
                        <MenuItem value={"Abbreviation"}>Abbreviation</MenuItem>
                        <MenuItem value={"channel_type"}>Channel type</MenuItem>
                        <MenuItem value={"created_year"}>Channel creation year</MenuItem>
                        <MenuItem value={"created_month"}>Channel creation month</MenuItem>


                        
                        <MenuItem value={"subscribers"}>Number of subscribers</MenuItem>
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
                    <div class="flex items-center">
                        <div class='mx-4 ml-16'>Upright</div>
                        <FormControlLabel control={
                            <Switch onChange={()=>{
                                orientation=="upright"?setOrientation('sideways'):setOrientation('upright');
                            }}
                            sx={{
                                '& .MuiSwitch-thumb': {
                                  backgroundColor: '#1976d2',
                                },
                                '& .MuiSwitch-track': {
                                  backgroundColor: '#1976d2',
                                },
                            }}
                            />} 
                        />   
                        <div>Sideways</div>
                    </div>
                    </div>

                    </FormControl>          
                </div>
            </div>


            <div class='flex justify-center'>
                {(variable=='channel_type' || variable=='Country' || variable=='created_year' || variable=='created_month' || variable=='category' || variable=='Abbreviation')?
                    <div>
                        {orientation=='upright'?
                            <div>
                                <h1 class='flex justify-center'>BarChart</h1>
                                <BarChartUpright xData={graph1X} yData={graph1Y}  variable={variable} />
                            </div>
                            :
                            <div>
                                <h1 class='flex justify-center'>BarChart</h1>
                                <BarChartSideways xData={graph1X} yData={graph1Y} variable={variable} />
                            </div>
                        }
                    </div> 
                    :
                    <div>
                        {orientation=='upright'?
                            <div>
                                <h1 class='flex justify-center'>Histogram</h1>
                                <HistogramUpright bins={graph2Bins} variable={variable}/>
                            </div>
                            :
                            <div>
                                <h1 class='flex justify-center'>Histogram</h1>
                                <HistogramSideways bins={graph2Bins} variable={variable}/>
                            </div>
                        }
                    </div> 
                }
                
            </div>
            <br /><br />
            
        </div>
    </div>
  )
}

export default Page1