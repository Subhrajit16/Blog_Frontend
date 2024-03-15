import React, { useEffect, useState } from 'react'
import Header from '../Component/Header'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { toast, ToastContainer } from 'react-toastify'
import moment from 'moment'
import './Details.css'
function BlogDetails() {
    const { id } = useParams()
    const user_id = localStorage.getItem('Uid')
    const token = localStorage.getItem('token')
    const [blog, setBlog] = useState({})
    const [islikeClicked, setIsLikeClicked] = useState(false)
    const [comment, setComment] = useState('')
    //get blog by id
    async function getBlogById() {
        try {
            const resp = await axios.get(`http://localhost:8080/blog/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(resp.data)
            setBlog(resp.data)
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    useEffect(() => {
        getBlogById()
    }, [id, islikeClicked])
    //like handler
    async function likeHandler() {
        // console.log({user_id})
        try {
            setIsLikeClicked(true)
            const resp = await axios.post(`http://localhost:8080/blog/likes/${id}`, { user_id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            toast.success(resp.data)
        } catch (error) {
            toast.error(error.response.data)
        } finally {
            setIsLikeClicked(false)
        }
    }

    //Comments handler
    async function handleComment() {
        const payload = {
            user_id,
            comment
        }
        // console.log(payload)
        setIsLikeClicked(true)
        try {
            const promise = axios.post(`http://localhost:8080/blog/comments/${id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const resp = await toast.promise(
                promise,
                {
                    pending: 'Adding comment...',
                    success: 'Comment added',
                }

            )

        } catch (error) {
            toast.error(error.response.data)
        } finally {
            setIsLikeClicked(false)
            setComment('')
        }
    }



    return (
        <div>
            <Header />
            <h4 className='text-center my-5 text-text-decoration-underline text-primary'>Full article</h4>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-6">
                        <Carousel autoPlay={true} interval={5000} infiniteLoop={true} useKeyboardArrows dynamicHeight={true} emulateTouch stopOnHover>
                            {blog.images?.map((image, index) => (
                                <div key={index}>
                                    <img src={image} alt={`Slide ${index}`} />
                                </div>
                            ))}
                        </Carousel>
                        <div className='ms-2'>

                            {blog.likes?.some(like => like._id === user_id) ? <i class="fa-solid fa-heart fa-lg" onClick={likeHandler}></i> : <i class="fa-regular fa-heart fa-lg" onClick={likeHandler}></i>}
                            {blog.likes?.length > 0 && <p>{blog.likes.length} likes</p>}
                        </div>

                        {/* <p>Comments</p>
                        {blog.comments?.map((comment, index) => (
                            <div className='py-2' key={index}>
                                <span>{comment.comment}</span> by <span>{comment.user.name}</span>( {moment(comment.date).fromNow()})
                            </div>
                        ))} */}




                    </div>
                    <div className="col-md-6">
                        <h1>{blog.title}</h1>
                        <p>{blog.description}</p>

                    </div>
                </div>
                <div className="container">

                    <div className="row">
                        <div className="col-md-10">
                            <div className="block">
                                <div className="block-header">
                                    <div className="title">
                                        <h2>Comments</h2>
                                        <div className="tag">{blog.comments?.length}</div>
                                    </div>

                                </div>
                                <div className="writing">
                                    <textarea
                                        contentEditable="true"
                                        className="textarea"
                                        autofocus=""
                                        spellCheck="false"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    >

                                    </textarea>
                                    <div className="footer">
                                        <div className="group-button">
                                            <button className="btn">
                                                <i className="ri-at-line" />
                                            </button>
                                            <button onClick={handleComment} disabled={islikeClicked || comment === ''} className="btn primary">Send</button>
                                        </div>
                                    </div>
                                </div>
                                {blog.comments?.sort((a, b) => {
                                    if (a.user?._id === user_id) {
                                        return -1; 
                                    } else if (b.user?._id === user_id) {
                                        return 1; 
                                    } else {
                                        return 0; 
                                    }
                                }).map(comment => (
                                    <div className="comment">
                                        <div className="user-banner">
                                            <div className="user">
                                                <div className="avatar">
                                                   {comment.user?.avatar ?  <img src={comment.user?.avatar} alt="" /> : <i style={{fontSize:'30px'}} class="fa-solid fa-user fa-2xlg"></i>}
                                                </div>
                                                <h5>{comment.user?.name}</h5>
                                            </div>
                                            <button className="btn dropdown">
                                                <i className="ri-more-line" />
                                            </button>
                                        </div>
                                        <div className="content">
                                            <p>
                                                {comment?.comment}
                                            </p>
                                        </div>
                                        <div className="footer">
                                            <span className="is-mute">{moment(comment.date).fromNow()}</span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />

        </div>
    )
}

export default BlogDetails