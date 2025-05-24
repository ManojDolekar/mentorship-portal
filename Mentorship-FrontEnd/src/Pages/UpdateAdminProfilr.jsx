import React, { useEffect, useState } from 'react'
// import { Container } from '../Components';
import Container from '../Components/Container/Container';
import AdminForm from '../Components/Forms/AdminForm';
import { useSelector } from 'react-redux';
import axios from 'axios';

function UpdateAdminProfilr() {
    const [user,setUser]=useState(null);
    const userData=useSelector(state=>state.auth.userData);

    const fetchAdmin=async()=>{
        try {
            const response=await axios.get(`http://localhost:8000/api/admin?id=${userData.id}`)
            setUser(response?.data?.result?.admins[0])
            if(response.status===200 || response.status===201){
                console.log("Admin retrived successfully");
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchAdmin()
    },[])

  return (
    <Container>
        {user!==null && <AdminForm user={user}/>}
    </Container>
  )
}

export default UpdateAdminProfilr