import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoBagCheckOutline } from "react-icons/io5";

import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';

import { useNavigate } from 'react-router-dom';

// Checkout component handles the checkout process including form handling and payment processing
const Checkout = () => {

    // State to store form field values
    const [formFields, setFormFields] = useState({
        fullName: "",
        country: "",
        streetAddressLine1: "",
        streetAddressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: ""
    });

    // State to store cart data and total amount
    const [cartData, setCartData] = useState([]);
    const [totalAmount, setTotalAmount] = useState();

    // Effect to fetch cart data and calculate total amount
    useEffect(() => {
        window.scrollTo(0,0);
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            setCartData(res);

            // Calculate the total amount
            setTotalAmount(res.length !== 0 &&
                res.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0));
        });

    }, []);

    // Handler for form input changes
    const onChangeInput = (e) => {
        setFormFields(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const context = useContext(MyContext); // Context for alert messages
    const history = useNavigate(); // Hook for navigation

    // Handler for checkout form submission
    const checkout = (e) => {

        e.preventDefault();

        // Validate form fields
        if (formFields.fullName === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill full name "
            });
            return false;
        }

        if (formFields.country === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill country "
            });
            return false;
        }

        if (formFields.streetAddressLine1 === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill Street address"
            });
            return false;
        }

        if (formFields.streetAddressLine2 === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill  Street address"
            });
            return false;
        }

        if (formFields.city === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill city "
            });
            return false;
        }

        if (formFields.state === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill state "
            });
            return false;
        }

        if (formFields.zipCode === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill zipCode "
            });
            return false;
        }

        if (formFields.phoneNumber === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill phone Number "
            });
            return false;
        }

        if (formFields.email === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill email"
            });
            return false;
        }

        // Create address info for the payment
        const addressInfo = {
            name: formFields.fullName,
            phoneNumber: formFields.phoneNumber,
            address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
            pincode: formFields.zipCode,
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
        };

        // Razorpay payment options
        var options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
            amount: parseInt(totalAmount * 100),
            currency: "INR",
            order_receipt: 'order_rcptid_' + formFields.fullName,
            name: "E-Bharat",
            description: "for testing purpose",
            handler: function (response) {

                console.log(response);

                const paymentId = response.razorpay_payment_id;
                const user = JSON.parse(localStorage.getItem("user"));

                const payLoad = {
                    name: addressInfo.name,
                    phoneNumber: formFields.phoneNumber,
                    address: addressInfo.address,
                    pincode: addressInfo.pincode,
                    amount: parseInt(totalAmount * 100),
                    paymentId: paymentId,
                    email: user.email,
                    userid: user.userId,
                    products: cartData
                };

                // Post order data to server
                postData(`/api/orders/create`, payLoad).then(res => {
                    history("/orders"); // Navigate to orders page
                });
            },
            theme: {
                color: "#3399cc"
            }
        };

        // Initialize Razorpay payment
        var pay = new window.Razorpay(options);
        pay.open();
    };

    return (
        <section className='section'>
            <div className='container'>
                <form className='checkoutForm' onSubmit={checkout}>
                    <div className='row'>
                        <div className='col-md-8'>
                            <h2 className='hd'>BILLING DETAILS</h2>

                            {/* Form fields for billing details */}
                            <div className='row mt-3'>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField label="Full Name *" variant="outlined" className='w-100' size="small" name="fullName" onChange={onChangeInput} />
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField label="Country *" variant="outlined" className='w-100' size="small" name="country" onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <h6>Street address *</h6>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label="House number and street name" variant="outlined" className='w-100' size="small" name="streetAddressLine1" onChange={onChangeInput} />
                                    </div>

                                    <div className='form-group'>
                                        <TextField label="Apartment, suite, unit, etc. (optional)" variant="outlined" className='w-100' size="small" name="streetAddressLine2" onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <h6>Town / City *</h6>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label="City" variant="outlined" className='w-100' size="small" name="city" onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <h6>State / County *</h6>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label="State" variant="outlined" className='w-100' size="small" name="state" onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <h6>Postcode / ZIP *</h6>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label="ZIP Code" variant="outlined" className='w-100' size="small" name="zipCode" onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField label="Phone Number" variant="outlined" className='w-100' size="small" name="phoneNumber" onChange={onChangeInput} />
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField label="Email Address" variant="outlined" className='w-100' size="small" name="email" onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className='col-md-4'>
                            <div className='card orderInfo'>
                                <h4 className='hd'>YOUR ORDER</h4>
                                <div className='table-responsive mt-3'>
                                    <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name} (x{item.quantity})</td>
                                                    <td>₹{item.price * item.quantity}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td>Subtotal</td>
                                                <td>₹{totalAmount}</td>
                                            </tr>
                                            <tr>
                                                <td>Shipping</td>
                                                <td>Free</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total</strong></td>
                                                <td><strong>₹{totalAmount}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Checkout button */}
                                <Button variant="contained" color="primary" fullWidth type="submit">
                                    <IoBagCheckOutline /> Check Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Checkout;
