import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { useContext, useEffect, useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { deleteData, deleteImages, editData, fetchDataFromApi, postData, uploadImage } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegImages } from "react-icons/fa";
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Styled Breadcrumb component with custom styling
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

const EditHomeSlide = () => {
    // State hooks
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({ images: [] });
    const [previews, setPreviews] = useState([]);

    // Get the slide ID from URL params
    let { id } = useParams();
    const formdata = new FormData();
    const history = useNavigate();
    const context = useContext(MyContext);

    // Fetch existing data and delete old images on component mount
    useEffect(() => {
        context.setProgress(20);
        fetchDataFromApi("/api/imageUpload").then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/homeBanner/deleteImage?img=${img}`).then(() => {
                        deleteData("/api/imageUpload/deleteAllImages");
                    });
                });
            });
        });

        fetchDataFromApi(`/api/homeBanner/${id}`).then((res) => {
            setPreviews(res.images);
            context.setProgress(100);
        });
    }, [id, context]);

    let img_arr = [];
    let uniqueArray = [];

    // Handle file selection and upload
    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;
            setUploading(true);

            for (var i = 0; i < files.length; i++) {
                // Validate file type
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png')) {
                    const file = files[i];
                    formdata.append(`images`, file);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file.'
                    });
                    return false;
                }
            }

            // Upload images and update previews
            uploadImage(apiEndPoint, formdata).then(() => {
                fetchDataFromApi("/api/imageUpload").then((response) => {
                    if (response?.length) {
                        response.map((item) => {
                            item?.images?.map((img) => {
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
                        }, 500);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Remove an image from the preview list and delete it from the server
    const removeImg = async (index, imgUrl) => {
        const imgIndex = previews.indexOf(imgUrl);

        deleteImages(`/api/homeBanner/deleteImage?img=${imgUrl}`).then(() => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Image Deleted!"
            });
        });

        if (imgIndex > -1) {
            previews.splice(index, 1);
        }
    }

    // Handle form submission for editing the slide
    const editSlide = (e) => {
        e.preventDefault();
        const appendedArray = [...previews, ...uniqueArray];
        img_arr = [];
        formdata.append('images', appendedArray);
        formFields.images = appendedArray;

        if (formFields.name !== "" && formFields.color !== "" && previews.length !== 0) {
            setIsLoading(true);
            editData(`/api/homeBanner/${id}`, formFields).then(() => {
                setIsLoading(false);
                context.fetchCategory();
                deleteData("/api/imageUpload/deleteAllImages");
                history('/homeBannerSlide/list');
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            });
            return false;
        }
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Edit Home Slide</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Edit Home Slide"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={editSlide}>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                <div className="imagesUploadSec">
                                    <h5 className="mb-4">Media And Published</h5>

                                    <div className='imgUploadBox d-flex align-items-center'>
                                        {
                                            previews?.length !== 0 && previews?.map((img, index) => (
                                                <div className='uploadBox' key={index}>
                                                    <span className="remove" onClick={() => removeImg(index, img)}><IoCloseSharp /></span>
                                                    <div className='box'>
                                                        <LazyLoadImage
                                                            alt={"image"}
                                                            effect="blur"
                                                            className="w-100"
                                                            src={img} />
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        <div className='uploadBox'>
                                            {
                                                uploading === true ?
                                                    <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                        <CircularProgress />
                                                        <span>Uploading...</span>
                                                    </div>
                                                    :
                                                    <>
                                                        <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/homeBanner/upload')} name="images" />
                                                        <div className='info'>
                                                            <FaRegImages />
                                                            <h5>image upload</h5>
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </div>

                                    <br />

                                    <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                        <FaCloudUploadAlt /> &nbsp;  {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditHomeSlide;
