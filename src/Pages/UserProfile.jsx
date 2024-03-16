import React,{useEffect, useState} from 'react'
import Header from '../Component/Header'
import { useParams } from 'react-router-dom'
import axios from 'axios'
function UserProfile() {
    const { id } = useParams()
    const [user, setUser] = useState({})
    async function fetchUerData() {
        const resp = await axios.get(`https://blog-backend-1-5cm6.onrender.com/user/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(resp.data)
        setUser(resp.data)
    }
    useEffect(() => {
        fetchUerData()
    }, [id])
    return (
        <div>
            <Header />

            <div className="container">
                <h1 className="text-center my-5">User Profile</h1>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h4>Profile Picture</h4>
                            </div>
                            <div className="card-body">
                                <img src={user.avatar} alt="profile" style={{ width: '100%', height: '300px', objectFit: 'contain' }} />
                            </div>
                        </div>

                    </div>

                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h4>Personal Information</h4>
                            </div>
                            <div className="card-body">
                                <p>Name: {user.name}</p>
                                <p>Email: {user.email}
                                </p>
                                <p>Education: {user.education}</p>
                                <p>Address: {user.address}</p>
                                <p>Bio: {user.bio}</p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserProfile