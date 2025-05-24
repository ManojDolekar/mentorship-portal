import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Input from '../ReComponents/Input'
import Button from '../ReComponents/Button'
import Logo from '../Logo'
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"

function MenteeProfile({user}) {

    const { university_number, username,full_name,contact_number,email,password,address,id} =user;

    const navigate=useNavigate();
    const baseUrl='http://localhost:8000/'
    const imagePath=baseUrl+user.file_path
   

    return (
        <div className=' w-full h-screen flex bg-gradient-to-r from-[#ffd89b] to-[#19547b]  transition-all duration-300 justify-center items-center px-6 py-18 '>
            <AnimatePresence mode="wait">
            <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.5 }} 
            className=' p-8 w-full max-w-5xl border-2 border-amber-200 backdrop-blur-2xl  bg-white/40 shadow-2xl  rounded-xl'>
                <div className=' flex flex-row justify-between items-center'>
                    <div>
                        <div className=' w-20 h-20 overflow-hidden rounded-full ring-4 hover:shadow-lg ring-amber-300'>
                            <img src={imagePath} alt="Profile" className=' object-cover' />
                        </div>
                        <h1 className='font-bold text-2xl'>Hello, {user.full_name.split(" ")[0]}</h1>
                        <p className='text-gray-400'>{user.designation}</p>
                    </div>
                    <Button type='button' onClick={()=>navigate(`/update-mentee-profile/${id}`)} bgColor='bg-amber-300' className='rounded-lg text-white'>
                        Edit Profile
                    </Button>
                </div>
                <form className=' mt-6'>
                    <div className=' w-full gap-4 grid grid-cols-1 md:grid-cols-2'>
                        <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                            <h2 className=' absolute top-1 text-gray-700'>Full Name </h2>
                            <span className='absolute bottom-1 text-md'>{full_name}</span>
                        </div>
                        <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                            <h2 className=' absolute top-1 text-gray-700'>Username </h2>
                            <span className='absolute bottom-1 text-md'>{username}</span>
                        </div>
                        <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                            <h2 className=' absolute top-1 text-gray-700'>University No. </h2>
                            <span className='absolute bottom-1 text-md'>{university_number}</span>
                        </div>
                        <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                            <h2 className=' absolute top-1 text-gray-700'>Contact No. </h2>
                            <span className='absolute bottom-1 text-md'>{contact_number}</span>
                        </div>
                        <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                            <h2 className=' absolute top-1 text-gray-700'>Email </h2>
                            <span className='absolute bottom-1 text-md'>{email}</span>
                        </div>
                        <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                            <h2 className=' absolute top-1 text-gray-700'>Address </h2>
                            <span className='absolute bottom-1 text-md'>{address}</span>
                        </div>
                    </div>
                </form>
            </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default MenteeProfile