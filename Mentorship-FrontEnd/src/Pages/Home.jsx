import React, { useEffect, useRef } from 'react';
import '../Pages/Style/home.css'
import {easeInOut, motion} from 'motion/react'
import logo from'../Images/students.png'
import students from '../Videos/students.mp4'

const sentence = "Welcome to the Mentorship Portal...";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // <-- Delay between letters
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: `0.25em` },
  visible: {
    opacity: 1,
    y: `0em`,
    transition: {
      duration: 0.5,
    },
  },
};

export default function BackgroundChanger() {
 

  return (
    <div className=' w-full'>
      <video autoPlay  muted  src={students} poster={logo} className=' w-[100vw] h-[100vh] object-cover fixed left-0 right-0 top-0 bottom-0 -z-10 ' >
        <source src={students} type='video/mp4' />
      </video>
      <div className=' bg-cyan-400/14 flex items-center justify-center h-screen'>
      <motion.h1
      className="text-6xl font-bold  font-mono text-center text-white/40 "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
    >
      {sentence.split("").map((char, index) => (
        <motion.span
          key={index}
          className=''
          variants={letterVariants}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>          
      </div>
    </div>
  );
}
