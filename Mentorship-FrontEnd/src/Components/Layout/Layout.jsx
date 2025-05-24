import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { login, logout } from '../../Store/authSlice'
import '../../Pages/Style/Layout.css'


function Layout() {
    const [loading,setLoading]=useState(true)
    const dispatch= useDispatch();
    const userData= useSelector(state=>state.auth.userData);

    useEffect(()=>{
        if(userData){
            dispatch(login(userData))
        }
        else{
            dispatch(logout())
        }
        setLoading(false)
    },[])


  return (
    !loading ?(

        <div className=' flex h-screen overflow-hidden '>
            <div className='  h-full top-0 left-0 z-10'>
                <Header/>
            </div>
            <main className='flex-grow flex overflow-auto  h-screen '>
                <Outlet/>
            </main>
        </div>

    // <div className='min-h-screen block '>
    //     <div className=' flex flex-row  w-full'>
    //         {/* <div className=' w-full fixed'> */}
    //             <Header />
    //         {/* </div> */}
    //     <main className='flex-grow  p-4 w-9/12'>
    //         <Outlet/>
    //     </main>
    //     </div>
    // </div>
    ) : null
  )
}

export default Layout

