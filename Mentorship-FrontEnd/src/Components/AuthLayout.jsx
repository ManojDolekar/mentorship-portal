import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AuthLayout({authentication=true , children}) {
    const [loading,setLoading]=useState(true);
    const authStatus=useSelector(state=>state.auth.status);
    const navigate =useNavigate();

    useEffect(()=>{
        if(authentication && authStatus !== authentication){
            navigate('/login')
        }else if(!authentication && authStatus !== authentication){
            navigate('/')
        }
        setLoading(false)
    },[navigate,authStatus,loading])

  return loading ? <p>...Loading</p> : <>{children}</>
}

export default AuthLayout