import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import {store , persistor} from './Store/store.js'
import { PersistGate } from 'redux-persist/lib/integration/react';
import Layout from './Components/Layout/Layout.jsx'
// import {ActivitiesApproval, AdminProfile, AdminProfilePage, AllMentors, CreateAdmin, Home,LoginPage} from './Pages'
import AuthLayout from './Components/AuthLayout.jsx'
import LoginPage from './Pages/Login.jsx'
import Home from './Pages/Home.jsx'
import AllMentees from './Pages/AllMentees.jsx'
import AllMentors from './Pages/AllMentors.jsx'
import CreateAdmin from './Pages/CreateAdmin.jsx'
import CreateMentor from './Pages/CreateMentor.jsx'
import MentorProfilePage from './Pages/MentorProfilePage.jsx'
import DeclareResult from './Pages/DeclareResult.jsx'
import MenteeForm from './Components/Forms/MenteeForm.jsx'
import CreateMentee from './Pages/CreateMentee.jsx'
import SemesterResult from './Components/SemesterResult.jsx'
import UserDetails from './Components/UserDetails.jsx'
import ActivityBox from './Components/ActivityBox.jsx'
import ActivityForm from './Components/Forms/ActivityForm.jsx'
import AdminForm from './Components/Forms/AdminForm.jsx'
import MenteeProfilePage from './Pages/MenteeProfilePage.jsx'
import UpdateMenteeProfile from './Pages/UpdateMenteeProfile.jsx'
import UpdateMentorProfilr from './Pages/UpdateMentorProfilr.jsx'
import AllMenteeDetails from'./Pages/AllMenteeDetails.jsx'
import AdminProfile from './Components/Profile/AdminProfile.jsx'
import UpdateAdminProfilr from './Pages/UpdateAdminProfilr.jsx'
import MentorMentees from './Pages/MentorMentees.jsx'
import LoadingOverlay from './Components/Animations/LoadingOverlay.jsx'

const router=createBrowserRouter([
      {
        path:'/',
        element:<Layout/>,
        children:[
          {
            path:'/',
            element:(
            <AuthLayout>
              {" "}
              <Home/>
            </AuthLayout>
            )
          },
          {
            path:'/login',
            element:(
              <AuthLayout authentication={false}>
                <LoginPage/>
              </AuthLayout>
            )
          },
          {
            path:'/admin-profile',
            element:(
              <AuthLayout authentication>
                {' '}
                <AdminProfile/>
              </AuthLayout>
            )
          }, 
          {
            path:'/update-admin-profile',
            element:(
              <AuthLayout authentication>
                {' '}
                <UpdateAdminProfilr/>
              </AuthLayout>
            )
          }, 
          {
            path:'/mentor-mentees/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <MentorMentees/>
              </AuthLayout>
            )
          }, 
          {
            path:'/mentee-details',
            element:(
              <AuthLayout authentication>
                {' '}
                <AllMenteeDetails/>
              </AuthLayout>
            )
          }, 
          {
            path:'/activities/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <ActivityBox/>
              </AuthLayout>
            )
          }, 
          {
            path:'/all-mentees',
            element:(
              <AuthLayout authentication>
                {' '}
                <AllMentees/>
              </AuthLayout>
            )
          }, 
          {
            path:'/all-mentors',
            element:(
              <AuthLayout authentication>
                {' '}
                <AllMentors/>
              </AuthLayout>
            )
          }, 
          {
            path:'/create-admin',
            element:(
              <AuthLayout authentication>
                {' '}
                <CreateAdmin/>
              </AuthLayout>
            )
          },
          {
            path:'/create-mentor',
            element:(
              <AuthLayout authentication>
                {' '}
                <CreateMentor/>
              </AuthLayout>
            )
          },
          {
            path:'/mentor-profile',
            element:(
              <AuthLayout authentication>
                {' '}
                <MentorProfilePage/>
              </AuthLayout>
            )
          },
          {
            path:'/declare-result',
            element:(
              <AuthLayout authentication>
                {' '}
                <DeclareResult/>
              </AuthLayout>
            )
          },
          {
            path:'/update_mentor-profile/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <UpdateMentorProfilr/>
              </AuthLayout>
            )
          },
          {
            path:'/create-mentee',
            element:(
              <AuthLayout authentication>
                {' '}
                <CreateMentee/>
              </AuthLayout>
            )
          },
          {
            path:'/semister-result/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <SemesterResult/>
              </AuthLayout>
            )
          },
          {
            path:'/userdetails/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <UserDetails/>
              </AuthLayout>
            )
          },
          {
            path:'/activities/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <ActivityBox/>
              </AuthLayout>
            )
          },
          {
            path:'/new-activity/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <ActivityForm/>
              </AuthLayout>
            )
          },
          {
            path:'/semester-result/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <SemesterResult/>
              </AuthLayout>
            )
          },
          {
            path:'/mentee-profile/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <MenteeProfilePage/>
              </AuthLayout>
            )
          },
          {
            path:'/update-mentee-profile/:id',
            element:(
              <AuthLayout authentication>
                {' '}
                <UpdateMenteeProfile/>
              </AuthLayout>
            )
          },
          {
            path:'/create-admin',
            element:(
              <AuthLayout authentication={true}>
                {' '}
                <AdminForm/>
              </AuthLayout>
            )
          },

        ],
      },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingOverlay/>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
