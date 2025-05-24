import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from '../Components/ReComponents/Button';
import Container from '../Components/Container/Container';
import Input from '../Components/ReComponents/Input';
import UserBar from '../Components/UserBar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AllMentees() {
    const navigate=useNavigate();
    const [mentees,setMentees]=useState([]);
    const [page,setPage]=useState(1);
    const [rowPerPage , setRowperpage]=useState(10);
    const [totalpages,setTotalPages]=useState(1);
    const [query,setQuery]=useState('');
    const [typingTimeout,setTypingtimeout]=useState(0);

    const{userData}=useSelector(state=>state.auth)
    
    useEffect(()=>{
        fetchMentees();

    },[page,rowPerPage,query,<userBar/>])
    
    const fetchMentees=async()=>{
        try {
            const url=new URL(`http://localhost:8000/api/activities/mentor-mentees?mentor_id=${userData.id}`)
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

    const handleNext=()=>{
        if(page<totalpages) setPage(page + 1)
    }

    const handlePrev=()=>{
        if(page>1) setPage(page - 1)
    }

    

  return (
    <Container>
        <div className=' flex w-full object-cover duration-200 bg-gradient-to-r from-[#ffd89b] to-[#19547b] p-4'>
            <div className=' w-full flex flex-col items-center mx-auto '>
                <div className=' w-full mb-8 sticky top-3 flex justify-between flex-row bg-opacity-80 backdrop-blur-md z-10 py-4 rounded-2xl'>
                <div className='w-full mx-auto rounded-2xl flex items-center '>
                    <Input
                    type='text'
                    placeholder="🔍 Search Mentees"
                    className='focus:ring-2 focus:outline-none  bg-white/70 focus:ring-indigo-400 border-none shadow-sm rounded-xl duration-200 transition-all '
                    onChange={handleSearchChanges}
                    />
                </div>
                    <Button
                    type='button'
                    onClick={()=>navigate('/create-mentee')}
                    className='bg-gradient-to-r from-amber-400 to-pink-400 text-white font-semibold flex my-auto ml-2 shadow transition-all '
                    >
                        + Add Mentee
                    </Button>
                </div>
                <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        mentees && (
                            mentees.map((mentee)=>(
                                <UserBar key={mentee.mentee_details.id} userdata={mentee.mentee_details}/> 
                            ))
                        )
                    }
                </div>
                <div className=' flex items-center w-full mt-8'>
                    <div className=' mx-auto items-center flex flex-row w-full gap-4 justify-center'>
                        <Button
                        className=' text-white disabled:bg-gray-300 disabled:hover:shadow-none'
                        type='button'
                        onClick={handlePrev}
                        disabled={page===1}
                        >
                            {"< Prev"}
                        </Button>
                        <span>Page :{page}</span>
                        <Button
                        className='text-white disabled:bg-gray-300 disabled:hover:shadow-none'
                        type='button'
                        onClick={handleNext}
                        disabled={page===1}
                        >
                            {"Next >"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </Container>
  )
}

export default AllMentees