import React from 'react'

function Button({
    type="" ||"submit",
    bgColor="" || " bg-blue-600",
    className,
    name,
    ...props
}) {
  return (
    <button
    className= {`py-2 px-4 rounded-2xl duration-200 hover:shadow-gray-500 hover:shadow-lg hover:scale-101 focus:scale-98 ${className} ${bgColor}`}
    type={type}
    {...props}
    >

    </button>
)
}

export default Button