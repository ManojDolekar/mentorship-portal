import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, } from 'react-router-dom'
// import {Input,Button,Logo} from '../index'
import Input from '../ReComponents/Input'
import Button from '../ReComponents/Button'
import Logo from '../Logo'
import { useSelector } from 'react-redux'
import Container from '../Container/Container'
import admin from '../../Images/admin.jpg'

function AdminProfile({user,id}) {

   const {userData}=useSelector(state=>state.auth)
    const navigate=useNavigate();

   userData!==null && console.log(userData);
   const baseUrl='http://localhost:8000/';
//    const imagePath=baseUrl+user.file_path

    return (
            <Container>
        <div>
            {
                userData !==null && 
                <div>

                    <div className=' w-full h-screen flex bg-gradient-to-r from-[#ffd89b] to-[#19547b]  transition-all duration-300 justify-center items-center px-6 py-18 '>
                        <div className=' p-8 w-full max-w-5xl border-2 border-amber-200 backdrop-blur-2xl  bg-white/40 shadow-2xl  rounded-xl'>
                            <div className=' flex flex-row justify-between items-center'>
                                <div>
                                    <div className=' w-20 h-20 overflow-hidden rounded-full ring-4 hover:shadow-lg ring-amber-300'>
                                        <img src={admin} alt="Profile" className=' object-cover' />
                                    </div>
                                    <h1 className='font-bold text-2xl'>Hello, {userData.full_name}</h1>
                                    <p className='text-gray-400'>{userData.role}</p>
                                </div>
                                <Button type='button' onClick={()=>navigate(`/update-admin-profile`)} bgColor='bg-amber-300' className='rounded-lg text-white'>
                                    Edit Profile
                                </Button>
                            </div>
                            <form className=' mt-6'>
                                <div className=' w-full gap-4 grid grid-cols-1 md:grid-cols-2'>
            
                                    <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                                        <h2 className=' absolute top-1 text-gray-700'>Username </h2>
                                        <span className='absolute bottom-1 text-md'>{userData.full_name}</span>
                                    </div>
                                    <div className=' relative w-full h-15 bg-white border-4 border-gray-200 rounded-2xl px-4 py-2'>
                                        <h2 className=' absolute top-1 text-gray-700'>Email </h2>
                                        <span className='absolute bottom-1 text-md'>{userData.email}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
            }
            </div>
            </Container>
    )
}

export default AdminProfile