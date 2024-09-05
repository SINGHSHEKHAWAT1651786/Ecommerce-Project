import { Link } from "react-router-dom"; // Import Link component for navigation
import Rating from '@mui/material/Rating'; // Import Rating component from Material UI
import QuantityBox from "../../Components/QuantityBox"; // Import custom QuantityBox component
import { IoIosClose } from "react-icons/io"; // Import close icon from react-icons
import Button from '@mui/material/Button'; // Import Button component from Material UI

import emprtCart from '../../assets/images/emptyCart.png'; // Import image for empty cart
import { MyContext } from "../../App"; // Import context for global state
import { useContext, useEffect, useState } from "react"; // Import React hooks
import { deleteData, editData, fetchDataFromApi } from "../../utils/api"; // Import utility functions for API calls
import { IoBagCheckOutline } from "react-icons/io5"; // Import checkout icon from react-icons
import { FaHome } from "react-icons/fa"; // Import home icon from react-icons
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe for payment processing
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const Cart = () => {
    // State variables
    const [cartData, setCartData] = useState([]); // State to store cart data
    const [productQuantity, setProductQuantity] = useState(); // State for product quantity
    let [cartFields, setCartFields] = useState({}); // State for cart item details
    const [isLoading, setIsLoading] = useState(false); // State for loading spinner
    const [selectedQuantity, setselectedQuantity] = useState(); // State for selected quantity
    const [chengeQuantity, setchengeQuantity] = useState(0); // State for changing quantity
    const [isLogin, setIsLogin] = useState(false); // State to check if user is logged in

    const context = useContext(MyContext); // Access global context
    const history = useNavigate(); // Hook for navigation

    // Effect to load cart data and check user login status
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on component mount
        const token = localStorage.getItem("token"); // Get token from local storage
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true); // Set login status if token exists
        } else {
            history("/signIn"); // Redirect to sign-in page if not logged in
        }

        const user = JSON.parse(localStorage.getItem("user")); // Get user data from local storage
        fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            setCartData(res); // Set cart data from API response
            setselectedQuantity(res?.quantity); // Set selected quantity
        });
    }, []);

    // Function to handle quantity changes
    const quantity = (val) => {
        setProductQuantity(val); // Update product quantity state
        setchengeQuantity(val); // Update change quantity state
    }

    // Function to handle item selection and update cart
    const selectedItem = (item, quantityVal) => {
        if (chengeQuantity !== 0) {
            setIsLoading(true); // Show loading spinner
            const user = JSON.parse(localStorage.getItem("user")); // Get user data
            cartFields.productTitle = item?.productTitle;
            cartFields.image = item?.image;
            cartFields.rating = item?.rating;
            cartFields.price = item?.price;
            cartFields.quantity = quantityVal;
            cartFields.subTotal = parseInt(item?.price * quantityVal);
            cartFields.productId = item?.id;
            cartFields.userId = user?.userId;

            editData(`/api/cart/${item?._id}`, cartFields).then((res) => {
                setTimeout(() => {
                    setIsLoading(false); // Hide loading spinner
                    const user = JSON.parse(localStorage.getItem("user")); // Get user data
                    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
                        setCartData(res); // Update cart data
                    });
                }, 1000);
            });
        }
    }

    // Function to remove item from cart
    const removeItem = (id) => {
        setIsLoading(true); // Show loading spinner
        deleteData(`/api/cart/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Item removed from cart!" // Show alert message
            });

            const user = JSON.parse(localStorage.getItem("user")); // Get user data
            fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
                setCartData(res); // Update cart data
                setIsLoading(false); // Hide loading spinner
            });

            context.getCartData(); // Refresh cart data in global context
        });
    }

    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <h2 className="hd mb-1">Your Cart</h2>
                    <p>There are <b className="text-red">{cartData?.length}</b> products in your cart</p>

                    {
                        cartData?.length !== 0 ? (
                            <div className="row">
                                <div className="col-md-9 pr-5">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th width="35%">Product</th>
                                                    <th width="15%">Unit Price</th>
                                                    <th width="25%">Quantity</th>
                                                    <th width="15%">Subtotal</th>
                                                    <th width="10%">Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    cartData?.length !== 0 && cartData?.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td width="35%">
                                                                    <Link to={`/product/${item?.productId}`}>
                                                                        <div className="d-flex align-items-center cartItemimgWrapper">
                                                                            <div className="imgWrapper">
                                                                                <img src={item?.image}
                                                                                    className="w-100" alt={item?.productTitle} />
                                                                            </div>

                                                                            <div className="info px-3">
                                                                                <h6>
                                                                                    {item?.productTitle?.substr(0, 30) + '...'}
                                                                                </h6>
                                                                                <Rating name="read-only" value={item?.rating} readOnly size="small" />
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </td>
                                                                <td width="15%">Rs {item?.price}</td>
                                                                <td width="25%">
                                                                    <QuantityBox quantity={quantity} item={item} selectedItem={selectedItem} value={item?.quantity} />
                                                                </td>
                                                                <td width="15%">Rs. {item?.subTotal}</td>
                                                                <td width="10%">
                                                                    <span className="remove" onClick={() => removeItem(item?._id)}>
                                                                        <IoIosClose />
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="card border p-3 cartDetails">
                                        <h4>CART TOTALS</h4>

                                        <div className="d-flex align-items-center mb-3">
                                            <span>Subtotal</span>
                                            <span className="ml-auto text-red font-weight-bold">
                                                {
                                                    (context.cartData?.length !== 0 ?
                                                        context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })
                                                }
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center mb-3">
                                            <span>Shipping</span>
                                            <span className="ml-auto"><b>Free</b></span>
                                        </div>

                                        <div className="d-flex align-items-center mb-3">
                                            <span>Estimate for</span>
                                            <span className="ml-auto"><b>United Kingdom</b></span>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <span>Total</span>
                                            <span className="ml-auto text-red font-weight-bold">
                                                {
                                                    (context.cartData?.length !== 0 ?
                                                        context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })
                                                }
                                            </span>
                                        </div>

                                        <br />
                                        <Link to="/checkout">
                                            <Button className='btn-blue bg-red btn-lg btn-big'>
                                                <IoBagCheckOutline /> &nbsp; Checkout
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty d-flex align-items-center justify-content-center flex-column">
                                <img src={emprtCart} width="150" />
                                <h3>Your Cart is currently empty</h3>
                                <br />
                                <Link to="/">
                                    <Button className='btn-blue bg-red btn-lg btn-big btn-round'>
                                        <FaHome /> &nbsp; Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </section>

            {isLoading === true && <div className="loadingOverlay"></div>} {/* Display loading overlay when data is being fetched */}
        </>
    )
}

export default Cart; // Export Cart component for use in other parts of the application
