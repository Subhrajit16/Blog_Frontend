import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Header from './Component/Header'
function EditProfile() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [updateAvatarFile, setUpdateAvatarFile] = useState(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { register, handleSubmit, reset } = useForm()
    async function fetchUerData() {
        const resp = await axios.get(`https://blog-backend-1-5cm6.onrender.com/user/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(resp.data)
        setAvatarUrl(resp.data.avatar)
        reset(resp.data)
    }
    useEffect(() => {
        fetchUerData()
    }, [id, avatarUrl])


    async function handleAvatarUpdate(e) {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('avatar', file)
        try {
            setIsLoading(true)
            const promise = axios.patch(`https://blog-backend-1-5cm6.onrender.com/user/avatar/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const resp = await toast.promise(promise, {

                pending: 'Updating avatar',
                success: 'Avatar updated',

            })
            console.log(resp.data)
            setAvatarUrl(resp.data)
        } catch (error) {
            toast.error('Something went wrong while updating avatar')
        } finally {
            setIsLoading(false)
        }
    }

    async function onSubmit(data) {
        console.log(data)
        const pyload = {
            name: data.name,
            email: data.email,
            education:data.education,
            bio:data.bio,
            address:data.address

        }
        try {
            const resp = await axios.patch(`https://blog-backend-1-5cm6.onrender.com/user/${id}`, pyload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(resp.data)
            toast.success('User Updated');
            setIsSubmitted(true)
            setTimeout(() => {
                navigate('/profile')
            }, 2000)

        } catch (error) {

            toast.error(error.response.data);
        }

    }
    return (
        <div>
            <Header />
            <h1>Edit Profile</h1>
            <Link className=' m-3' to='/profile'>Back</Link>
            <form className='p-3' onSubmit={handleSubmit(onSubmit)} >

                <div className="mb-3 d-flex flex-column">
                    <label for="exampleInputPassword1" className="form-label">Profile picture</label>
                    <img style={{ height: '200px', width: '200px', objectFit: 'contain' }} src={avatarUrl} alt="" />
                    <div>
                        <i class="fa-regular fa-pen-to-square fa-lg"></i>
                        <input type="file" onChange={handleAvatarUpdate} />
                    </div>
                </div>

                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Name</label>
                    <input type="text" disabled={isSubmitted} {...register('name')} className="form-control w-25" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" disabled={isSubmitted} {...register('email')} className="form-control w-25" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Education</label>
                    <input type="text" disabled={isSubmitted} {...register('education')} className="form-control w-25" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Address</label>
                    <input type="text" disabled={isSubmitted} {...register('address')} className="form-control w-25" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Bio</label>
                    <input type="text" disabled={isSubmitted} {...register('bio')} className="form-control w-25" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>





                <button type="submit" disabled={isLoading || isSubmitted} className="btn btn-primary w-25">Save</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default EditProfile