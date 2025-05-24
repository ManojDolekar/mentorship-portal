import React, { useEffect, useState } from 'react'
// import { Container } from '../Components'
import Container from '../Components/Container/Container';
import { useSelector } from 'react-redux'
import axios from 'axios';
import MentorForm from '../Components/Forms/MentorForm';

function UpdateMentorProfilr() {
    const userData=useSelector(state=>state.auth.userData);
    const [mentor,setMentor]=useState(null);

    const fetchMentor=async()=>{
        try {
            const response=await axios.get(`http://localhost:8000/api/mentor?id=${userData.id}`)
            setMentor(response?.data?.result?.mentors[0])
            if(response.status===200 || response.status===201){
                console.log("Mentor retrived successfully");
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchMentor()
    },[])

  return (
    <Container>
        {
            mentor!==null && <MentorForm user={mentor}/>
        }
    </Container>
  )
}

export default UpdateMentorProfilr