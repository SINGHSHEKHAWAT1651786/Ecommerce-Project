import Sidebar from "../../Components/Sidebar"; // Import Sidebar component
import Button from "@mui/material/Button"; // Import MUI Button component
import { IoIosMenu } from "react-icons/io"; // Import menu icon from react-icons
import { CgMenuGridR } from "react-icons/cg"; // Import grid menu icon from react-icons
import { HiViewGrid } from "react-icons/hi"; // Import view grid icon from react-icons
import { TfiLayoutGrid4Alt } from "react-icons/tfi"; // Import layout grid icon from react-icons
import { FaAngleDown } from "react-icons/fa6"; // Import angle down icon from react-icons
import Menu from "@mui/material/Menu"; // Import MUI Menu component
import MenuItem from "@mui/material/MenuItem"; // Import MUI MenuItem component
import { useContext, useEffect, useState } from "react"; // Import React hooks
import ProductItem from "../../Components/ProductItem"; // Import ProductItem component

import { useNavigate, useParams } from "react-router-dom"; // Import React Router hooks
import { fetchDataFromApi } from "../../utils/api"; // Import API utility function
import CircularProgress from "@mui/material/CircularProgress"; // Import MUI CircularProgress component
import { FaFilter } from "react-icons/fa"; // Import filter icon from react-icons

import { MyContext } from "../../App"; // Import context from App

const Listing = () => {
  // State variables
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown anchor element
  const [productView, setProductView] = useState("four"); // State for product view type
  const [productData, setProductData] = useState([]); // State for product data
  const [isLoading, setisLoading] = useState(false); // State for loading status
  const [filterId, setFilterId] = useState(""); // State for filter ID

  const [isOpenFilter, setIsOpenFilter] = useState(false); // State for filter visibility
  const history = useNavigate(); // Hook for navigation

  const openDropdown = Boolean(anchorEl); // Boolean for dropdown visibility

  const context = useContext(MyContext); // Use context for global state

  const { id } = useParams(); // Get URL parameter

  useEffect(() => {
    // Effect to fetch product data on component mount or ID change
    window.scrollTo(0, 0); // Scroll to top of the page
    setFilterId(""); // Reset filter ID

    let url = window.location.href; // Get current URL
    let apiEndPoint = ""; // Initialize API endpoint

    // Set API endpoint based on URL
    if (url.includes("subCat")) {
      apiEndPoint = `/api/products/subCatId?subCatId=${id}&location=${localStorage.getItem("location")}`;
    }
    if (url.includes("category")) {
      apiEndPoint = `/api/products/catId?catId=${id}&location=${localStorage.getItem("location")}`;
    }

    setisLoading(true); // Set loading status to true
    fetchDataFromApi(`${apiEndPoint}`).then((res) => {
      setProductData(res); // Update product data
      setisLoading(false); // Set loading status to false
    });
  }, [id]); // Depend on ID

  const handleChangePage = (event, value) => {
    // Function to handle page change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    let url = window.location.href; // Get current URL
    let apiEndPoint = ""; // Initialize API endpoint

    // Set API endpoint based on URL
    if (url.includes("subCat")) {
      apiEndPoint = `/api/products/subCatId?subCatId=${id}&location=${localStorage.getItem("location")}&page=${value}&perPage=8`;
    }
    if (url.includes("category")) {
      apiEndPoint = `/api/products/catId?catId=${id}&location=${localStorage.getItem("location")}&page=${value}&perPage=8`;
    }

    setisLoading(true); // Set loading status to true
    fetchDataFromApi(`${apiEndPoint}`).then((res) => {
      setProductData(res); // Update product data
      setisLoading(false); // Set loading status to false
    });
  };

  const filterData = (subCatId) => {
    // Function to filter data by subcategory
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    history(`/products/subCat/${subCatId}`); // Navigate to filtered subcategory
  };

  const filterByPrice = (price, subCatId) => {
    // Function to filter data by price
    var window_url = window.location.href; // Get current URL
    var api_EndPoint = ""; // Initialize API endpoint

    // Set API endpoint based on URL
    if (window_url.includes("subCat")) {
      api_EndPoint = `/api/products/fiterByPrice?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${id}&location=${localStorage.getItem("location")}`;
    }
    if (window_url.includes("category")) {
      api_EndPoint = `/api/products/fiterByPrice?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${id}&location=${localStorage.getItem("location")}`;
    }

    setisLoading(true); // Set loading status to true

    fetchDataFromApi(api_EndPoint).then((res) => {
      setProductData(res); // Update product data
      setisLoading(false); // Set loading status to false
    });
  };

  const filterByRating = (rating, subCatId) => {
    // Function to filter data by rating
    setisLoading(true); // Set loading status to true
    let url = window.location.href; // Get current URL
    let apiEndPoint = ""; // Initialize API endpoint

    // Set API endpoint based on URL
    if (url.includes("subCat")) {
      apiEndPoint = `/api/products/rating?rating=${rating}&subCatId=${id}&location=${localStorage.getItem("location")}`;
    }
    if (url.includes("category")) {
      apiEndPoint = `/api/products/rating?rating=${rating}&catId=${id}&location=${localStorage.getItem("location")}`;
    }

    fetchDataFromApi(apiEndPoint).then((res) => {
      setProductData(res); // Update product data
      setisLoading(false); // Set loading status to false
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const handleChange = (event, value) => {
    // Function to handle pagination change
    setisLoading(true); // Set loading status to true
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchDataFromApi(
      `/api/products?subCatId=${id}&page=${value}&perPage=6&location=${localStorage.getItem("location")}`
    ).then((res) => {
      setProductData(res); // Update product data
      setisLoading(false); // Set loading status to false
    });
  };

  const openFilters = () => {
    // Function to toggle filter visibility
    setIsOpenFilter(!isOpenFilter);
  };

  return (
    <>
      <section className="product_Listing_Page pt-5">
        <div className="container">
          <div className="productListing d-flex">
            <Sidebar
              filterData={filterData}
              filterByPrice={filterByPrice}
              filterByRating={filterByRating}
              isOpenFilter={isOpenFilter}
            />

            <div className="content_right">
              <div className="showBy mt-0 mb-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  {/* Buttons to switch product view type */}
                  <Button
                    className={productView === "one" && "act"}
                    onClick={() => setProductView("one")}
                  >
                    <IoIosMenu />
                  </Button>

                  <Button
                    className={productView === "three" && "act"}
                    onClick={() => setProductView("three")}
                  >
                    <CgMenuGridR />
                  </Button>
                  <Button
                    className={productView === "four" && "act"}
                    onClick={() => setProductView("four")}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>
              </div>

              <div className="productListing">
                {isLoading === true ? (
                  <div className="loading d-flex align-items-center justify-content-center">
                    <CircularProgress color="inherit" /> {/* Loading spinner */}
                  </div>
                ) : (
                  <>
                    {productData?.products?.slice(0)
                      .reverse().map((item, index) => {
                      return (
                        <ProductItem
                          key={index}
                          itemView={productView}
                          item={item}
                        />
                      );
                    })}
                  </>
                )}
              </div>
              
              
            </div>
          </div>
        </div>
      </section>

      {context.windowWidth < 992 && (
        <>
          {context.isOpenNav === false && (
            <div className="fixedBtn row">
              <div className="col">
                <Button
                  className="btn-blue bg-red btn-lg btn-big"
                  onClick={openFilters}
                >
                  <FaFilter />
                  {isOpenFilter === true ? "Close Filters" : "Open Filters"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Listing;
