import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Login from './Login';
import 'react-toastify/dist/ReactToastify.css';
function CreateUser() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [togglePassword, setTogglePassword] = useState(false)
    const user_id = localStorage.getItem('id')
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const navigate = useNavigate()
    async function onSubmit(data) {
        // console.log(data)
        const payload = {
            ...data,
            avatar: ''
        }
        // console.log({payload})
        try {
            setIsSubmitted(true)
            const promise = axios.post('https://blog-backend-1-5cm6.onrender.com/signin', payload)
            const resp = await toast.promise(
                promise, {
                pending: 'Creating User...',
                success: 'User Created'

            })
            console.log(resp.data)
            if (resp.status === 201 && resp.data._id) {
                localStorage.setItem('id', resp.data._id)
                reset()
                setTimeout(() => {
                    navigate('/login')
                }, 2000);
            } else {
                toast.error('Something went wrong while creating user')
            }

        } catch (error) {

            // console.log(error.response.data)
            toast.error(error.response.data);
        } finally {
            reset()
            isSubmitted(false)
        }

    }
    function togglePasswordVisibility(e) {
        if (e.target.checked) {
            setTogglePassword(true)
        } else {
            setTogglePassword(false)
        }
    }
    return (

        <div className='container-fluid bg-info d-flex align-items-center justify-content-center' style={{ height: '100vh', width: '100vw' }}>

            <div className='card px-5 d-flex flex-column align-items-center justify-content-center'>
                <h1>Sign Up</h1>
                {/* <Link className=' m-3' to='/'>Back</Link> */}
                <form np className='p-3 ' onSubmit={handleSubmit(onSubmit)} >
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Name</label>
                        <input type="text" {...register('name', { required: 'Name is required' })} className={errors.name ? `form-control  is-invalid` : 'form-control'} id="exampleInputEmail1" aria-describedby="emailHelp" />
                        {errors.name && <p className='invalid-feedback'>{errors.name.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Email</label>
                        <input type="email" {...register('email', {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'Invalid email address'
                            },
                            required: 'Email is required'
                        })} className={errors.email ? `form-control  is-invalid` : 'form-control'} id="exampleInputEmail1" aria-describedby="emailHelp" />
                        {errors.email && <p className='invalid-feedback'>{errors.email.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password</label>
                        <input type={`${togglePassword ? 'text' : 'password'}`} {...register('password', { required: 'password is required' })} className={errors.password ? `form-control  is-invalid` : 'form-control'} id="exampleInputPassword1" />
                        {errors.password && <p className='invalid-feedback'>{errors.password.message}</p>}
                        <input type="checkbox" name="" id="" onClick={togglePasswordVisibility} />Show password
                    </div>
                    <button type="submit" disabled={isSubmitted} className="btn btn-primary">Submit</button>
                </form>
                <ToastContainer />
                <p>Alrady have an account ? <Link to='/login'>Login</Link> here </p>
            </div>

        </div>
    )
}

export default CreateUser