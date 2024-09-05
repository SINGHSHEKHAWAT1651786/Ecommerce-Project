import Dialog from '@mui/material/Dialog'; // Import Dialog component from MUI
import { MdClose } from "react-icons/md"; // Import close icon from react-icons
import Button from '@mui/material/Button'; // Import Button component from MUI
import Rating from '@mui/material/Rating'; // Import Rating component from MUI
import { useContext, useEffect, useState } from 'react'; // Import hooks from React
import QuantityBox from '../QuantityBox'; // Import QuantityBox component
import { IoIosHeartEmpty } from "react-icons/io"; // Import heart icon for empty wishlist
import { MdOutlineCompareArrows } from "react-icons/md"; // Import compare arrows icon
import { MyContext } from '../../App'; // Import MyContext from App
import ProductZoom from '../ProductZoom'; // Import ProductZoom component
import { IoCartSharp } from "react-icons/io5"; // Import cart icon
import { editData, fetchDataFromApi, postData } from '../../utils/api'; // Import utility functions for API calls
import { FaHeart } from "react-icons/fa"; // Import filled heart icon for wishlist

const ProductModal = (props) => {
    // State variables
    const [productQuantity, setProductQuantity] = useState(); // Quantity of the product
    const [chengeQuantity, setchengeQuantity] = useState(0); // Changed quantity
    let [cartFields, setCartFields] = useState({}); // Fields related to cart item
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [activeSize, setActiveSize] = useState(null); // Active size index
    const [tabError, setTabError] = useState(false); // Error state for tab selection
    const [isAddedToMyList, setSsAddedToMyList] = useState(false); // Wishlist state

    const context = useContext(MyContext); // Get context

    useEffect(() => {
        // Set default size if no options available
        if (props?.data?.productRam.length === 0 && props?.data?.productWeight.length === 0 && props?.data?.size.length === 0) {
            setActiveSize(1);
        }

        // Check if the product is already in the user's wishlist
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?productId=${props?.data?.id}&userId=${user?.userId}`).then((res) => {
            if (res.length !== 0) {
                setSsAddedToMyList(true);
            }
        });

    }, []); // Empty dependency array means this runs once after initial render

    // Update quantity state
    const quantity = (val) => {
        setProductQuantity(val);
        setchengeQuantity(val);
    }

    // Set active size and clear tab error
    const isActive = (index) => {
        setActiveSize(index);
        setTabError(false);
    }

    // Add product to cart
    const addtoCart = () => {
        if (activeSize !== null) {
            const user = JSON.parse(localStorage.getItem("user"));

            // Set cart fields
            cartFields.productTitle = props?.data?.name;
            cartFields.image = props?.data?.images[0];
            cartFields.rating = props?.data?.rating;
            cartFields.price = props?.data?.price;
            cartFields.quantity = productQuantity;
            cartFields.subTotal = parseInt(props?.data?.price * productQuantity);
            cartFields.productId = props?.data?.id;
            cartFields.countInStock = props?.data?.countInStock;
            cartFields.userId = user?.userId;

            context.addToCart(cartFields); // Add to cart through context
        } else {
            setTabError(true); // Set error if no size selected
        }
    }

    // Add product to wishlist
    const addToMyList = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== "") {
            const data = {
                productTitle: props?.data?.name,
                image: props?.data?.images[0],
                rating: props?.data?.rating,
                price: props?.data?.price,
                productId: id,
                userId: user?.userId
            }
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "The product added to my list"
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
                msg: "Please Login to continue"
            });
        }
    }

    return (
        <>
            <Dialog open={context.isOpenProductModal} className="productModal" onClose={() => context.setisOpenProductModal(false)}>
                <Button className='close_' onClick={() => context.setisOpenProductModal(false)}><MdClose /></Button>
                <h4 className="mb-1 font-weight-bold pr-5">{props?.data?.name}</h4>
                <div className='d-flex align-items-center'>
                    <div className='d-flex align-items-center mr-4'>
                        <span>Brands:</span>
                        <span className='ml-2'><b>{props?.data?.brand}</b></span>
                    </div>

                    <Rating name="read-only" value={parseInt(props?.data?.rating)} size="small" precision={0.5} readOnly />
                </div>

                <hr />

                <div className='row mt-2 productDetaileModal'>
                    <div className='col-md-5'>
                        <ProductZoom images={props?.data?.images} discount={props?.data?.discount} />
                    </div>

                    <div className='col-md-7'>
                        <div className='d-flex info align-items-center mb-3'>
                            <span className='oldPrice lg mr-2'>Rs: {props?.data?.oldPrice}</span>
                            <span className='netPrice text-danger lg'>Rs: {props?.data?.price}</span>
                        </div>

                        <span className="badge bg-success">IN STOCK</span>

                        <p className='mt-3'>Rs: {props?.data?.description}</p>

                        {
                            props?.data?.productRam?.length !== 0 &&
                            <div className='productSize d-flex align-items-center'>
                                <span>RAM:</span>
                                <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                    {
                                        props?.data?.productRam?.map((item, index) => (
                                            <li className='list-inline-item'><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }

                        {
                            props?.data?.size?.length !== 0 &&
                            <div className='productSize d-flex align-items-center'>
                                <span>Size:</span>
                                <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                    {
                                        props?.data?.size?.map((item, index) => (
                                            <li className='list-inline-item'><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }

                        {
                            props?.data?.productWeight?.length !== 0 &&
                            <div className='productSize d-flex align-items-center'>
                                <span>Weight:</span>
                                <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                                    {
                                        props?.data?.productWeight?.map((item, index) => (
                                            <li className='list-inline-item'><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }

                        <div className='d-flex align-items-center actions_'>
                            <QuantityBox quantity={quantity} item={props?.data} />

                            <Button className='btn-blue bg-red btn-lg btn-big btn-round ml-3' onClick={() => addtoCart()}><IoCartSharp />
                                {
                                    context.addingInCart === true ? "adding..." : " Add to cart"
                                }
                            </Button>
                        </div>

                        <div className='d-flex align-items-center mt-5 actions'>
                            <Button className='btn-round btn-sml' variant="outlined" onClick={() => addToMyList(props?.data?.id)} >
                                {
                                    isAddedToMyList === true ?
                                        <>
                                            <FaHeart className="text-danger" />
                                            &nbsp; ADDED TO WISHLIST
                                        </>
                                        :
                                        <>
                                            <IoIosHeartEmpty />
                                            &nbsp; ADD TO WISHLIST
                                        </>
                                }
                            </Button>
                            <Button className='btn-round btn-sml ml-3' variant="outlined"><MdOutlineCompareArrows /> &nbsp; COMPARE</Button>
                        </div>

                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModal;
