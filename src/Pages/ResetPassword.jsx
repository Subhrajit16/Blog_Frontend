import React from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
function ResetPassword() {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm()
    const {uid, token} = useParams()
    const password = watch('password');
    async function onsubmit(data) {
        console.log(data)
        try {
            const promise = axios.post(`https://blog-backend-1-5cm6.onrender.com/forgot_password/reset/${uid}/${token}`, data)
            const resp = await toast.promise(promise, {
                pending: 'Please wait while we reset your password...',
                success: 'Password reset successfully',
            })

        } catch (error) {
            toast.error(error.response.data)
        }finally{
            reset()
        }
    }
    return (
        <div>
            
            <div className="container">
            <h1 className='text-center'>Reset your Password</h1>

                <form onSubmit={handleSubmit(onsubmit)}>
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Enter Your New Password</label>
                        <input {...register('password', { required: 'This field is required' })} type="password" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        {errors.confirmPassword && <p className="invalid-feedback">{errors.confirmPassword.message}</p>}

                        <label for="exampleInputEmail1" className="form-label">Confirm Password</label>
                        <input {...register('confirmPassword', {
                            required: 'This is required',
                            validate: value => value === password || "The passwords do not match"
                        })} type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                        {errors.confirmPassword && <p className="invalid-feedback">{errors.confirmPassword.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary" >Submit</button>
                </form>

            </div>
            <ToastContainer/>
        </div>
    )
}

export default ResetPassword