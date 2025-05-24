import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
// import PersonIcon from '@mui/icons-material/PersonIcon';
// import SchoolIcon from '@mui/icons-material/SchoolIcon';

function UserDetails() {
    const{id}=useParams();
    const [data ,setData]=useState(null);
    const baseUrl='http://localhost:8000/'
    const imagePath=baseUrl+data?.file_path
    const detailItems=[
        {
            status:true,
            key:"Full Name :",
            value:data?.full_name,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A7.975 7.975 0 0012 20a7.975 7.975 0 006.879-2.196M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>          
                },
        {
            status:data?.role==="mentor"? true : false,
            key:"Designation :",
            value:data?.designation,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>                
        },
        {
            status:data?.role==="mentee"?true : false,
            key:"University Number :",
            value:data?.university_number,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.84 4.742c0 3.314-2.686 6-6 6s-6-2.686-6-6c0-1.708.735-3.252 1.903-4.322L12 14z" />
            </svg>                                   
        },
        {
            status:data?.role==="mentor"? true : false,
            key:"Email :",
            value:data?.email_address,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <path d="M22 6 12 13 2 6" />
            </svg>                            
        },
        {
            status:data?.role==="mentee"? true : false,
            key:"Email :",
            value:data?.email,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <path d="M22 6 12 13 2 6" />
            </svg>                            
        },
        {
            status:true,
            key:"Contact Number :",
            value:data?.contact_number,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.586a1 1 0 01.707.293l2.914 2.914a1 1 0 010 1.414L8.414 10.5a16.007 16.007 0 005.586 5.586l2.379-2.379a1 1 0 011.414 0l2.914 2.914a1 1 0 01.293.707V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V7a2 2 0 012-2z" />
            </svg>                 
        },
        {
            status:data?.role==="mentor"? true : false,
            key:"Qualification :",
            value:data?.qualification,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0H7m5 0h5" />
            </svg>                        
        },
        {
            status:data?.role==="mentee" ? true : false,
            key:"Address :",
            value:data?.address,
            icon:<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
            </svg>                            
        }
    ]

    const Details=async()=>{
        try {
            const mentorDetails= await axios.get(`http://localhost:8000/api/mentor?id=${id}`)
            const menteeDetails= await axios.get(`http://localhost:8000/api/mentee?id=${id}`)
            if(mentorDetails?.data?.result?.mentors.length>=1){
                setData(mentorDetails?.data?.result?.mentors[0])
            }
            else if(menteeDetails?.data?.result?.mentees.length>=1){
                setData(menteeDetails?.data?.result?.mentees[0])
            }
        } catch (error) {
            console.error("Error while fetching the Indisual details",error)
        }
    }
    useEffect(() => {
        Details();
    }, [])
    

  return (

    <div className='flex  bg-gradient-to-r from-[#ffd89b] to-[#19547b] w-full h-screen justify-center items-center relative'>
    <div className='flex gap-6 bg-transparent p-4 w-full max-w-xl shadow-2xl ring-2 ring-white/20 rounded-2xl '>
        <div className=' items-center flex flex-col m-auto'>
            <div className=' w-45 h-45 rounded-4xl ring-2 overflow-hidden ring-white shadow-lg '>
            <img src={imagePath} alt="Profile" className='object-cover' />
            </div>
            <p className=' text-white font-semibold'>{data?.full_name}</p>
        </div>
        <div className='justify-end flex flex-col items-center mr-8'>
            <h1 className=' text-2xl text-white font-bold mb-4'>Details</h1>
                {
                    data !== null && (
                        detailItems.map((item)=>(
                            item.status? <div key={item.key} className='grid grid-cols-2'>
                            <div className=' flex items-center justify-end mr-4 p-2'>
                                {item.icon}
                            </div>
                            <div className='text-white/90 justify-end mb-2'>
                                <h2 className='font-semibold'>{item.key}</h2>
                                <h2>{item.value}</h2>
                            </div>
                        </div> : null
                        ))
                    )
                }
        </div>
    </div>
</div>
)
}


    
    // <div className=' w-full flex items-center justify-center mx-8 my-auto rounded-2xl hover:border-2 hover:border-amber-400 duration-200'>
    //     <div className='w-full flex flex-row flex-wrap items-center justify-center p-6 '>
    //         <div className=' w-1/3 p-4 '>
    //             <img src={data?.file_path} alt="User Profile" className=' w-full focus:scale-125 focus:flex focus:items-center focus:m-auto justify-center focus:backdrop-blur-lg' />
    //         </div>
    //         <div className=' w-full flex-wrap flex-col p-4 justify-center m-auto '>
    //             {
    //                 data !== null && (
    //                     detailItems.map((item)=>(
    //                         item.status? <div className='flex flex-row '> 
    //                             <h3 className=' inline-block'> {item.key}</h3> <h3 className=' inline-block'>{item.value}</h3>
    //                         </div> : null
    //                     ))
    //                 )
    //             }
    //         </div>
    //     </div>
    // </div>

export default UserDetails