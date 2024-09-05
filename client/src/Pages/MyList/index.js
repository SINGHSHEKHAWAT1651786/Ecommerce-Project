import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import { IoIosClose } from "react-icons/io";
import Button from '@mui/material/Button';

import emprtCart from '../../assets/images/myList.png';
import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const MyList = () => {

    // State variables
    const [myListData, setMyListData] = useState([]); // Stores the user's list of items
    const [isLoading, setIsLoading] = useState(false); // Loading state for data fetching
    const context = useContext(MyContext); // Context for alert messages
    const [isLogin, setIsLogin] = useState(false); // State to check if the user is logged in

    const history = useNavigate(); // Hook for navigation

    // Fetch data on component mount
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on mount
        
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true); // User is logged in
        } else {
            history("/signIn"); // Redirect to sign-in page if not logged in
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res) => {
            setMyListData(res); // Set the fetched list data
        });
    }, [history]);

    // Function to remove an item from the list
    const removeItem = (id) => {
        setIsLoading(true); // Set loading state
        deleteData(`/api/my-list/${id}`).then(() => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Item removed from My List!",
            });

            const user = JSON.parse(localStorage.getItem("user"));
            fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res) => {
                setMyListData(res); // Update the list data after removal
                setIsLoading(false); // Reset loading state
            });
        });
    };

    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <div className="myListTableWrapper">
                        <h2 className="hd mb-1">My List</h2>
                        <p>There are <b className="text-red">{myListData?.length}</b> products in your My List</p>
                        {
                            myListData?.length !== 0 ?
                                <div className="row">
                                    <div className="col-md-12 pr-5">
                                        <div className="table-responsive myListTable">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th width="50%">Product</th>
                                                        <th width="15%">Unit Price</th>
                                                        <th width="10%">Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        myListData.map((item) => (
                                                            <tr key={item?._id}>
                                                                <td width="50%">
                                                                    <Link to={`/product/${item?.productId}`}>
                                                                        <div className="d-flex align-items-center cartItemimgWrapper">
                                                                            <div className="imgWrapper">
                                                                                <img src={item?.image} className="w-100" alt={item?.productTitle} />
                                                                            </div>
                                                                            <div className="info px-3">
                                                                                <h6>{item?.productTitle}</h6>
                                                                                <Rating name="read-only" value={item?.rating} readOnly size="small" />
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </td>
                                                                <td width="15%">Rs {item?.price}</td>
                                                                <td width="10%">
                                                                    <span className="remove" onClick={() => removeItem(item?._id)}>
                                                                        <IoIosClose />
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="empty d-flex align-items-center justify-content-center flex-column">
                                    <img src={emprtCart} width="150" alt="Empty List" />
                                    <h3>My List is currently empty</h3>
                                    <br />
                                    <Link to="/">
                                        <Button className='btn-blue bg-red btn-lg btn-big btn-round'>
                                            <FaHome /> &nbsp; Continue Shopping
                                        </Button>
                                    </Link>
                                </div>
                        }
                    </div>
                </div>
            </section>

            {isLoading && <div className="loadingOverlay"></div>} {/* Display loading overlay if data is being fetched */}
        </>
    );
}

export default MyList;
