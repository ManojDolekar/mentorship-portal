// import React, { useState } from 'react'
// import {useForm} from 'react-hook-form'
// import {useNavigate,Link} from 'react-router-dom'
// import axios from 'axios'
// import {useDispatch} from 'react-redux'
// import { login as authLogin } from '../Store/authSlice'
// // import {Input,Button,Logo} from './'
// // import {Input,Button,Logo} from './index.js'
// import Input from './ReComponents/Input'
// import Button from './ReComponents/Button.jsx'
// import Logo from './Logo.jsx'

// function Login() {
//     const [error,setError]=useState("")
//     const {register,handleSubmit}=useForm();
//     const navigate=useNavigate();
//     const dispatch=useDispatch();


//     const login=async(formdata)=>{
//         setError("")
//         try {     
//             const response=await axios.post('http://localhost:8000/api/auth/login',formdata)
//             if(response.status===200 || response.status===201){
//                 dispatch(authLogin(response?.data?.result?.user))
//                 navigate('/')
//                 console.log(response?.data?.message);
//             }else{
//                 navigate('/login')
//             }
//             // throw response
//         } catch (error) {
//             setError(error);
//             console.error(error)
//         }
//     }

//   return (
//     <div className='flex items-center w-full justify-center'>
//         <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
//         <div className='flex mb-2 justify-center'>
//             <span className=' inline-block max-w-[100px] w-full'>
//                 <Logo width="100%"/>
//             </span>
//         </div>
//         <h2 className=' text-center text-2xl font-bold text-gray-700 leading-tight'>
//                 Sign in to your account</h2>
//             <p className='mt-2 text-center text-base text-black/60'>
//                 Don&apos;t have any account?&nbsp;
//                 <Link
//                     to="/signup"
//                     className='font-medium text-primary transition-all duration-200 hover:underline'
//                 >
//                 Sign Up
//                 </Link>
//             </p>
//             {error && <p className=' text-red-600 mt-8'
//             >{error}</p>}
            
//             <form onSubmit={handleSubmit(login)}
//             className='mt-8'
//             >
//                 <div className=' space-y-5'>
//                     <Input
//                     label="Email :"
//                     type="email"
//                     placeholder="Enter Your email"
//                     {
//                         ...register("email",{ 
//                             required:true ,
//                             validate:{ matchPattern:(value)=>  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value) || "Email address must be a valid address"}})
//                     }
//                     />
//                     <Input
//                     label="Password :"
//                     type="password"
//                     placeholder="Enter your password"
//                     {
//                         ...register("password",{
//                             required:true
//                         })
//                     }
//                     />
//                 </div>
//                 <div className=' flex items-center'>
//                     <Button
//                     type={'submit'}
//                     className='mx-auto w-1/4 rounded-4xl'
//                     name='Login'
//                     >
//                         Login
//                     </Button>
//                 </div>

//             </form>
//         </div>
//     </div>
//   )
// }

// export default Login

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../Store/authSlice';
import Input from './ReComponents/Input';
import Button from './ReComponents/Button.jsx';
import Logo from './Logo.jsx';
import AdminForm from './Forms/AdminForm.jsx';

function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async (formdata) => {
        setError('');
        setLoading(true);
        console.log(formdata);
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', formdata);
            if (response.status === 200 || response.status === 201) {
                dispatch(authLogin(response?.data?.result?.user));
                navigate('/');
                console.log(response?.data?.message);
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen w-full bg-gradient-to-r from-[#ffd89b] to-[#19547b]'>
            <div className='m-auto items-center justify-center shadow-2xl w-full n max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
                <div className='flex mb-2 justify-center'>
                    <span className='inline-block max-w-[100px] w-full'>
                        <Logo width="100%" />
                    </span>
                </div>

                <h2 className='text-center text-2xl font-bold text-gray-700 leading-tight'>
                    Sign in to your account
                </h2>

                {/* <p className='mt-2 text-center text-base text-black/60'>
                    Don&apos;t have any account?&nbsp;
                    <Link to="/signup" className='font-medium text-primary transition-all duration-200 hover:underline'>
                        Sign Up
                    </Link>
                </p> */}

                {error && <p className='text-red-600 mt-6 text-center'>{error}</p>}

                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5 flex items-center flex-col'>
                        <Input
                            label="Email :"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email format',
                                },
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm -mt-4">{errors.email.message}</p>}

                        <Input
                            label="Password :"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                        />
                        {errors.password && <p className="text-red-500 text-sm -mt-4">{errors.password.message}</p>}
                    </div>

                    <div className='flex items-center mt-6'>
                        <Button
                            type="submit"
                            name={loading ? 'Logging in...' : 'Login'}
                            className='focus:scale-95 hover:bg-amber-600 mx-auto text-white w-1/4 rounded-3xl'
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
;
