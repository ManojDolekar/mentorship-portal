import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from '../Components/ReComponents/Button';
import Container from '../Components/Container/Container';
import Input from '../Components/ReComponents/Input';
import UserBar from '../Components/UserBar';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AllMentees() {
    const navigate=useNavigate();
    const [mentees,setMentees]=useState([]);
    const [page,setPage]=useState(1);
    const [rowPerPage , setRowperpage]=useState(10);
    const [totalpages,setTotalPages]=useState(1);
    const [query,setQuery]=useState('');
    const [typingTimeout,setTypingtimeout]=useState(0);

    const {id}=useParams();
    
    useEffect(()=>{
        fetchMentees();

    },[page,rowPerPage,query,<userBar/>])
    
    const fetchMentees=async()=>{
        try {
            const url=new URL(`http://localhost:8000/api/activities/mentor-mentees?mentor_id=${id}`)
            // url.searchParams.append('page',page);
            // url.searchParams.append('rowPerPage',rowPerPage);    
            if(query.trim()){
                url.searchParams.append('filter','full_name')
                url.searchParams.append('query',query.trim())
            }

            const response=await axios.get(url);
            if(response?.data?.success){
                setMentees(response?.data?.result?.mentees);
                setTotalPages(response?.data?.result?.pagination?.totalPages)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSearchChanges=(e)=>{
        const value= e.currentTarget.value
        setPage(1);

        if(typingTimeout) clearTimeout(typingTimeout)

            setTypingtimeout(
                setTimeout(() => {
                    setQuery(value)
                }, 500)
            );
    }

    

  return (
    <Container>
        <div className=' flex h-screen w-full duration-200 bg-gradient-to-r from-[#ffd89b] to-[#19547b] p-4'>
            <div className=' w-full flex flex-col items-center mx-auto '>
                <div className=' w-full mb-8 sticky top-3 flex justify-between flex-row bg-opacity-80 backdrop-blur-md z-10 py-4 rounded-2xl'>
                
                </div>
                    {
                        mentees && (
                            mentees.length < 1 ? (<div className=' w-full flex items-center justify-center h-screen  text-3xl font-semibold text-white/50 '> No mentees are there ......</div>) : 
                            <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {mentees.map((mentee)=>(
                                        <UserBar key={mentee.mentee_details.id} userdata={mentee.mentee_details}/> 
                                ))}
                            </div>
                        )
                    }
            </div>
        </div>
    </Container>
  )
}

export default AllMentees