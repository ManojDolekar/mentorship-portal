import axios from 'axios'
import React from 'react'
import Button from '../ReComponents/Button';

function FacultyApproval({mentor,activity}) {

    const approve={
        activity_id:activity.id,
        mentor_id:mentor.id, 
        faculty_approved:1
    }
    const reject={
        activity_id:activity.id,
        mentor_id:mentor.id, 
        faculty_approved:0
    }

    
    
    const submit=async(data)=>{
        try {
            console.log(data);
            const response=await axios.put(`http://localhost:8000/api/activities/faculty-approval`,data)
            if(response.status===200 || response.status===201){
                console.log("Approval status updated successfully");
            }
        } catch (error) {
            console.error(error.response?.data);
        }
    }

    return (
        <div className=' w-full flex items-center gap-x-4 duration-200'>

            <Button 
            className="bg-cyan-500 text-white disabled:bg-gray-400 hover:shadow-none"
            type ='button'
            onClick={()=>submit(approve)}
            disabled={activity.faculty_approved===  1}
            >
                Approve
            </Button>
            <Button 
            className="bg-red-500 text-white disabled:bg-gray-400 hover:shadow-none"
            type ='button'
            onClick={()=>submit(reject)}
            disabled={activity.faculty_approved===   1}
            >
                Reject
            </Button>
        </div>
    )
}

export default FacultyApproval