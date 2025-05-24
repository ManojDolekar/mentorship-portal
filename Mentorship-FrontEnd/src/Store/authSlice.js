import { createSlice } from "@reduxjs/toolkit";

const initialState={
    status:false,
    adminStatus:false,
    mentorStatus:false,
    menteeStatus:false,
    userData:null
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.userData=action.payload;
            const {role}=action.payload;
            if(role) state.status=true

            if(role==="admin"){
                state.adminStatus=true
            }else if(role==="mentor"){
                state.mentorStatus=true
            }else if(role==="mentee"){
                state.menteeStatus=true
            } 

        },
        logout:(state)=>{
            state.status=false
            state.adminStatus=false
            state.mentorStatus=false
            state.menteeStatus=false
            state.userData=null
        }
    }
})

export const{login,logout}=authSlice.actions;
export default authSlice.reducer