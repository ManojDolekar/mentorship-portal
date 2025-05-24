import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import { ActivityBox, Container } from '../Components';
import ActivityBox from '../Components/ActivityBox';
import Container from '../Components/Container/Container';
import { useParams } from 'react-router-dom';

function ActivitiesApproval() {
    const userData=useSelector(state=>state.auth.userData)
    const [mentor,setMentor]=useState(null);
    
    useEffect(()=>{
      if(userData!==null){
        setMentor(userData)
      } 
    },[userData])

  return (
    <Container>
        {mentor!==null? <ActivityBox  mentor={mentor}/> : null} 
    </Container>
  )
}

export default ActivitiesApproval