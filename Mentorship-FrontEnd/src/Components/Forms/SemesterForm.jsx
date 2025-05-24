import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// import {Input,Button,Logo} from '../index'
import Input from '../ReComponents/Input'
import Button from '../ReComponents/Button'
import Logo from '../Logo'
import { useForm } from 'react-hook-form'
import FormReport from '../ReComponents/FormReport'


function SemesterForm() {

  const navigate=useNavigate();
  const {register,handleSubmit,setValue,watch ,reset , formState:{errors}}=useForm();
  const[error, setError]=useState('');
  const [uploadProgress , setUploadProgress]=useState(0)
  const [status , setStatus]=useState("idel")

  const submit=async(data)=>{
    setError("")
    try {
      const formdata=new FormData();
      formdata.append('mentee_id',data.mentee_id)
      formdata.append('semester',data.semester)
      formdata.append("result_file",data.result_file[0])
      formdata.append("cgpa",data.cgpa)
      formdata.append("sgpa",data.sgpa)
      formdata.append("backlogs",data.backlogs)
      formdata.append("results",data.results)
      formdata.append("clearing_date",data.clearing_date)
      
      setStatus("uploading")
      const response=await axios.post('http://localhost:8000/api/semester-results',formdata,{
        headers:{ 'Content-Type': 'multipart/form-data',},
        onUploadProgress:(ProgressEvent)=>{
          const progress = ProgressEvent.total ? 
          Math.round((ProgressEvent.loaded *100)/ProgressEvent.total)
          : 0
          setUploadProgress(progress)
        }
      })
      if(response.status===200 || response.status===201){
        console.log('Result created successfully..');
        setStatus("success")
        reset();
      }
      else throw error
    } catch (error) {
      setError(error)
      console.error(error);
      setStatus(error)
    }
  }

  const resultDecision=useCallback((value)=>{
          if(value && typeof value=== "string"){
            return value==="0" ? "Pass" :"Fail";
          }
          return ""
  },[])

  useEffect(()=>{
    const subscription=watch((value,{name})=>{
      if(name==="backlogs"){
        setValue('results',resultDecision(value.backlogs))
      }

    })
    return ()=>{
      subscription.unsubscribe()
    }
  },[])

  
  
  return (
    <div
    className=' flex items-center justify-center bg-gradient-to-r from-[#ffd89b] to-[#19547b] w-full '
    >
        <div
        className={`mx-auto w-full shadow-2xl max-w-xl bg-white/20   rounded-xl p-6 border border-black/10`}
        >
            <div
            className='mb-2 flex justify-center '>
                <span className=' inline-block w-full max-w-[100px]'>
                    <Logo  width='100%'/>
                </span>
            </div>
            <h2 className=' text-center text-2xl font-bold text-gray-700 leading-tight'>
                Declaring Semester result</h2>

            {error && <p className=' text-red-600 mt-8'>{error?.response?.data?.message}</p>}
            <form onSubmit={handleSubmit(submit)}
            className='mt-8'>
                <div className=' space-y-5'>
                    <Input 
                    label="Semester :"
                    error={errors.semester && "Semester is required"}
                    type="text"
                    { ...register("semester",{
                        required:true,
                    })}
                    />

                    <Input
                    label="Mentee Id :"
                    error={errors.mentee_id && "Mentee Id is required"}
                    type="text"
                    {
                        ...register("mentee_id",{
                            required:true,
                        })
                    }
                    />
                    <Input
                    label="CGPA :"
                    error={errors.cgpa && "CGPA is required"}
                    type="text"
                    {
                        ...register("cgpa",{
                            required:true,
                        })
                    }
                    />
                    <Input
                    label="SGPA :"
                    error={errors.sgpa && "SGPA is required"}
                    type="text"
                    {
                        ...register("sgpa",{
                            required:true,
                        })
                    }
                    />
                    <Input
                    label="Backlogs :"
                    error={errors.backlogs && "if backlogs fill value otherwise fill 0 ...."}
                    type="text"
                    {
                        ...register("backlogs",{
                            required:true,
                        })
                    }
                    />
                    <Input
                    label='Clearing Date'
                    error={errors.clearing_date && "Date is required"}
                    type="date"
                    className=""
                    {
                        ...register("clearing_date",{
                            required:true,
                        })
                    }
                    />
                    <Input
                    label="Result :"
                    type="text"
                    {
                        ...register("results",{
                            required:true,
                        })
                    }
                    onInput={(e)=>setValue('results',resultDecision(e.currentTarget.value),{ shouldValidate:true})}
                    />
                    <Input
                    label="Result file :"
                    type="file"
                    error={errors.result_file && "Result file is required "}
                    className=' file:bg-blue-200 hover:file:bg-blue-300  file:px-4 file:rounded-lg ring-transparent file:text-blue-600 file:m-4 file:text-sm file:py-1 file:font-semibold text-sm bg-transparent '
                    accept='Image/png,Image/jped,Image/jpg,Image/gif,Image/heic'
                    {
                        ...register("result_file",{
                            required:true,
                        })
                    }
                    />
                    {status==="uploading" &&
                      (
                        <div>
                          <div className=' flex flex-wrap h-2 bg-gray-200  rounded-2xl'>
                            <div 
                              style={{width:uploadProgress}}
                                className=' w-full bg-blue-500 h-1.5 rounded-2xl duration-300 transition-all '>

                            </div>
                          </div>
                          <p>{uploadProgress} % uploaded</p>
                        </div>
                      )
                    }
                    <div className=' items-center flex'>
                    <Button 
                    type='submit'
                    name='Submit'
                    className='mx-auto  w-1/2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl  '
                    >
                      Submit
                    </Button>
                    </div>
                    
                </div>
            </form>

        </div>
        
    </div>
  )
}

export default SemesterForm

