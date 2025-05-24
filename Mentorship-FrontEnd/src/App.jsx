import { useCallback, useEffect, useState ,useTransition } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import axios from 'axios'


function App() {
  // const [Mentors, setMentors] = useState(null)
  // const [activities,setActivities]=useState(null)

 
  
  const id=10;
  const [data,setData]=useState(null);
  const [points,setPoints]=useState(null);
  const [Mentors,setMentors]=useState([])
  const [isPending , startTransition]=useTransition();

  

//   const fetchActivities=async()=>{
//       try {
//       const response=await axios.get(`http://localhost:8000/api/activities?mentee_id=${id}`);
//       setData(response?.data?.result)
//       if(response===200 || response===201){
//           console.log("Activities retrieved successfully");
//       }
//       } catch (error) {
//           console.error(error);
//       }
//   }

    const fetchActivities = ()=>{
        startTransition(
            async()=>{
                try {
                    const response = await axios.get('http://localhost:8000/api/activities?mentee_id=${id}');
                    if(response.status===200 || response.status===201){
                        setData(response?.data?.result)
                        console.log("Activities retrived successfully");
                    }
                } catch (error) {
                    console.log('error while fetching mentee data',error);
                }
            }
        );
    }

  const fetchMentors=async ()=>{ 
      try {
      const response=await axios.get('http://localhost:8000/api/mentor');
      setMentors(response?.data?.result?.mentors)
      if(response===200 || response===201){
          console.log("Mentors retrieved successfully");
      }
      } catch (error) {
          console.error(error);
      }
  }

  const fetchPoints=async()=>{
      try {
      const response=await axios.get(`http://localhost:8000/api/activities/mentee-points?mentee_id=${id}`);
      setPoints(response?.data?.result)
      if(response===200 || response===201){
          console.log("Activities points fetched successfully");
      }
      } catch (error) {
          console.error(error);
      }
  }
  
  const approvedStatus=(activity)=> {
    if (activity.faculty_approved===1) {
        return "Approved"
    } else if (activity.faculty_approved===0) {
        return "Rejected"
    }else{
      return "Not Approved"
    }
  }
    
  

  useEffect(()=>{
      fetchActivities();
      fetchMentors();
      fetchPoints();
  },[])

  return (
      <div className='  w-full  flex flex-wrap my-auto items-center duration-200 bg-gray-100'>
              <div className=' p-2 mt-8 flex gap-30 items-center flex-wrap  mb-8 mx-auto font-bold '>
                  <h1 className=' inline-block'> Name : {data?.mentee_details?.full_name}</h1>
                  <h1 className=' inline-block'> Email : {data?.mentee_details?.email}</h1>
                  <h1 className=' inline-block'> University Number : {data?.mentee_details?.university_number}</h1>
                  <h1 className=' inline-block'> Total Points : {points?.total_points}</h1>
              </div>
          <div className='w-full p-2 flex flex-wrap items-center mx-40'>
              <div className=' w-full flex flex-wrap items-center p-2 '>
                  { 
                      data?.activities?.map((activity)=>( 
                        activity.is_deleted===0 ?                           
                      <div key={activity.id} className=' mx-14 w-full hover:shadow-lg hover:shadow-gray-500 flex flex-wrap rounded-2xl bg-amber-100 border-0 border-amber-400 hover:border-2 hover:border-amber-400 mb-8 duration-200 hover:scale-110 hover:mx-10  '>
                          <div className=' w-9/12 flex my2 flex-col  p-2 ' >
                              <h3 className=' mx-2 my-4'> Activity Desctiption : {activity.activity_description} </h3>
                              <h3 className=' mx-2 my-4'> Associated Club : {activity.associated_club} </h3>
                              <h3 className=' mx-2 my-4'> Completion Date : {activity.completion_date} </h3>
                              <h3 className=' mx-2 my-4'> Assigned Mentor : {Mentors?.filter((mentor) =>
                                                                              data?.activities?.some((activity) => mentor.id === activity.assigned_mentor)
                                                                            ).map((mentor) => mentor.full_name)} </h3>
                              <h3 className=' mx-2 my-4'> </h3> 
                              <h3 className=' mx-2 '> </h3>
                          </div>
                          <div className=' w-3/12'>
                              <h3 className=' mx-2 my-10'> Points : {activity.points}</h3>
                              <h3 className=' mx-2 my-10'> Faculty Approval : {approvedStatus(activity)}</h3>
                              <div className=' mx-2 my-10 w-full'>
                                <img src={activity.file_path} alt='activity' className='w-full'   />
                              </div>
                          </div>
                      </div> : null
                      ))
                  }
              </div>
          </div>
      </div>
  )
}
    // const fetchMentors=async ()=>{ 
    //   try {
    //     const response=await axios.get('http://localhost:8000/api/mentor');
    //     setMentors(response?.data?.result?.mentors)
    //     if(response===200 || response===201){
    //       console.log("Mentors retrieved successfully");
    //     }
    //   } catch (error) {
    //     console.error(error);
        
    //   }
    // }
        
//         const fetchActivities=async()=>{
//           try {
//             const id=10;
//             const response=await axios.get(`http://localhost:8000/api/activities?mentee_id=${id}`);
//             setActivities(response?.data?.result?.activities)
//             if(response===200 || response===201){
//               console.log("Activities retrieved successfully");
//             }
            
//           } catch (error) {
//             console.error(error);
//           }
//         }
        
//         useEffect(()=>{
//             fetchMentors();
//             fetchActivities();
//         },[])
//         Mentors!==null && console.log(Mentors);
//         activities!==null && console.log(activities);

      
//         const matchedMentors = Mentors?.filter((mentor) =>
//           activities.some((activity) => mentor.id === activity.assigned_mentor)
//         ).map((mentor) => mentor.full_name);
        
//         matchedMentors !== undefined && console.log(matchedMentors);
        
    
// //     Mentors?.mentors?.map((mentor)=>console.log(mentor)
// //   )
// //   console.log(Mentors.mentors);


//   // const facultyApproval=async()=>{
//   //   try {
//   //     const data={
//   //       activity_id:1,
//   //       mentor_id:1,
//   //       faculty_approved:1
//   //     }
//   //     const response=await axios.get('http://localhost:8000/api/activities/faculty-approval?activity_id=2&mentor_id=1')
//   //     if(response.status===200 || response.status===201){
//   //       console.log("faculty update status is updated");
//   //     }else{
//   //       throw response
//   //     }
//   //   } catch (error) {
//   //     console.error(error)
//   //   }
//   // }

//   useEffect(()=>{
//     // facultyApproval();
//   },[])
  
//   return (
//     <>
   
//     </>
//   )


export default App
