import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, } from 'react-router-dom'
// import {Input,Button,Logo} from '../index'
import Input from '../ReComponents/Input'
import Button from '../ReComponents/Button'
import Logo from '../Logo'

function AdminForm({user}) {

    const{register,handleSubmit}=useForm({
                                        defaultValues:{
                                            username:user?.username || "",
                                            email:user?.email || "",
                                            password:"",
                                        }
    })
    const navigate=useNavigate();

    const submit= async (data)=>{
        try {
            if(user){
                const formdata={...data , id:user.id}
                const response=await axios.put('http://localhost:8000/api/admin',formdata);
                if(response.status===200 || response.status===204){
                    console.log("Admin Updated Successfully")
                    navigate(`/admin-profile`)
                }
            }
            else{
                const response=await axios.post('http://localhost:8000/api/admin',data);
                if(response.status===200 || response.status===201){
                    console.log("Admin account created Successfully")
                    navigate(`/`)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }


    

    return (
        <div className=' w-full flex items-center justify-center m-auto h-screen duration-200 transition-all  bg-gradient-to-r from-[#ffd89b] to-[#19547b]'>
            <div className=' w-full max-w-4xl flex flex-col items-center p-6 border-2 border-white/20 shadow-2xl rounded-2xl '>
            {
                    !user ? (
                    <div>
                        {/* <span className=' items-center flex mx-auto mb-2'><Logo/></span> */}
                        <h1 className='  text-gray-700 text-2xl font-bold my-6'>Adding new Admin</h1>
                    </div>
                    ):(
                        <div>
                            {/* <span className=' items-center flex mx-auto mb-2'><Logo/></span> */}
                            <h1 className='  text-gray-700 text-2xl font-bold my-6'>Update your profile</h1>
                        </div>
                    )
                }
                <div className=' w-full '>
                    <form
                    className=' mt-2'
                    onSubmit={handleSubmit(submit)}>
                        <div className='  w-full gap-4 grid sm:grid-cols-2  '>
                            <Input
                            label='Username :'
                            type='text'
                            {
                                ...register("username",{
                                    required:true,
                                })
                            }
                            />
                        
                            <Input
                            label='Email :'
                            type='email'
                            {
                                ...register("email",{
                                    required:true,
                                    validate:{
                                        matchPattern:(value)=>/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value) || "Enter a valid email address"
                                    }
                                })
                            }
                            />

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
                            <div className=' w-full flex items-center'>
                                <Button 
                                type='submit'
                                name={ !user ? "Add Mentee" : "Update"}
                                className={!user ? `bg-blue-600` : `bg-green-600` && 'mx-auto w-40 text-white mt-6'}
                                >
                                    { !user ? "Add Mentee" : "Update"}
                                </Button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminForm