import React, { forwardRef, useId } from 'react'

function Select({
    options,
    label,
    className,
    ...props
},ref) {
    const id= useId();
    return (
        <div>
            {
                label &&(
                    label && <label className='text-black' htmlFor={id}>{label}</label>
                )
            }
        <select
        ref={ref}
        id={id}
        className={`${className} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full`}
        {...props}>            {
                options?.map((option)=>(
                    <option key={option.id} value={option.id}>{option.full_name}</option>
                ))
            }
        </select>
        </div>
    )
}

export default forwardRef(Select) 