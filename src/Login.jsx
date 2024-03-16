import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
    const { register, handleSubmit } = useForm()
    const [isLoading, setIsLoading] = React.useState(false)
    const [togglePassword, setTogglePassword] = React.useState(false)
    const nagivate = useNavigate()
    async function onSubmit(data) {
        console.log(data)
        try {
            setIsLoading(true)
            const prms = axios.post('https://blog-backend-1-5cm6.onrender.com/login', data)
            // console.log(resp.data)

            const resp = await toast.promise(
                prms,
                {
                    pending: 'Logging in...',
                    success: 'Login successfull'
                }
            )

            // console.log(resp.data)

            // reset()
            if (resp.data.token) {
                localStorage.setItem('token', resp.data.token)
                localStorage.setItem('Uid', resp.data.id)
                // toast.success('Login successfull');
                if (resp.data.avatar === '') {
                    setTimeout(() => {
                        nagivate('/avatar')

                    }, 2000)
                }
                else {
                    setTimeout(() => {
                        nagivate('/blogs')

                    }, 2000)
                }
            } else {
                toast.error('Something went wrong while login')

            }

        } catch (error) {

            console.log(error.response.data)
            toast.error(error.response.data);
        } finally {
            setIsLoading(false)
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
        <div className='card d-flex flex-column align-items-center'>

            <h1>Log in</h1>
            {/* <Link className=' m-3' to='/'>Back</Link> */}
            <form className='p-3 w-75 d-flex flex-column align-items-center' onSubmit={handleSubmit(onSubmit)} >

                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" {...register('email')} className="form-control " id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input type={`${togglePassword ? 'text' : 'password'}`} {...register('password')} className="form-control" id="exampleInputPassword1" />
                    <input type="checkbox" name="" id="" onClick={togglePasswordVisibility} />Show password
                </div>
                <div className='mb-2'>
                    <Link to='/forgot_password'>Forgot your password?</Link>
                </div>
                <button type="submit" disabled={isLoading} className="btn btn-primary w-25">Login</button>
            </form>
            <p>New here ? create a account <Link to='/'>here</Link></p>
            <ToastContainer />
        </div>
    )
}

export default Login