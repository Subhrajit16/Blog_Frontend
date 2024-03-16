import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CreateUser from './CreateUser.jsx'
import EditUser from './Edituser.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Blog from './Blog/Blog.jsx'
import Layout from './Layout.jsx'
import EditProfile from './EditProfile.jsx'
import BlogDetails from './Pages/BlogDetails.jsx'
import AvatarUpdate from './Pages/AvatarUpdate.jsx'
import UserProfile from './Pages/UserProfile.jsx'
import ForgotPassword from './Pages/ForgotPassword.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
import AllUsers from './Pages/AllUsers.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<CreateUser />} />
      <Route path='/avatar' element={<AvatarUpdate />} />
      <Route path='/blogs' element={<Blog />} />
      <Route path='/blog/:id' element={<BlogDetails />} />
      <Route path='/user/:id' element={<UserProfile />} />
      <Route path='/profile' element={<Home />} />
      <Route path="/editprofile/:id" element={<EditProfile />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot_password' element={<ForgotPassword />} />
      <Route path='/reset_password/:uid/:token' element={<ResetPassword />} />
      <Route path='/allusers' element={<AllUsers />} />
    </Routes>
  </BrowserRouter>
)
