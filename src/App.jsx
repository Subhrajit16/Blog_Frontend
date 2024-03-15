import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  
  return (
    <>


      <table className="table">
        <thead>
          <tr>
            <th className='text-center'>#</th>
            <th className='text-center'>Name</th>
            <th className='text-center'>Email</th>
            <th className='text-center'>Password</th>
            <th className='text-center'>Status</th>
            <th className=''>Action</th>
          </tr>
        </thead>
        <tbody>

          {data.map((item, index) => (
            <tr className='my-2' key={index}>
              <td className='text-center'>{index + 1}</td>
              <td className='text-center'>{item.name}</td>
              <td className='text-center'>{item.email}</td>
              <td className='text-center'>{item.password}</td>
              <td className='text-center'>
                <button onClick={()=>toggleStatus(item._id)} className={`btn btn-sm ${item.isActive ? 'btn-success' : 'btn-danger'}`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <button className='btn btn-sm btn-danger text-center m-1' disabled={isDeleing} onClick={()=>handleDelete(item._id)}>Delete</button>
              <Link to={`/edit/${item._id}`}>Edit</Link>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Link className='text-white btn btn-primary m-3' to='/create'>Create User</Link> */}
      <ToastContainer />
    </>
  )
}

export default App

