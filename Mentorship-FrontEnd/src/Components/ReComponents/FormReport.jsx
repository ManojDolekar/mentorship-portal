import React from 'react'

function FormReport({response}) {
  return (
    <div className=' p-2 bg-gray-400 rounded-2xl w-1/3 justify-center flex items-center duration-100 '> 
        <div className={response.status===200 || response.status===201 ? 'text-green-500':"text-red-500"` text-lg`} >
            {
                response?.data?.message
            }
        </div>
    </div>
  )
}

export default FormReport