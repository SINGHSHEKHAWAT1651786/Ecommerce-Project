// Importing necessary components and libraries
import Sidebar from "../../Components/Sidebar"; // Sidebar component for navigation and filtering
import Button from '@mui/material/Button'; // MUI Button component
import { IoIosMenu } from "react-icons/io"; // Icon for menu view
import { CgMenuGridR } from "react-icons/cg"; // Icon for grid view
import { HiViewGrid } from "react-icons/hi"; // Another grid view icon
import { TfiLayoutGrid4Alt } from "react-icons/tfi"; // Icon for a different grid layout
import { FaAngleDown } from "react-icons/fa6"; // Icon for dropdown arrow
import Menu from '@mui/material/Menu'; // MUI Menu component for dropdown menus
import MenuItem from '@mui/material/MenuItem'; // MUI MenuItem component for menu items
import { useContext, useEffect, useState } from "react"; // React hooks
import ProductItem from "../../Components/ProductItem"; // Component to display individual products
import Pagination from '@mui/material/Pagination'; // MUI Pagination component (not used in this snippet)
import { useParams } from "react-router-dom"; // Hook to access URL parameters
import { fetchDataFromApi } from "../../utils/api"; // Utility function for API calls
import CircularProgress from '@mui/material/CircularProgress'; // MUI CircularProgress for loading spinner
import { FaFilter } from "react-icons/fa"; // Icon for filter functionality
import { MyContext } from "../../App"; // Context for global state management

const SearchPage = () => {

    // State management
    const [anchorEl, setAnchorEl] = useState(null); // State to manage dropdown menu anchor
    const [productView, setProductView] = useState('four'); // State to manage the view of products (grid/list)
    const [productData, setProductData] = useState([]); // State to store product data
    const [isLoading, setisLoading] = useState(false); // State to manage loading state
    const openDropdown = Boolean(anchorEl); // Boolean state to check if dropdown is open
    const [isOpenFilter, setIsOpenFilter] = useState(false); // State to manage filter visibility

    // Context to access global state
    const context = useContext(MyContext);

    // Event handler for opening dropdown menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Event handler for closing dropdown menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // useEffect hook to handle side effects
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on component mount
        setisLoading(true); // Set loading state to true
        setTimeout(() => {
            setProductData(context.searchData); // Set product data from context
            setisLoading(false); // Set loading state to false
        }, 3000); // Simulate loading delay
    }, [context.searchData]); // Dependency array ensures effect runs when searchData changes

    // Function to filter data based on sub-category ID
    const filterData = (subCatId) => {
        setisLoading(true); // Set loading state to true
        fetchDataFromApi(`/api/products?subCatId=${subCatId}`).then((res) => {
            setProductData(res.products); // Update product data with filtered results
            setisLoading(false); // Set loading state to false
        });
    };

    // Function to filter data based on price range
    const filterByPrice = (price, subCatId) => {
        setisLoading(true); // Set loading state to true
        fetchDataFromApi(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products); // Update product data with filtered results
            setisLoading(false); // Set loading state to false
        });
    };

    // Function to filter data based on rating
    const filterByRating = (rating, subCatId) => {
        setisLoading(true); // Set loading state to true
        fetchDataFromApi(`/api/products?rating=${rating}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products); // Update product data with filtered results
            setisLoading(false); // Set loading state to false
        });
    };

    // Function to toggle filter visibility
    const openFilters = () => {
        setIsOpenFilter(!isOpenFilter); // Toggle filter state
    };

    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        {/* Sidebar component for filtering */}
                        <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} isOpenFilter={isOpenFilter} />

                        <div className="content_right">
                            {/* Controls for product view and filtering options */}
                            <div className="showBy mt-0 mb-3 d-flex align-items-center">
                                <div className="d-flex align-items-center btnWrapper">
                                    <Button className={productView === 'one' && 'act'} onClick={() => setProductView('one')}><IoIosMenu /></Button>
                                    <Button className={productView === 'three' && 'act'} onClick={() => setProductView('three')}><CgMenuGridR /></Button>
                                    <Button className={productView === 'four' && 'act'} onClick={() => setProductView('four')}><TfiLayoutGrid4Alt /></Button>
                                </div>

                                <div className="ml-auto showByFilter">
                                    {/* Button to open dropdown for selecting number of items to show */}
                                    <Button onClick={handleClick}>Show 9 <FaAngleDown /></Button>
                                    <Menu
                                        className="w-100 showPerPageDropdown"
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropdown}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>10</MenuItem>
                                        <MenuItem onClick={handleClose}>20</MenuItem>
                                        <MenuItem onClick={handleClose}>30</MenuItem>
                                        <MenuItem onClick={handleClose}>40</MenuItem>
                                        <MenuItem onClick={handleClose}>50</MenuItem>
                                        <MenuItem onClick={handleClose}>60</MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            {/* Product listing section */}
                            <div className="productListing">
                                {
                                    isLoading ? // Show loading spinner if data is being fetched
                                        <div className="loading d-flex align-items-center justify-content-center">
                                            <CircularProgress color="inherit" />
                                        </div>
                                        :
                                        <>
                                            {
                                                productData?.length !== 0 && productData?.map((item, index) => {
                                                    return (
                                                        <ProductItem key={index} itemView={productView} item={item} />
                                                    );
                                                })
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conditional rendering for filter button on mobile view */}
            {
                context.windowWidth < 992 &&
                <>
                    {
                        context.isOpenNav === false &&
                        <div className="fixedBtn row">
                            <div className="col">
                                <Button className='btn-blue bg-red btn-lg btn-big' onClick={openFilters}>
                                    <FaFilter />
                                    {isOpenFilter ? 'Close Filters' : 'Open Filters'}
                                </Button>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default SearchPage;
