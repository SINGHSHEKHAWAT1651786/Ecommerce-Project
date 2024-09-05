import DashboardBox from "./components/dashboardBox";
import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart, IoIosTimer } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { Chart } from "react-google-charts";
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Rating from '@mui/material/Rating';
import { deleteData, fetchDataFromApi } from "../../utils/api";

// Sample data for the chart
export const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
];

// Options for the chart's appearance
export const options = {
    'backgroundColor': 'transparent',
    'chartArea': { 'width': '100%', 'height': '100%' },
};

// Main Dashboard component
const Dashboard = () => {
    // State variables
    const [anchorEl, setAnchorEl] = useState(null); // For menu anchor element
    const [showBy, setshowBy] = useState(8); // Number of items to show per page
    const [showBysetCatBy, setCatBy] = useState(''); // Category filter
    const [productList, setProductList] = useState([]); // List of products
    const [categoryVal, setcategoryVal] = useState('all'); // Category value for filtering

    // Dashboard statistics
    const [totalUsers, setTotalUsers] = useState();
    const [totalOrders, setTotalOrders] = useState();
    const [totalProducts, setTotalProducts] = useState();
    const [totalProductsReviews, setTotalProductsReviews] = useState();
    const [totalSales, setTotalSales] = useState();

    // Open state for menu
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48; // Height for menu items

    // Use context for global state management
    const context = useContext(MyContext);

    // Fetch initial data when component mounts
    useEffect(() => {
        context.setisHideSidebarAndHeader(false); // Show sidebar and header
        window.scrollTo(0, 0); // Scroll to top of the page
        context.setProgress(40); // Set progress bar to 40%

        // Fetch product list
        fetchDataFromApi("/api/products?page=1&perPage=8&location=All").then((res) => {
            setProductList(res);
            context.setProgress(100); // Set progress bar to 100%
        });

        // Fetch total user count
        fetchDataFromApi("/api/user/get/count").then((res) => {
            setTotalUsers(res.userCount);
        });

        // Fetch total order count
        fetchDataFromApi("/api/orders/get/count").then((res) => {
            setTotalOrders(res.orderCount);
        });

        // Calculate total sales
        let sales = 0;
        fetchDataFromApi("/api/orders/").then((res) => {
            res?.length !== 0 && res?.map((item) => {
                sales += parseInt(item.amount);
            });
            setTotalSales(sales);
        });

        // Fetch total products count
        fetchDataFromApi("/api/products/get/count").then((res) => {
            setTotalProducts(res.productsCount);
        });

        // Fetch total product reviews count
        fetchDataFromApi("/api/productReviews/get/count").then((res) => {
            setTotalProductsReviews(res.productsReviews);
        });
    }, [context]);

    // Delete a product by id
    const deleteProduct = (id) => {
        context.setProgress(40);
        deleteData(`/api/products/${id}`).then(() => {
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product Deleted!'
            });
            fetchDataFromApi(`/api/products?page=1&perPage=8&location=All`).then((res) => {
                setProductList(res);
            });
        });
    };

    // Handle pagination change
    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/products?page=${value}&perPage=8&location=All`).then((res) => {
            setProductList(res);
            context.setProgress(100);
        });
    };

    // Handle menu open
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Handle menu close
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle change in items per page
    const showPerPage = (e) => {
        setshowBy(e.target.value);
        fetchDataFromApi(`/api/products?page=1&perPage=${e.target.value}&location=All`).then((res) => {
            setProductList(res);
            context.setProgress(100);
        });
    };

    // Handle category filter change
    const handleChangeCategory = (event) => {
        if (event.target.value !== "all") {
            setcategoryVal(event.target.value);
            fetchDataFromApi(`/api/products/catId?catId=${event.target.value}&location=All`).then((res) => {
                setProductList(res);
                context.setProgress(100);
            });
        }
        if (event.target.value === "all") {
            setcategoryVal(event.target.value);
            fetchDataFromApi(`/api/products?page=1&perPage=8&location=All`).then((res) => {
                setProductList(res);
                context.setProgress(100);
            });
        }
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="row dashboardBoxWrapperRow dashboard_Box dashboardBoxWrapperRowV2">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            {/* Dashboard statistics boxes */}
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow={true} title="Total Users" count={totalUsers} />
                            <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} title="Total Orders" count={totalOrders} />
                            <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} title="Total Products" count={totalProducts} />
                            <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<GiStarsStack />} title="Total Reviews" count={totalProductsReviews} />
                        </div>
                    </div>

                    <div className="col-md-4 pl-0 d-none">
                        <div className="box graphBox">
                            <div className="d-flex align-items-center w-100 bottomEle">
                                <h6 className="text-white mb-0 mt-0">Total Sales</h6>
                            </div>
                            <h3 className="text-white font-weight-bold">
                                {totalSales?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </h3>
                            {/* Sales chart */}
                            <Chart
                                chartType="PieChart"
                                width="100%"
                                height="170px"
                                data={data}
                                options={options}
                            />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>

                    <div className="row cardFilters mt-3">
                        {/* Filter by number of items per page */}
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={showPerPage}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={60}>60</MenuItem>
                                    <MenuItem value={70}>70</MenuItem>
                                </Select>
                                <FormHelperText>Per Page</FormHelperText>
                            </FormControl>
                        </div>

                        {/* Filter by category */}
                        <div className="col-md-3">
                            <h4>CAT BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="category1">Category 1</MenuItem>
                                    <MenuItem value="category2">Category 2</MenuItem>
                                </Select>
                                <FormHelperText>Category</FormHelperText>
                            </FormControl>
                        </div>

                        {/* Pagination */}
                        <div className="col-md-6 text-right">
                            <Pagination
                                count={10}
                                onChange={handleChange}
                                color="primary"
                                className="mt-4"
                            />
                        </div>
                    </div>

                    <div className="table-responsive">
                        {/* Product table */}
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>S.NO</th>
                                    <th>PRODUCT</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>EDIT</th>
                                    <th>DELETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.length !== 0 ? (
                                    productList.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="img">
                                                        <LazyLoadImage
                                                            src={item.images[0].url}
                                                            alt={item.name}
                                                            effect="blur"
                                                            height="80px"
                                                            width="80px"
                                                        />
                                                    </div>
                                                    <div className="content ml-2">
                                                        <p className="mb-0">{item.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${item.price}</td>
                                            <td>{item.stock}</td>
                                            <td>
                                                <Link to={`/admin/edit-product/${item._id}`} className="text-primary">
                                                    <FaPencilAlt />
                                                </Link>
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => deleteProduct(item._id)}
                                                    className="text-danger"
                                                >
                                                    <MdDelete />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No Products Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
