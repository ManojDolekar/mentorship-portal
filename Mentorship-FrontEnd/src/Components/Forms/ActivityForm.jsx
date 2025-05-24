import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
// import {Logo ,Input,Button,Select} from '../index'
import Input from '../ReComponents/Input'
import Button from '../ReComponents/Button'
import Logo from '../Logo'
import Select from '../ReComponents/Select'

function ActivityForm() {
    const [error , setError] =useState('');
    const {id}=useParams();
    const navigate= useNavigate();
    const {register, handleSubmit} =useForm({
        defaultValues:{
            mentee_id:id,
            activity_description:"",
            associated_club:"",
            semester:"",
            completion_date:"",
            points:"",
            assigned_mentor:"",
        }
    });
    const [mentors,setMentors]= useState();
    
    const submit=async(data)=>{
        try {
            console.log(data);
            
            //fetching and posting the data throw api
            const formData=new FormData();
            formData.append("mentee_id",data.mentee_id);
            formData.append("activity_description",data.activity_description);
            formData.append("associated_club",data.associated_club);
            formData.append("semester",data.semester);
            formData.append("completion_date",data.completion_date);
            formData.append("points",data.points);
            formData.append("assigned_mentor",data.assigned_mentor);
            formData.append("activity_file",data.activity_file[0]);

            const response= await axios.post('http://localhost:8000/api/activities',formData,{
                headers:{ 'Content-Type': 'multipart/form-data',},
            })
            if(response.status===200 || response.status===201 ){
                console.log('Activity created successfully');
                navigate(`/activities/${id}`)
            }
        } catch (error) {
            console.error(error);
        }
    }
    const fetchMentors=async()=>{
        try {
            const mentorsResponse=await axios.get('http://localhost:8000/api/mentor')
            setMentors(mentorsResponse?.data?.result?.mentors)
            if(mentorsResponse.status===200 || mentorsResponse.status===201){
                console.log("Mentors retrived successfully");
            }
        } catch (error) {
            console.error(error.mentorResponse?.data)
        }
    }

    useEffect(()=>{
        fetchMentors();
    },[])

    return (
        <div
        className=' flex items-center h-fit justify-center  w-full bg-gradient-to-r from-[#ffd89b] to-[#19547b]'
        >
            <div
            className={`mx-auto w-full max-w-lg rounded-xl p-10 border border-white/40 shadow-2xl`}
            >
                <div
                className='mb-2 flex justify-center '>
                    <span className=' inline-block w-full max-w-[100px]'>
                        <Logo  width='100%'/>
                    </span>
                </div>
                <h2 className=' text-center text-2xl font-bold text-gray-700 leading-tight'>
                    Submiting Activity</h2>
    
                {error && <p className=' text-red-600 mt-8'
                >{error}</p>}
                <form onSubmit={handleSubmit(submit)}
                className='mt-8'>
                    <div className=' space-y-5'>
                        <Input 
                        label="Mentee Id :"
                        type="text"
                        { ...register("mentee_id",{
                            required:true,
                        })}
                        />
                        <Input
                        label="Activity Description :"
                        type="text"
                        {
                            ...register("activity_description",{
                                required:true,
                            })
                        }
                        />
                        <Input
                        label="Associated Club :"
                        type="text"
                        {
                            ...register("associated_club",{
                                required:true,
                            })
                        }
                        />
                        <Input
                        label="Semester :"
                        type="text"
                        {
                            ...register("semester",{
                                required:true,
                            })
                        }
                        />
                        <Input
                        label="Completion Date :"
                        type="date"
                        {
                            ...register("completion_date",{
                                required:true,
                            })
                        }
                        />
                        <Input
                        label="Points :"
                        type="text"
                        {
                            ...register("points",{
                                required:true,
                            })
                        }
                        />
                        <Select
                        options={mentors}
                        label='Select Mentor'
                        className='mb-4'
                        {
                            ...register('assigned_mentor',{required:true})
                        }
                        />
                        <Input
                        label="Activity file :"
                        type="file"
                        className=' file:bg-indigo-200 file:text-blue-500 file:px-2 file:m-2 file:font-semibold '
                        accept='Image/png,Image/jpeg,Image/jpg,Image/gif,Image/heic'
                        {
                            ...register("activity_file",{
                                required:true,
                            })
                        }
                        />
                        <div className=' items-center flex'>
                        <Button 
                        type='submit'
                        className='mx-auto  w-40 rounded-2xl text-white bg-indigo-600 '
                        >Submit</Button>
                        </div>
                        
                    </div>
                </form>
    
            </div>
            
        </div>
    )
}

export default ActivityForm