import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import { Container } from '../Components';
import Container from '../Components/Container/Container';
import MenteeForm from '../Components/Forms/MenteeForm';
import { useSelector } from 'react-redux';
import MenteeProfile from '../Components/Profile/MenteeProfilel';

function MenteeProfilePage() {
    const userData=useSelector(state=>state.auth.userData);
    const [user,setUser]=useState(null)


    const fetchMentee=async()=>{
        try {
            const response=await axios.get(`http://localhost:8000/api/mentee?id=${userData.id}`)
            setUser(response?.data?.result?.mentees[0])
            if(response.status===200 || response.status===201){
                console.log("mentee retrived successfully")
            }
        } catch (error) {
            console.error(error);
        }
        }

    useEffect(()=>{
        fetchMentee()
    },[])
    return (
        <Container>
            {user !== null && <MenteeProfile user={user}/>}
        </Container>
    )
}
export default MenteeProfilePage