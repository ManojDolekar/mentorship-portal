import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


function MenteesTable() {

    const {id} = useParams();
    const [mentees, setMentees] = useState([])

    const fetchMentees= async()=>{
        try {
            const response= await axios.get(`localhost:8000/api/activities/mentor-mentees?mentor_id=${id}`)
            setMentees(response?.data?.result?.mentees)
            if(response===200 || response===201){
                console.log('Mentees retrived successully');
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchMentees();
    },[])

  return (
    <div className=' p-2 w-1/4 flex flex-col items-center'>
        {
            mentees.map((mentee)=>(
                <li className=' list-none p-2 hover:font-semibold' key={mentee.mentee_details.id}> Name : {mentee.mentee_details.full_name } <span> University No.: {mentee.mentee_details.university_number}</span></li>
            ))
        }
    </div>
  )
}

export default MenteesTable