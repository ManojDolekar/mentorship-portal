import React, { useState ,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import FacultyApproval from './Forms/FacultyApproval';
import { useSelector } from 'react-redux';
import Button from './ReComponents/Button';
import Container from './Container/Container';

function ActivityBox({}) {
    const {id}=useParams();
    const [data,setData]=useState(null);
    const [points,setPoints]=useState(null);
    const [Mentors,setMentors]=useState([])
    const userData=useSelector(state=>state.auth.userData)
    const [mentor,setMentor]=useState(null);
    const navigate=useNavigate();
    const baseUrl="http://localhost:8000/";

    useEffect(()=>{
        if(userData!==null){
            setMentor(userData)
        } 
    },[userData])

    const fetchActivities=async()=>{
        try {
        const response=await axios.get(`http://localhost:8000/api/activities?mentee_id=${id}`);
        setData(response?.data?.result)
        if(response===200 || response===201){
            console.log("Activities retrieved successfully");
        }
        } catch (error) {
            console.error(error);
        }
    }
    const fetchMentors=async ()=>{ 
        try {
        const response=await axios.get('http://localhost:8000/api/mentor');
        setMentors(response?.data?.result?.mentors)
        if(response===200 || response===201){
            console.log("Mentors retrieved successfully");
        }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchPoints=async()=>{
        try {
        const response=await axios.get(`http://localhost:8000/api/activities/mentee-points?mentee_id=${id}`);
        setPoints(response?.data?.result)
        if(response===200 || response===201){
            console.log("Activities points fetched successfully");
        }
        } catch (error) {
            console.error(error);
        }
    }
    
    const approvedStatus=(activity)=> {
        if (activity.faculty_approved===1) {
            return "Approved"
        } else if (activity.faculty_approved===null) {
            return "Not Approved"
        }else{
            return "Rejected"
        }
    }  
    

    useEffect(()=>{
        fetchActivities();
        fetchMentors();
        fetchPoints();
    },[<FacultyApproval/>])

    return (
        <Container>
        <div className='  w-full h-fit flex flex-wrap my-auto items-center duration-200 bg-gradient-to-r from-[#ffd89b] to-[#19547b]'>
                <div className=' p-4 backdrop-blur-2xl mt-8 flex justify-between gap-14 items-center flex-wrap text-white text-xl  rounded-2xl mb-8 mx-auto font-bold '>
                    <h1 className=' inline-block shadow-lg shadow-sky-400 bg-white/60 px-6 py-3 text-sky-600 rounded-lg'> <span className='text-sm font-semibold text-black'>Name :</span>  {data?.mentee_details?.full_name}</h1>
                    <h1 className=' inline-block shadow-lg shadow-green-400 bg-white/60 px-6 py-3 text-green-600 rounded-lg'> <span className='text-sm font-semibold text-black'>Email :</span> {data?.mentee_details?.email}</h1>
                    <h1 className=' inline-block shadow-lg shadow-green-400 bg-white/60 px-6 py-3 text-green-600 rounded-lg'> <span className='text-sm font-semibold text-black'>University N0. :</span> {data?.mentee_details?.university_number}</h1>
                    <h1 className=' inline-block shadow-lg shadow-red-400 bg-white/60 px-6 py-3 text-red-600 rounded-lg'> <span className='text-sm font-semibold text-black'>Total Points :</span> {points?.total_points}</h1>
                </div>
                {
                    userData.role==="mentee" && (
                        <div className=' w-full justify-end items-center flex'>
                            <Button className='mr-28 py-2 cursor-pointer text-lime-500 rounded-lg ring-2 ring-white/10 shadow-lime-400  hover:shadow-lime-400 shadow-sm bg-transparent' onClick={()=>navigate(`/new-activity/${userData.id}`)}> New Activity </Button>
                        </div>
                    )
                }
            <div className='w-full p-2 flex flex-wrap items-center mx-40'>
                <div className=' w-full flex flex-wrap items-center p-2 '>
                    { 
                        data?.activities?.map((activity)=>( 
                            activity.is_deleted===0 ?                           
                        <div key={activity.id} className=' mx-14 w-full hover:shadow-lg ring-2 ring-white/20 text-white font-semibold hover:shadow-gray-500 flex flex-wrap rounded-2xl shadow-2xl border-0 border-amber-400 hover:border-2 hover:border-amber-400 mb-8 duration-200 hover:scale-110 hover:mx-10  '>
                            <div className=' w-9/12 flex my2 flex-col justify-center  p-2  ' >
                                <h3 className=' mx-2 my-4'> Activity Desctiption : {activity.activity_description} </h3>
                                <h3 className=' mx-2 my-4'> Associated Club : {activity.associated_club} </h3>
                                <h3 className=' mx-2 my-4'> Completion Date : {activity.completion_date.slice(0,10)} </h3>
                                <h3 className=' mx-2 my-4'> Assigned Mentor : {Mentors?.filter((mentor) =>
                                                                                mentor.id === activity.assigned_mentor
                                                                                // data?.activities?.some((activit) => mentor.id === activit.assigned_mentor)
                                                                                ).map((mentor) => mentor.full_name)} </h3>
                            </div>
                            <div className='mb-6 w-3/12'>
                                <h3 className=' mx-2 my-10'> Points : {activity.points}</h3>
                                <h3 className=' mx-2 my-10'> Faculty Approval : {approvedStatus(activity)}</h3>
                                {
                                    userData.role==="mentor" && (
                                        <div className=''> 
                                            <FacultyApproval mentor={mentor} activity={activity}/>
                                        </div>
                                    )
                                }
                                <div onClick={() => {
                                    if (activity.file_path) {
                                    const link = document.createElement('a');
                                    link.href = baseUrl+activity.file_path;
                                    link.target="blank"
                                    link.download =true;
                                    link.click();
                                    } else {
                                    console.log('File is not Available');
                                    }
                                }} className=' w-29 text-white cursor-pointer bg-purple-500 flex rounded-2xl  mt-4 px-4 text-center py-2 '>
                                    View Activity
                                </div>
                            </div>
                        </div> : null
                        ))
                    }
                </div>
            </div>
        </div>
        </Container>
    )
}
export default ActivityBox