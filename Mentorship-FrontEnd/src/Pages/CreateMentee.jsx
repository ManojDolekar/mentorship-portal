import React from 'react'
// import { Container } from '../Components'
import Container from '../Components/Container/Container'
import MenteeForm from '../Components/Forms/MenteeForm'
import { useSelector } from 'react-redux'

function CreateMentee() {
    const userData=useSelector(state=>state.auth.userData)

  return (
    <Container>
        {userData !== null && <MenteeForm id={userData.id}/>}
    </Container>
  )
}

export default CreateMentee