import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

function App() {

  const [data,setData]=useState([])


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data/yt_stats.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      
      // Parse CSV data using PapaParse
      Papa.parse(csv, {
        header: true,
        complete: (result) => {

            let arr=[];
            for(let entry of result.data){
                let bool=false;
                for(let x in entry){
                    if(entry[x]=='' || entry[x]=='nan' || entry[x]=='0'){
                        bool=true;
                        break;
                    }
                }
                if(bool) continue;

                arr.push(entry);
            }

            setData(arr)
        }
    });
    };
    fetchData();
  },[]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 data={data}/>}/>
        <Route path="/page1" element={<Page1 data={data}/>}/>
        <Route path="/page2" element={<Page2 data={data}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
