import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Container from './Container/Container';

function SemesterResult() {
    const {id}=useParams();
    const [data,setData]=useState();
    const baseUrl="http://localhost:8000/"

    const fetchSemResult=async()=>{
      try {
        const response=await axios.get(`http://localhost:8000/api/semester-results?mentee_id=${id}`);
        setData(response?.data?.result)
        if(response===200 || response===201){
            console.log("Results retrieved successfully");
        }
        else{
          throw response;
        }
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(()=>{
      fetchSemResult()
    },[])
  return (
    <Container>
    <div className=' w-full  justify-center bg-gradient-to-r from-[#ffd89b] to-[#19547b] flex items-center duration-200 flex-wrap'>
      <div className=' w-full max-w-5xl m-auto p-4 mt-8 flex-col justify-center items-center '>
        <div className=' flex justify-between items-center mx-auto w-full mb-12 text-xl font-bold text-white '>
            <h1 className=' inline-block shadow-lg shadow-sky-400 bg-white/60 px-6 py-3 text-sky-600 rounded-lg'> <span className='text-sm font-semibold text-black'> Name :</span> {data?.mentee_details?.full_name}</h1> 
            <h1 className=' inline-block shadow-lg shadow-green-400 bg-white/60 px-6 py-3 text-green-600 rounded-lg'> <span className='text-sm font-semibold text-black'>University N0. :</span> {data?.mentee_details?.university_number}</h1>
        </div>
        { 
          data?.semester_results?.map((result)=>(
            <div key={result.id} className=' flex justify-center items-center mb-8 '>
              <div  className=' w-full flex justify-between p-4 rounded-2xl shadow-lg max-w-xl bg-white/20'>
              <div className=' w-full m-8'>
                <h3 className=' text-gray-600 mb-2 text-lg font-bold'> Semester : {result.semester}</h3>
                {/* <a href={baseUrl+result.file_path}  download={true} > View Result </a> */}
                <div onClick={() => {
                    if (result.file_path) {
                      const link = document.createElement('a');
                      link.href = baseUrl+result.file_path;
                      link.target="blank"
                      link.download =true;
                      link.click();
                    } else {
                      console.log('File is not Available');
                    }
                  }} className=' w-29 text-white cursor-pointer bg-purple-500 flex rounded-2xl  mt-4 px-4 text-center py-2 '>
                    View Result
                </div>
              </div>
              <div className=' w-1/2 font-semibold flex flex-col justify-center text-lg p-2'>
                <h3> CGPA : {result.cgpa} </h3>
                <h3> SGPA : {result.sgpa} </h3>
                <h3> Backlogs : {result.backlogs} </h3>
                <h3> Result : {result.results} </h3>
              </div>
            </div>
            </div>
          ))
        }
      </div>
    </div>
    </Container>
  )
}

export default SemesterResult