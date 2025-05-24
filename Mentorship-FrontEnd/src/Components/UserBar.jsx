import React from 'react'
import { useNavigate } from 'react-router-dom';
// import {Button} from './index'
import Button from './ReComponents/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';

function UserBar({userdata}) {
    
    const {role,full_name,file_path,id}=userdata;
    const navigate=useNavigate()
    const{adminStatus , mentorStatus}=useSelector(state=>state.auth)
    const baseUrl='http://localhost:8000/'

    const deleteMentor=async(id)=>{
        const response= await axios.delete(`http://localhost:8000/api/mentor?id=${id}`)
        if(response.status===200){
            console.log(response?.data?.message);
        }
    }

    const deleteMentee=async(id)=>{
        const response= await axios.delete(`http://localhost:8000/api/mentee?id=${id}`)
        if(response.status===200){
            console.log(response?.data?.message);
        }
    }
    
    const deleteUser=()=>{
        if(adminStatus){
            deleteMentor(id) ;
            navigate('/all-mentors')
        }else{
            deleteMentee(id);
            navigate('/all-mentees')
        }
    }

  return (
    <div className=' w-full p-4 rounded-2xl justify-between flex bg-white items-center hover:shadow-xl duration-200 transition-all'>
        <div className=' gap-4 items-center flex flex-col '>
            <div className=' w-16 h-16 overflow-hidden ring-2 ring-amber-200 rounded-full hover:shadow-lg'>
                <img src={baseUrl+file_path} alt="Profile" className=' object-cover ' />
            </div>
            <div className=' flex flex-col '>
                <h1 className='font-bold'>{full_name}</h1>
                <p className=' text-gray-400'>{role}</p>
            </div>
        </div>
        <div className=' flex flex-wrap justify-end items-center gap-3'>
            {
                role==="mentee"   && (
                    // <div className='flex gap-3 items-center justify-center flex-wrap'> 
                    <>
                        <Button type='button' onClick={()=>navigate(`/userdetails/${id}`)}  className="bg-purple-700 hover:bg-purple-800 text-white">
                            Details     
                        </Button>
                        <Button type='button' onClick={()=>navigate(`/semister-result/${id}`)}  className="bg-blue-600 hover:bg-blue-700 text-white">
                            Semester Result
                        </Button>
                        <Button type='button' onClick={()=>navigate(`/activities/${id}`)}  className="bg-teal-500 hover:bg-teal-600 text-white">
                            Activities
                        </Button>
                    </>
                    // </div>
                )}
                {role==="mentor" &&(
                    <Button type='button' onClick={()=>navigate(`/mentor-mentees/${id}`)}  className="bg-teal-500 hover:bg-teal-600 text-white">
                        Mentees
                    </Button>
                )}
                {(adminStatus && role==="mentor" || mentorStatus && role==="mentee")  && (
                    <Button type='button' onClick={deleteUser}  className="bg-red-500 hover:bg-red-600 text-white">
                        Delete
                    </Button>
                )}
        </div>
    </div>
  )
}

export default UserBar 

