import React, { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]); // State for storing orders
    const [products, setProducts] = useState([]); // State for storing products in an order
    const [page, setPage] = useState(1); // State for pagination
    const [isOpenModal, setIsOpenModal] = useState(false); // State for modal visibility
    const [isLogin, setIsLogin] = useState(false); // State for user login status

    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on mount

        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true); // User is logged in
        } else {
            navigate("/signIn"); // Redirect to sign-in page if not logged in
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/orders?userid=${user?.userId}`).then((res) => {
            setOrders(res); // Set the fetched orders
        });
    }, [navigate]);

    // Function to show products in a specific order
    const showProducts = (id) => {
        fetchDataFromApi(`/api/orders/${id}`).then((res) => {
            setIsOpenModal(true);
            setProducts(res.products); // Set the products for the selected order
        });
    };

    return (
        <>
            <section className="section">
                <div className='container'>
                    <h2 className='hd'>Orders</h2>

                    <div className='table-responsive orderTable'>
                        <table className='table table-striped table-bordered'>
                            <thead className='thead-light'>
                                <tr>
                                    <th>Payment Id</th>
                                    <th>Products</th>
                                    <th>Name</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>Pincode</th>
                                    <th>Total Amount</th>
                                    <th>Email</th>
                                    <th>User Id</th>
                                    <th>Order Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={index}>
                                            <td><span className='text-blue font-weight-bold'>{order?.paymentId}</span></td>
                                            <td>
                                                <span
                                                    className='text-blue font-weight-bold cursor-pointer'
                                                    onClick={() => showProducts(order?._id)}
                                                >
                                                    Click here to view
                                                </span>
                                            </td>
                                            <td>{order?.name}</td>
                                            <td>{order?.phoneNumber}</td>
                                            <td>{order?.address}</td>
                                            <td>{order?.pincode}</td>
                                            <td>{order?.amount}</td>
                                            <td>{order?.email}</td>
                                            <td>{order?.userid}</td>
                                            <td>
                                                {order?.status === "pending" ? (
                                                    <span className='badge badge-danger'>{order?.status}</span>
                                                ) : (
                                                    <span className='badge badge-success'>{order?.status}</span>
                                                )}
                                            </td>
                                            <td>{order?.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No Orders Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Modal for displaying products in an order */}
            <Dialog open={isOpenModal} onClose={() => setIsOpenModal(false)} className="productModal">
                <Button className='close_' onClick={() => setIsOpenModal(false)}>
                    <MdClose />
                </Button>
                <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>

                <div className='table-responsive orderTable'>
                    <table className='table table-striped table-bordered'>
                        <thead className='thead-light'>
                            <tr>
                                <th>Product Id</th>
                                <th>Product Title</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>SubTotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <tr key={item?.productId}>
                                        <td>{item?.productId}</td>
                                        <td style={{ whiteSpace: "inherit" }}>
                                            <span>{item?.productTitle?.substr(0, 30) + '...'}</span>
                                        </td>
                                        <td>
                                            <div className='img'>
                                                <img src={item?.image} alt={item?.productTitle} />
                                            </div>
                                        </td>
                                        <td>{item?.quantity}</td>
                                        <td>{item?.price}</td>
                                        <td>{item?.subTotal}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No Products Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Dialog>
        </>
    );
}

export default Orders;
