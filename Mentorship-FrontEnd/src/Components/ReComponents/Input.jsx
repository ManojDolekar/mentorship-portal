import React, { useId, useState } from 'react';
import { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';


const Input = forwardRef(function Input({
    label,
    icon,
    error,
    type = "text",
    className = "",
    ...props
    }, ref) {
    const id = useId();
    const [showpassword , setShowpassword]=useState(false);
    const isPasswordType=type==="password";

    const inputType=isPasswordType ? (showpassword ? "text" : "password") : type

    return (
        <div className="relative w-full group">
        <input
        id={id}
        type={inputType}
        placeholder=" " 
        className={`
            peer 
            pb-2 pt-6 
            border-gray-300 
            focus:outline-none 
            focus:ring-2 
            focus:ring-amber-400 
            bg-white/50 
            ring-2 ring-gray-300 
            w-full px-4 text-black rounded-xl 
            ${className}
            `}
            {...props}
            ref={ref}
        />

        {label && (
            <label
            htmlFor={id}
            className={`
            absolute 
            left-4 
            text-gray-500 
            transition-all duration-200 
            peer-placeholder-shown:top-4 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-500 
            peer-focus:top-2 
            peer-focus:left-2 
            peer-focus:text-sm 
            peer-focus:text-amber-500
            `}
            >
            {label}
            </label>
        )}
        {
            isPasswordType &&(
                <button
                type='button'
                onClick={()=>setShowpassword((prev)=>!prev)}
                className='absolute right-4 top-5 text-gray-500'
                >
                {showpassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
            )
        }
        {icon && (
            <span className="absolute left-4 top-4 peer-focus:hidden peer-placeholder-shown:block">
            {icon}
            </span>
        )}

        {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        </div>
    );
});

export default Input;
