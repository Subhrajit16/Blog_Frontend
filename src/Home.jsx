import React, { useEffect, useState } from 'react';
// import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Header from './Component/Header';
function Home() {
    const token = localStorage.getItem('token');
    const UId = localStorage.getItem('Uid');
    const [data, setData] = useState({});
    const { register, handleSubmit, reset } = useForm()
    const [idForVerification, setIdForVerification] = useState('')
    const navigate = useNavigate()
    const userId = localStorage.getItem('Uid')
    async function fetchData() {
        try {
            const resp = await axios.get('my-social-api.vercel.app/user/' + userId, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(resp.data)
            setData(resp.data)
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])


    



    async function onSubmit(data) {
        // console.log(data)
        try {
            const resp = await axios.post(`my-social-api.vercel.app/user/verify/${idForVerification}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (resp.status === 200) {
                navigate(`/editprofile/${idForVerification}`)
            }
        } catch (error) {
            toast.error(error.response.data)
        } finally {
            // setIdForVerification('')
            reset()
        }
    }
//My blogs
    const [myBlogs, setMyBlogs] = useState([])
    async function getBlogs() {
        try {
            const resp = await axios.get(`my-social-api.vercel.app/blog/myblogs/${UId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            })
            console.log(resp.data)
            setMyBlogs(resp.data)
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    useEffect(() => {
        getBlogs()
    }, [])

    return (
        <div>
            <Header />


            <div >
               <h4 className='text-center'>USER DETAILS</h4>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th className='text-center'>Name</th>
                        <th className='text-center'>Email</th>
                        <th className='text-center'>Status</th>
                        <th className=''>Action</th>
                    </tr>
                </thead>
                <tbody>

                    <tr className='my-2' >
                        <td className='text-center'>{data.name}</td>
                        <td className='text-center'>{data.email}</td>
                        <td className='text-center'>
                            <button  disabled={true} className={`btn btn-sm ${UId === data.userId ? 'btn-success' : 'btn-danger'}`}>
                                {UId === data.userId ? 'Active' : 'Inactive'}
                            </button>
                        </td>
                        {/* <button className='btn btn-sm btn-danger text-center m-1'  onClick={() => handleDelete(data._id)}>Delete</button> */}
                        <button className='btn btn-sm btn-secondary' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setIdForVerification(data.userId)} >Edit</button>
                    </tr>
                </tbody>
            </table>

            <hr />

            <h2 className='text-center'>My Blogs</h2>

            <div className="row row-cols-1 row-cols-md-4 g-4 mt-4">
                {
                    myBlogs.map((blog, index) => {
                        return (
                            <div className="col d-flex justify-content-center px-3" key={index}>

                                <div className="card" style={{ width: "20rem" }}>
                                    <img src={`${blog.images[0]}`} className="card-img-top img-fluid" style={{ width: '100%', height: '200px', objectFit: 'contain' }} alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">{blog.title}</h5>
                                        {/* <p className="card-text">
                                            {blog.description}
                                        </p> */}
                                    </div>
                                    <div className=" card-body d-flex justify-content-around">
                                        <Link to={`/blog/${blog._id}`} className="card-link">Read Full Article</Link>
                                        <button className='btn btn-sm btn-outline-primary'>edit </button>
                                    </div>
                                </div>
                            </div>

                        )
                    })
                }
            </div>



            {/* Modal */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className="modal fade"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex={-1}
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                    Enter your password to edit
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <input type="password" {...register('password')} placeholder='password' className="form-control" />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button type="submit" data-bs-dismiss="modal" className="btn btn-primary" >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>



            <ToastContainer />
        </div>
    );
}

export default Home;
