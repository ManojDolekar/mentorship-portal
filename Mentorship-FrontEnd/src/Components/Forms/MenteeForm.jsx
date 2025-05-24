import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
// import {Input,Button,Logo} from '../index'
import Input from '../ReComponents/Input'
import Button from '../ReComponents/Button'
import Logo from '../Logo'

function MenteeForm({user,id}) {

    const{register,handleSubmit,setValue,watch}=useForm({
                                        defaultValues:{
                                            university_number:user?.university_number || "",
                                            username:user?.username || "",
                                            full_name:user?.full_name || "",
                                            contact_number:user?.contact_number || "",
                                            email:user?.email || "",
                                            password: "",
                                            address:user?.address || "",
                                            mentor_id:id
                                        }
    })
    const navigate=useNavigate();
    useEffect(()=>{
        if(user?.id ){
            setValue('id',user.id);
        }
    },[user,setValue,])

    const submit= async (data)=>{
        try {
            console.log(data);
            
            if(user){
                const formData=new FormData()
                formData.append("id",user?.id);
                formData.append("file_path",data.file_path[0]);
                formData.append("university_number",data.university_number);
                formData.append("username",data.username);
                formData.append("full_name",data.full_name);
                formData.append("contact_number",data.contact_number);
                formData.append("email",data.email);
                formData.append("address",data.address);
                formData.append("password",data.password);

                // const formdata={...data,id:user.id}
                const response=await axios.put('http://localhost:8000/api/mentee',formData,{
                    headers:{ 'Content-Type': 'multipart/form-data',},
                });
                if(response.status===200 || response.status===204){
                    
                    console.log("Mentee Updated Successfully")
                    navigate(`/mentee-profile/${user.id}`)
                }
            }
            else{
                    const response=await axios.post('http://localhost:8000/api/mentee',data);
                    if(response.status===200 || response.status===201){
                        console.log("Mentees account created Successfully")
                        navigate(`/all-mentees`)
                    }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const usernameTransform = useCallback((value)=>{
            if(value && typeof value === "string"){
                return value.
                trim().
                toLowerCase().
                replace(/\s/g,'-')
            }
    },[])

    useEffect(() => {
        const subscription = watch((value,{name})=>{
            if(name==="full_name"){
                setValue('username',usernameTransform(value.full_name))
            }
        })
    
        return () => {
            subscription.unsubscribe();         // for optimization
        }
    }, [ setValue , watch , usernameTransform])
    

    return (
        <div className=' w-full flex items-center justify-center m-auto h-screen duration-200 transition-all bg-gradient-to-r from-[#ffd89b] to-[#19547b]'>
            <div className=' w-full max-w-4xl flex flex-col items-center p-6 border-2 border-white/20 shadow-2xl rounded-2xl '>
            {
                    !user ? (
                    <div>
                        {/* <span className=' items-center flex mx-auto mb-2'><Logo/></span> */}
                        <h1 className='text-gray-700 text-2xl font-bold my-6'>Adding new mentee</h1>
                    </div>
                    ):(
                        <div>
                            {/* <span className=' items-center flex mx-auto mb-2'><Logo/></span> */}
                            <h1 className='text-gray-700 text-2xl font-bold my-6'>Update your profile</h1>
                        </div>
                    )
                }
                <div className=' w-full'>
                    <form
                    className=' mt-2'
                    onSubmit={handleSubmit(submit)}>
                        <div className=' w-full gap-4 grid sm:grid-cols-2  '>
                            <Input
                            label='Full name :'
                            type='text'
                            placeholder='Full Name'
                            {
                                ...register("full_name",{
                                    required:true,
                                })
                            }
                            />
                            <Input
                            label='username :'
                            type='text'
                            placeholder='username'
                            {
                                ...register('username',{ required:true})
                            }
                            onInput={(e)=>setValue('username',usernameTransform(e.currentTarget.value),{
                                shouldValidate:true,
                            }
                            )}
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
                            label='University Number :'
                            type='text'
                            placeholder='University Number'
                            {
                                ...register("university_number",{
                                    required:true,
                                })
                            }
                            />
                            <Input
                            label='Contact Number :'
                            type='number'
                            placeholder='Contact Number'
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
                            placeholder='Email'
                            {
                                ...register("email",{
                                    required:true,
                                    validate:{
                                        matchPattern:(value)=>/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value) || "Enter a valid email address"
                                    }
                                })
                            }
                            />
                            {
                                id &&(
                                    <Input 
                                    className='hidden'
                                    value={id}
                                    type='text'
                                    {
                                        ...register('mentor_id',{
                                            required:true,
                                            value:id,
                                        })
                                    }
                                    />
                                )
                            }
                            <Input
                            label='Address :'
                            type='text'
                            placeholder='Address'
                            {
                                ...register("address",{
                                    required:true,
                                })
                            }
                            />
                            <Input
                            label='Password :'
                            type='password'
                            placeholder='Password'
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
                                name={ !user ? "Add Mentee" : "Update"}
                                className={`${!user ? `bg-blue-600` : `bg-green-600`} w-40`}
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

export default MenteeForm