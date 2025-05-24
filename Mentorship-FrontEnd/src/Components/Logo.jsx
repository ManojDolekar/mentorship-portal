import React from 'react'
import logo from '../Images/logo.png'

function Logo({width ,className}) {
  return (
    <div
    className={`w-30 ${className}`}
    width={width}
    >
      <img src={logo} alt="Logo" />
    </div>
  )
}

export default Logo