import React, { useEffect, useState } from 'react'
import Header from '../Component/Header'
import axios from 'axios'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
function AllUsers() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    
    async function fetchAllUsers() {
        try {
            setIsLoading(true)
            const resp = await axios.get('https://blog-backend-1-5cm6.onrender.com/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setUsers(resp.data)
            // console.log(resp.data)

        } catch (error) {
            toast.error('Error while fetching all users')
        } finally {
            setIsLoading(false)
        }
        // console.log(resp.data)
    }
    useEffect(() => {
        fetchAllUsers()
    }, [])

    return (
        <>

            <Header />
            <div >
                <h3 className='text-center my-2'>All Users</h3>
            </div>

            <Backdrop
                sx={{ color: '#FFF', fontSize: '100px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress size={80} color="inherit" />
            </Backdrop>
            <div className="container">

                <div className='table-responsive table-hover'>
                    <table className="table ">
                        <thead>
                            <tr>
                                {/* <th className='text-center'>Avatar</th> */}
                                <th className='text-center'></th>
                                <th className='text-center'>Name</th>
                                <th className='text-center'>Bio</th>
                                <th className='text-center'>Education</th>
                                <th className='text-center'>Address</th>

                            </tr>
                        </thead>
                        <tbody>

                            {users && users.map((data, index) => (
                                <tr key={index} className='my-2' >
                                    {/* <td className='text-center'>{data.avatar}</td> */}

                                    { data.avatar ? <td className='text-center'>  <img style={{ height: '40px', aspectRatio: '1/1', borderRadius: '50%', objectFit: 'cover' }} src={data?.avatar} /></td> : <i style={{ fontSize: '30px' }} class="fa-solid fa-user fa-xl mt-2 ps-4"></i>}
                                    <td className='text-center'>  <Link to={`/user/${data.userId}`} className='p-3 mb-0'>{data.name}</Link> </td>
                                    <td className='text-center'>{data?.bio}</td>
                                    <td className='text-center'>{data?.education}</td>
                                    <td className='text-center'>{data?.address}</td>

                                </tr>

                            ))}


                        </tbody>
                    </table>

                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default AllUsers