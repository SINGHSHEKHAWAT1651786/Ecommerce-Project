import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { deleteData, deleteImages, uploadImage, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

// Styled component for Breadcrumbs
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const AddCategory = () => {
    // State to manage loading state, form fields, and image previews
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        color: '',
        slug: '',
        parentId: ''
    });
    const [previews, setPreviews] = useState([]);
    const formdata = new FormData();
    const history = useNavigate();
    const context = useContext(MyContext);

    // Fetch existing images and delete them on component mount
    useEffect(() => {
        fetchDataFromApi("/api/imageUpload").then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/category/deleteImage?img=${img}`).then(() => {
                        deleteData("/api/imageUpload/deleteAllImages");
                    });
                });
            });
        });
    }, []);

    // Handle changes in input fields
    const changeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

    let img_arr = [];
    let uniqueArray = [];
    let selectedImages = [];

    // Handle file input changes and upload images
    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;
            setUploading(true);
            for (let i = 0; i < files.length; i++) {
                if (files[i] && ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(files[i].type)) {
                    const file = files[i];
                    selectedImages.push(file);
                    formdata.append('images', file);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file.'
                    });
                    return false;
                }
            }

            formFields.images = selectedImages;

            uploadImage(apiEndPoint, formdata).then(() => {
                fetchDataFromApi("/api/imageUpload").then((response) => {
                    if (response?.length !== 0) {
                        response.forEach((item) => {
                            item?.images?.forEach((img) => {
                                img_arr.push(img);
                            });
                        });

                        uniqueArray = img_arr.filter((item, index) => img_arr.indexOf(item) === index);
                        const appendedArray = [...previews, ...uniqueArray];

                        setPreviews(appendedArray);
                        setTimeout(() => {
                            setUploading(false);
                            img_arr = [];
                            context.setAlertBox({
                                open: true,
                                error: false,
                                msg: "Images Uploaded!"
                            });
                        }, 200);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Remove an image from the preview list
    const removeImg = async (index, imgUrl) => {
        const imgIndex = previews.indexOf(imgUrl);
        deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then(() => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Image Deleted!"
            });
        });

        if (imgIndex > -1) {
            previews.splice(index, 1);
        }
    };

    // Handle form submission to add a category
    const addCat = (e) => {
        e.preventDefault();
        const appendedArray = [...previews, ...uniqueArray];
        img_arr = [];
        formFields.slug = formFields.name;
        formFields.images = appendedArray;

        if (formFields.name !== "" && formFields.color !== "" && previews.length !== 0) {
            setIsLoading(true);
            postData(`/api/category/create`, formFields).then(() => {
                setIsLoading(false);
                context.fetchCategory();
                deleteData("/api/imageUpload/deleteAllImages");
                history('/category');
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            });
            return false;
        }
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Add Category</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Category"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Add Category"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addCat}>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                <div className='form-group'>
                                    <h6>Category Name</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={changeInput} />
                                </div>
                                <div className='form-group'>
                                    <h6>Color</h6>
                                    <input type='text' name='color' value={formFields.color} onChange={changeInput} />
                                </div>
                                <div className="imagesUploadSec">
                                    <h5 className="mb-4">Media And Published</h5>
                                    <div className='imgUploadBox d-flex align-items-center'>
                                        {previews.length !== 0 && previews.map((img, index) => (
                                            <div className='uploadBox' key={index}>
                                                <span className="remove" onClick={() => removeImg(index, img)}><IoCloseSharp /></span>
                                                <div className='box'>
                                                    <LazyLoadImage
                                                        alt="image"
                                                        effect="blur"
                                                        className="w-100"
                                                        src={img} />
                                                </div>
                                            </div>
                                        ))}
                                        <div className='uploadBox'>
                                            {uploading ? (
                                                <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                    <CircularProgress />
                                                    <span>Uploading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/category/upload')} name="images" />
                                                    <div className='info'>
                                                        <FaRegImages />
                                                        <h5>image upload</h5>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                        <FaCloudUploadAlt /> &nbsp;  
                                        {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddCategory;
