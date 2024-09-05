import Rating from '@mui/material/Rating';  // Import Material UI Rating component
import { TfiFullscreen } from "react-icons/tfi";  // Import fullscreen icon from react-icons
import Button from '@mui/material/Button';  // Import Material UI Button component
import { IoMdHeartEmpty } from "react-icons/io";  // Import empty heart icon from react-icons
import { useContext, useEffect, useRef, useState } from 'react';  // Import React hooks
import { MyContext } from '../../App';  // Import context for global state management
import { Link } from 'react-router-dom';  // Import Link for routing

import Slider from "react-slick";  // Import Slider component for carousel
import Skeleton from '@mui/material/Skeleton';  // Import Material UI Skeleton for loading state
import { IoIosImages } from "react-icons/io";  // Import image icon from react-icons
import { fetchDataFromApi, postData } from '../../utils/api';  // Import API utility functions
import { FaHeart } from "react-icons/fa";  // Import filled heart icon from react-icons

const ProductItem = (props) => {

    const [isHovered, setIsHovered] = useState(false);  // State to track hover status
    const [isLoading, setIsLoading] = useState(true);  // State to track loading status
    const [isAddedToMyList, setSsAddedToMyList] = useState(false);  // State to track if product is in user's list

    const context = useContext(MyContext);  // Access global context

    const sliderRef = useRef();  // Ref for the Slider component

    // Slider settings
    var settings = {
        dots: true,
        infinite: true,
        loop: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: 100
    };

    // Function to view product details
    const viewProductDetails = (id) => {
        context.openProductDetailsModal(id, true);  // Open product details modal
    }

    // Function to handle mouse enter event
    const handleMouseEnter = (id) => {
        if (isLoading === false) {
            setIsHovered(true);  // Set hover state
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPlay();  // Play slider on hover
                }
            }, 20);
        }

        // Fetch data to check if the product is in the user's list
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res) => {
            if (res.length !== 0) {
                setSsAddedToMyList(true);  // Update state if product is in the list
            }
        });
    }

    // Function to handle mouse leave event
    const handleMouseLeave = () => {
        if (isLoading === false) {
            setIsHovered(false);  // Remove hover state
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPause();  // Pause slider on hover out
                }
            }, 20);
        }
    }

    // Effect to set loading state after component mounts
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);  // Stop loading after delay
        }, 500);
    }, []);

    // Function to add product to the user's list
    const addToMyList = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== "") {
            const data = {
                productTitle: props?.item?.name,
                image: props.item?.images[0],
                rating: props?.item?.rating,
                price: props?.item?.price,
                productId: id,
                userId: user?.userId
            }
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "The product was added to my list"
                    });

                    // Refresh the status of whether the product is in the list
                    fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res) => {
                        if (res.length !== 0) {
                            setSsAddedToMyList(true);  // Update state
                        }
                    });

                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please login to continue"
            });
        }
    }

    return (
        <>
            <div className={`productItem ${props.itemView}`}  // Container for product item
                onMouseEnter={() => handleMouseEnter(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}  // Handle hover enter
                onMouseLeave={handleMouseLeave}  // Handle hover leave
            >

                <div className="img_rapper">  // Wrapper for product image
                    <Link to={`/product/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id}`}>  // Link to product details
                        <div className='productItemSliderWrapper'>  // Wrapper for slider
                            {
                                isHovered === true &&
                                <Slider {...settings} ref={sliderRef} className='productItemSlider'>  // Slider for image carousel
                                    {
                                        props.item?.images?.map((image, index) => {
                                            return (
                                                <div className='slick-slide' key={index}>  // Slide for each image
                                                    <img src={image} className="w-100" />
                                                </div>
                                            )
                                        })
                                    }

                                </Slider>
                            }

                        </div>

                        {
                            isLoading === true ?
                                <Skeleton variant="rectangular" width={300} height={400}>  // Loading skeleton
                                    <IoIosImages/>
                                </Skeleton>

                                :

                                <img src={props.item?.images[0]} className="w-100" />  // Product image
                        }
                    </Link>

                    <span className="badge badge-primary">{props.item?.discount}%</span>  // Discount badge
                    <div className="actions">  // Action buttons
                        <Button onClick={() => viewProductDetails(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}><TfiFullscreen /></Button>
                        
                        <Button className={isAddedToMyList === true && 'active'} onClick={() => addToMyList(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}>
                            {
                                isAddedToMyList === true ? <FaHeart style={{ fontSize: '20px' }} />  // Filled heart icon
                                :
                                <IoMdHeartEmpty style={{ fontSize: '20px' }} />  // Empty heart icon
                            }
                        </Button>
                    </div>
                </div>

                <div className="info">  // Product information
                    <Link to={`/product/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id}`}><h4>{props?.item?.name?.substr(0, 30) + '...'}</h4></Link>  // Product name with truncation

                    {
                        props?.item?.countInStock >= 1 ?  <span className="text-success d-block">In Stock</span>  // In-stock status
                        :

                        <span className="text-danger d-block">Out of Stock</span>  // Out-of-stock status
                    }
                   
                    <Rating className="mt-2 mb-2" name="read-only" value={props?.item?.rating} readOnly size="small" precision={0.5} />  // Product rating

                    <div className="d-flex">  // Price container
                        <span className="oldPrice">Rs {props?.item?.oldPrice}</span>  // Old price
                        <span className="netPrice text-danger ml-2">Rs {props?.item?.price}</span>  // Current price
                    </div>
                </div>
            </div>
          
        </>
    )
}

export default ProductItem;
