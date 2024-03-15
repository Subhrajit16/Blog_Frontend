import axios from 'axios';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function EditUser() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    async function getData() {
        try {
            const resp = await axios.get(`http://localhost:8080/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            reset(resp.data)
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    useEffect(() => {
        getData()
    }, [id])

    async function onSubmit(data) {
        console.log(data)
        try {
            const resp = await axios.patch(`http://localhost:8080/user/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(resp.data)
            toast.success('User Updated');
            setIsSubmitted(true)
            setTimeout(() => {
                navigate('/home')
            }, 2000)

        } catch (error) {

            toast.error(error.response.data);
        }

    }
    return (
        <div>
            <h1>Edit User</h1>
            <Link className=' m-3' to='/home'>Back</Link>
            <form className='p-3' onSubmit={handleSubmit(onSubmit)} >
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Name</label>
                    <input type="text" {...register('name')} className="form-control w-25" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" {...register('email')} className="form-control w-25" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                {/* <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" {...register('password')} className="form-control w-25" id="exampleInputPassword1" />
                </div> */}
                <button type="submit" disabled={isSubmitted} className="btn btn-primary w-25">Update</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default EditUser