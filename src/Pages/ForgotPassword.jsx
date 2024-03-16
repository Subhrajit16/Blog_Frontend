import React, { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { set } from 'react-hook-form'
function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        if (email) {
            try {
                const prms = axios.post('https://blog-backend-1-5cm6.onrender.com/forgot_password', { email })
                const resp = await toast.promise(prms, {
                    pending: 'Please wait while we send you a link to reset your password...',
                    success: 'Password reset link sent to your email',
                })
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            } catch (error) {
                toast.error(error.response.data)
            }
        }
        setIsLoading(false)
        setEmail('')

    }
    return (
        <>
            <h1 className='text-center'>Forgot Password</h1>
            <div className="container">
                <p className='text-center'>Enter your email address and we'll send you a link to reset your password</p>

                <form>
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading} onClick={handleSubmit} >Submit</button>
                </form>

            </div>
            <ToastContainer />
        </>
    )
}

export default ForgotPassword