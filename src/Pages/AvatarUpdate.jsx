import React, { useRef, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
function AvatarUpdate() {
    const [file, setFile] = useState(null)
    const id = localStorage.getItem('Uid')
    const [isLoading, setIsLoading] = useState(false)
    const avatarRef = useRef()
    const navigate = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault()
        console.log('submit')
        const formData = new FormData()
        formData.append('avatar', file)
        if (!file) {
            return toast.error('Please select a image')
        }
        try {
            setIsLoading(true)
            const promise = axios.patch(`http://localhost:8080/user/avatar/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            // console.log(resp.data)
            const resp = await toast.promise(
                promise,
                {
                    pending: 'Updating avatar...',
                    success: 'Avatar updated'
                }
            );
            if (resp.status === 200) {
                setTimeout(() => {
                    navigate('/blogs')
                }, 2000)
            }
        } catch (error) {
            toast.error(error.response.data)
            // console.log(error)
        } finally {
            setIsLoading(false)
            avatarRef.current.value = ''
        }
    }
    return (
        <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
            <div className="card">
                <div className="card-header">
                    <h4>Update Your Avatar</h4>
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="photoLabel" className="mr-1">Upload :</label>
                            <input
                                id="photoLabel"
                                className="form-control"
                                type="file"
                                // name="additionalDetails.photo"
                                ref={avatarRef}
                                onChange={e => setFile(e.target.files[0])}
                            />
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <button type='submit' disabled={isLoading} className='btn btn-primary my-3' onClick={handleSubmit}>Update</button>
                                <Link to='/blogs'>skip for now</Link>
                            </div>
                        </div>
                        <div className="form-group">
                            {file && (
                                <div className="selected-image-container p-1">
                                    <img src={URL.createObjectURL(file)} alt="Selected Avatar" className="selected-image border rounded bg-light p-2"
                                        style={{ maxWidth: "60%" }}
                                    />
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />

        </div>
    )
}

export default AvatarUpdate