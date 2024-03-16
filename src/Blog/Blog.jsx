import React, { useEffect, useRef, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../Component/Header'
import moment from 'moment'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactPaginate from 'react-paginate';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
function Blog() {
    const [isJwtExpired, setIsJwtExpired] = useState(false)
    const { register, handleSubmit, reset, setValue } = useForm()
    const [file, setFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingGetAllBlogs, setIsLoadingGetAllBlogs] = useState(false)
    const uploadfileRef = useRef()
    const quillRef = useRef();
    register('description');
    const user_id = localStorage.getItem('Uid')
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    // function handleFileUpload(e) {
    //     setFile(e.target.files[0])
    // }

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    // console.log(file)

    //Create blog function
    async function onSubmit(data) {
        console.log({ data })
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('user_id', user_id)
        formData.append('thumbnail', thumbnail)
        Array.from(selectedFiles).forEach((file, index) => {
            formData.append('images', file);
        });
        const token = localStorage.getItem('token')
        try {
            setIsLoading(true)
            const resp = axios.post('https://blog-backend-1-5cm6.onrender.com/blog/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responce = await toast.promise(
                resp,
                {
                    pending: 'Creating blog...',
                    success: 'Blog created',
                    error: 'Error creating blog'
                }
            );
            console.log(responce.data)
            getAllBlogs()
        } catch (error) {
            if (error.response.status === 401) {
                toast.error('Session Expired. Please login again')
                setIsJwtExpired(true)

            }

        } finally {
            console.log('finally')
            uploadfileRef.current.value = ''
            reset()
            setFile(null)
            setIsLoading(false)
        }

    }

    //get all blogs
    const [allBlogs, setAllBlogs] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [totalItems, setTotalItems] = useState(0)
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    function handlePageClick(data) {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    }
    async function getAllBlogs() {
        // console.log('getting all blogs', currentPage, itemsPerPage)
        setIsLoadingGetAllBlogs(true)
        try {
            const resp = await axios.get(`https://blog-backend-1-5cm6.onrender.com/blog/all?page=${currentPage}&limit=${itemsPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(resp.data)
            setAllBlogs(resp.data.allBlogs)
            setTotalItems(resp.data.totalBlogs)
        } catch (error) {
            toast.error(error.response.data)
        } finally {
            setIsLoadingGetAllBlogs(false)
        }
    }

    useEffect(() => {
        getAllBlogs()
    }, [currentPage, itemsPerPage])

    //React quill
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block']

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link'
    ];

    const handleQuillChange = (content, delta, source, editor) => {
        setValue('description', editor.getText().trim()); // Use editor's content in HTML format
    };

    // console.log({allBlogs})

    return (
        <div>

            <Header />
            <div className="card mt-4" >
                <div className="card-header">
                    <h1>Post your Blog</h1>
                </div>
                <div className="card-body px-3" >

                    <form className='p-3' onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                            <input type="text" {...register('title')} disabled={isJwtExpired} className="form-control w-100" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3 h-100">
                            <label htmlFor="exampleInputEmail1" className="form-label">Description</label>
                            <ReactQuill
                                theme="snow" // other themes: 'bubble'
                                {...register('description')}
                                ref={quillRef}
                                modules={modules}
                                formats={formats}
                                onChange={handleQuillChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="thumbnail">Select thumbnail image</label>
                            <input type="file" ref={uploadfileRef} onChange={e => setThumbnail(e.target.files[0])} className="form-control w-100" id="thumbnail" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="thumbnail">Select other images</label>
                            <input type="file" multiple onChange={handleFileChange} ref={uploadfileRef} className="form-control w-100" id="thumbnail" />

                        </div>

                        <button type="submit" disabled={isLoading} className="btn btn-primary w-25">Post</button>
                    </form>
                    {isJwtExpired ? <Link to='/login'>Go to login Page</Link> : null}
                </div>
            </div>

            <Backdrop
                sx={{ color: '#FFF', fontSize: '100px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoadingGetAllBlogs}
            >
                <CircularProgress size={80} color="inherit" />
            </Backdrop>

            <h2 className='text-center py-3'>Read All Blogs</h2>
            <div className="row row-cols-1 row-cols-md-4 g-4 p-4">
                {
                    allBlogs && allBlogs.map((blog, index) => {
                        return (
                            <div className="col d-flex justify-content-center px-3" key={index}>

                                <div className="card" style={{ width: "22rem" }}>
                                    <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                        {blog.user_id?.avatar ? <img style={{ fontSize: '30px' }} src={blog.user_id?.avatar} alt="" /> : <i style={{ fontSize: '30px' }} class="fa-solid fa-user fa-xl"></i>}

                                        {/* <img style={{ height: '40px', aspectRatio: '1/1', borderRadius: '50%', objectFit: 'cover' }} src={blog.user_id?.avatar} alt="" /> */}
                                        <Link to={`/user/${blog.user_id?._id}`} className='p-3 mb-0'>{blog.user_id?.name}</Link>
                                    </div>
                                    <img src={`${blog.thumbnail}`} className="card-img-top img-fluid" style={{ width: '100%', height: '200px', objectFit: 'contain' }} alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{blog.title}</h5>
                                        {/* <p className="card-text">
                                            {blog.description}
                                        </p> */}
                                    </div>
                                    <div className="card-body p-0 d-flex justify-content-around">
                                        <div style={{ height: '15px' }}>
                                            <Link to={`/blog/${blog._id}`} className="card-link">Read Full Article</Link>
                                            <div>

                                                {moment(blog.createdAt).fromNow()}
                                            </div>
                                        </div>
                                        <div>

                                            <p className='mb-0'>{blog.likes.length} Likes</p>
                                            <p>{blog.comments.length} comments</p>

                                        </div>

                                    </div>
                                </div>
                            </div>

                        )
                    })
                }
                <div className="row d-flex mt-3 justify-content-between w-100">
                    {/* <div className="col-md-4 d-flex justify-content-start align-items-center">
                        <label htmlFor="itemPerPage">Select item per page</label>
                        <select
                            id='itemPerPage'
                            className=""
                            onChange={handleItemPerPageChange}
                            value={itemsPerPage}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>

                        </select>
                    </div> */}
                    <div className="col-md-4 justify-content-center align-items-center">
                        <ReactPaginate
                            previousLabel="previous"
                            nextLabel="next"
                            breakLabel="..."
                            pageCount={totalPages}
                            onPageChange={handlePageClick}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName='page-link'
                            nextClassName='page-item'
                            nextLinkClassName='page-link'
                            breakClassName='page-item'
                            breakLinkClassName='page-link'
                            activeClassName={'active'}
                        />
                    </div>
                    <div className="col-md-4 d-flex justify-content-end align-items-center">
                        {<p>
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                        </p>
                        }
                    </div>
                </div>
            </div>


            <ToastContainer />
        </div >
    )
}

export default Blog