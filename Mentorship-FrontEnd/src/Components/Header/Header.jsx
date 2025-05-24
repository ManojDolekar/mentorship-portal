import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {useNavigate, Link,useLocation } from 'react-router-dom'
import Button from '../ReComponents/Button'
import Logo from '../Logo'
import { logout } from '../../Store/authSlice'
import {motion,LayoutGroup} from'motion/react';
import admin from '../../Images/admin.jpg'

function Header() {
    const [user,setUser]=useState(null);
    const navigate=useNavigate();
    const locatiion=useLocation();    // use for motion animaion
    const dispatch=useDispatch();
    const {userData ,adminStatus , mentorStatus,menteeStatus}=useSelector(state=>state.auth);

    //fetching the file 'image ' 
    const baseUrl='http://localhost:8000/';

    //getting the current userdata form store
    useEffect(()=>{
        if(userData !==null){ 
            setUser(userData)   // i got the error here is to many re-rendering beacause i used  'userData !== null && setUser(userData)' it gives me error beacaus this line not have any break whene userData is not null it will be continue try to setUser , thats why next time i used useEffect and i give the condition
        }
    },[userData])

    const navItems=[
        {role:adminStatus,path:'/admin-profile',name:'Profile'},
        {role:adminStatus, path:'/all-mentors', name:'Mentor Details'},
        {role:adminStatus, path:'/mentee-details',name:'Mentee Details'},
        {role:mentorStatus,path:'/mentor-profile',name:'Profile'},
        {role:mentorStatus,path:'/all-mentees',name:'Mentee Details'},
        {role:mentorStatus,path:'/declare-result',name:'Declare Result'},
        {role:menteeStatus,path:`/mentee-profile/${user !== null && user.id}`,name:'Profile'},
        {role:menteeStatus,path:`/semester-result/${user !== null && user.id}`,name:'Semester Result'},
        {role:menteeStatus,path:`/activities/${user !== null && user.id}`,name:'Activities'},
    ]

    const authlogout=()=>{
        dispatch(logout());
        navigate('/login')
    }

  return (
    user!==null &&
        <aside className={`${userData===null ? 'hidden' : ""} w-[240px] h-screen p-4 items-center flex  flex-col bg-gradient-to-tr from-[#5efce8] to-[#736efe] `}>
            <Link to='/' className='my-4'>
                <Logo className="w-30 h-30"/>
            </Link>
            <div className='my-4'>
                <div className=' w-24 h-24 rounded-full overflow-hidden shadow border-4 border-white '>
                    {console.log(user)
                    }
                    <img src={adminStatus ? admin : baseUrl+user.file_path} alt="Profile" className=' object-cover  ' />
                </div>
                <p className=' text-center text-white font-semibold mt-2'>{user.full_name}</p>
            </div>
            <nav className=' w-full flex-1'>
                <LayoutGroup>
                <ul className='flex flex-col gap-2'>
                    {
                        user && (
                            navItems.map((item)=>(
                                item.role ? (
                                    <Link key={item.name} to={item.path} className='relative block' >
                                        <li className={`${locatiion.pathname===item.path ? " text-white ":" text-white/70 hover:text-white"} transition-colors font-bold duration-100 px-4 py-2`}>
                                        {locatiion.pathname===item.path && (
                                        <motion.div
                                        layoutId='activeNav'
                                        className=' absolute z-0 inset-0 bg-white/30 rounded-xl'
                                        transition={{type:"spring", stiffness:"500",damping:"30"}}
                                        /> )}
                                            <span className='relative z-10'>{item.name}</span>
                                        </li>

                                    {/* <li className=' bg-white/20 rounded-lg transition hover:bg-white/30 text-white font-bold duration-100 px-4 py-2'>{item.name}</li> */}
                                    </Link>
                                ):null
                            ))
                        )
                    }
                </ul>
                </LayoutGroup>
            </nav>
                <Button
                type='button'
                onClick={authlogout}
                className='bg-red-500 hover:bg-red-600 text-white w-full transition rounded-xl mt-4'
                >
                    Logout
                </Button>
        </aside>
    )
}

export default Header




