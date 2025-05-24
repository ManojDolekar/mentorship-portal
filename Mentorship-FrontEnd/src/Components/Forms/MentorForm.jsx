import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, } from 'react-router-dom'
// import {Input,Button,Logo} from '../index'
import Input from '../ReComponents/Input'
import Button from '../ReComponents/Button'
import Logo from '../Logo'

function MentorForm({user}) {

    
    const{register,handleSubmit,setValue}=useForm({
        defaultValues:{
            id:user?.id || "",
            qualification:user?.qualification || "",
            designation:user?.designation || "",
            full_name:user?.full_name || "",
            contact_number:user?.contact_number || "",
            email_address:user?.email_address || "",
            password: "",
        }
    })
    const navigate=useNavigate();
    useEffect(()=>{
        if(user?.id){
            setValue('id',user.id)
        }
    },[user,setValue])
    

    const submit= async (data)=>{
        try {
            if(user){
                const formData=new FormData();
                formData.append('id',data.id)
                formData.append("file_path",data.file_path[0])
                formData.append('full_name',data.full_name)
                formData.append('designation',data.designation)
                formData.append('contact_number',data.contact_number)
                formData.append('email_address',data.email_address)
                formData.append('qualification',data.qualification)
                formData.append('password',data.password)
                
                // const formdata={ ...data , id:user.id}
                const response=await axios.put('http://localhost:8000/api/mentor',formData,{
                    headers:{ 'Content-Type': 'multipart/form-data',},});
                if(response.status===200 || response.status===204){
                    console.log("Mentor Updated Successfully")
                    navigate(`/mentor-profile`)
                }
            }
            else{
                const response=await axios.post('http://localhost:8000/api/mentor',data);
                if(response.status===200 || response.status===201){
                    console.log("Mentor account created Successfully")
                    navigate(`/all-mentors`)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }


    

    return (
        <div className=' w-full flex items-center justify-center m-auto h-screen duration-200 transition-all bg-gradient-to-r from-[#ffd89b] to-[#19547b]'>
            <div className=' w-full max-w-4xl flex flex-col items-center p-6 border-2 border-white/20 shadow-2xl rounded-2xl '>
                {
                    !user ? (
                    <div>
                        {/* <span className=' items-center flex mx-auto mb-2'><Logo/></span> */}
                        <h1 className=' text-gray-700 text-2xl font-bold my-6'>Adding new Mentor</h1>
                    </div>
                    ):(
                        <div>
                            {/* <span className=' items-center w flex mx-auto mb-2'><Logo/></span> */}
                            <h1 className=' text-gray-700 text-2xl font-bold my-6'>Update your profile</h1>
                        </div>
                    )
                }
                <div className=' w-full  '>
                    <form
                    className=' mt-2'
                    onSubmit={handleSubmit(submit)}>
                        <div className=' w-full gap-4 grid sm:grid-cols-2  '>
                        
                            <Input
                            label='Full name :'
                            type='text'
                            {
                                ...register("full_name",{
                                    required:true,
                                })
                            }
                            />
                            <Input
                            label='Designation :'
                            type='text'
                            {
                                ...register("designation",{
                                    required:true,
                                })
                            }
                            />
                            <Input
                            label='Contact Number :'
                            type='number'
                            {
                                ...register("contact_number",{
                                    required:true,
                                    minLength:10,
                                    maxLength:10
                                })
                            }
                            />
                            <Input
                            label='Email :'
                            type='email'
                            {
                                ...register("email_address",{
                                    required:true,
                                    validate:{
                                        matchPattern:(value)=>/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value) || "Enter a valid email address"
                                    }
                                })
                            }
                            />
                            <Input
                            label='Qualification :'
                            type='text'
                            {
                                ...register("qualification",{
                                    required:true,
                                })
                            }
                            />
                            {user && (
                                <Input
                                label="profile picture :"
                                type="file"
                                // error={errors?.file_path && "profile picture required "}
                                className=' file:bg-blue-200 hover:file:bg-blue-300  file:px-4 file:rounded-lg ring-transparent file:text-blue-600 file:m-4 file:text-sm file:py-1 file:font-semibold text-sm bg-transparent '
                                accept='Image/png,Image/jpeg,Image/jpg,Image/gif,Image/heic'
                                {
                                    ...register("file_path",{
                                    })
                                }
                                />
                            )}
                            <Input
                            label='Password :'
                            type='password'
                            
                            {
                                ...register("password",{
                                    required:true,
                                })
                            }
                            />
                        </div>
                        <div className=' w-full mt-6 flex justify-center items-center'>
                                <Button 
                                type='submit'
                                className={`${!user ? `bg-blue-600` : `bg-green-600`} w-40 text-white`}
                                >
                                    { !user ? "Add Mentor" : "Update"}
                                </Button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MentorForm


