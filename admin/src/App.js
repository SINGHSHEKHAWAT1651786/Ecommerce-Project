// Import necessary modules and components from React, React Router, Bootstrap, and other libraries
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";  // Import Bootstrap CSS
import './App.css';  // Import custom styles
import Dashboard from './pages/Dashboard';  // Import Dashboard component
import Header from './components/Header';  // Import Header component
import Sidebar from './components/Sidebar';  // Import Sidebar component
import React, { createContext, useEffect, useState, useRef } from 'react';  // Import React and its hooks
import Login from './pages/Login';  // Import Login component
import SignUp from './pages/SignUp';  // Import SignUp component
import Products from './pages/Products';  // Import Products component
import Category from './pages/Category/categoryList';  // Import Category List component
import ProductDetails from './pages/ProductDetails';  // Import Product Details component
import ProductUpload from './pages/Products/addProduct';  // Import Add Product component
import EditProduct from './pages/Products/editProduct';  // Import Edit Product component
import CategoryAdd from "./pages/Category/addCategory";  // Import Add Category component
import EditCategory from "./pages/Category/editCategory";  // Import Edit Category component
import SubCatAdd from "./pages/Category/addSubCat";  // Import Add Sub-Category component
import SubCatList from "./pages/Category/subCategoryList";  // Import Sub-Category List component
import AddProductRAMS from "./pages/Products/addProductRAMS";  // Import Add Product RAMS component
import ProductWeight from "./pages/Products/addProductWeight";  // Import Add Product Weight component
import ProductSize from './pages/Products/addProductSize';  // Import Add Product Size component
import Orders from './pages/Orders';  // Import Orders component
import AddHomeBannerSlide from './pages/HomeBanner/addHomeSlide';  // Import Add Home Banner Slide component
import HomeBannerSlideList from './pages/HomeBanner/homeSlideList';  // Import Home Banner Slide List component
import EditHomeBannerSlide from './pages/HomeBanner/editSlide';  // Import Edit Home Banner Slide component
import Snackbar from '@mui/material/Snackbar';  // Import Snackbar from MUI
import Alert from '@mui/material/Alert';  // Import Alert from MUI

import LoadingBar from 'react-top-loading-bar';  // Import Loading Bar
import { fetchDataFromApi } from './utils/api';  // Import fetchDataFromApi utility function

import axios from 'axios';  // Import axios for HTTP requests

// Create a context to manage global state across components
const MyContext = createContext();

function App() {
  // State for toggling sidebar visibility
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  // State for managing user login status
  const [isLogin, setIsLogin] = useState(false);
  // State for hiding or showing Sidebar and Header
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  // State for managing theme (light or dark)
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  // State for storing category data
  const [catData, setCatData] = useState([]);
  // State for storing user information
  const [user, setUser] = useState({
    name:"",
    email:"",
    userId:""
  });
  
  // State for storing base URL of the API
  const [baseUrl, setBaseUrl] = useState("http://localhost:4000");

  // State for managing progress bar value
  const [progress, setProgress] = useState(0);
  // State for managing alert box messages and visibility
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  });

  // State for selected location and country list
  const [selectedLocation, setSelectedLocation] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');

  // Effect to apply the selected theme (light or dark)
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Effect to check login status from localStorage and set user data accordingly
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }, [isLogin, localStorage.getItem("user")]);

  // Effect to fetch country data on component mount
  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

  // Function to fetch country data from the API
  const getCountry = async (url) => {
    const response = await axios.get(url).then((res) => {
      setCountryList(res.data.data);
    });
  };

  // Function to handle closing the alert box
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertBox({
      open: false
    });
  };

  // Effect to fetch category data and update the progress bar
  useEffect(() => {
    setProgress(20);
    fetchCategory();
  }, []);

  // Function to fetch category data from the API
  const fetchCategory = () => {
    fetchDataFromApi('/api/category').then((res) => {
      setCatData(res);
      setProgress(100);
    });
  };

  // Values to be provided to components via context
  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    setUser,
    user,
    countryList,
    selectedCountry,
    setselectedCountry
  };

  // Return the main app layout with Router, Context, and Routes setup
  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {/* Loading bar displayed at the top of the page */}
        <LoadingBar
          color='#f11946'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className='topLoadingBar'
        />

        {/* Snackbar for alert messages */}
        <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            autoHideDuration={6000}
            severity={alertBox.error === false ? "success" : 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>

        {/* Conditionally render Header and Sidebar based on state */}
        {
          isHideSidebarAndHeader !== true &&
          <Header />
        }
        <div className='main d-flex'>
          {
            isHideSidebarAndHeader !== true &&
            <div className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : ''}`}>
              <Sidebar />
            </div>
          }

          {/* Main content area with routes */}
          <div className={`content ${isHideSidebarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}>
            <Routes>
              <Route path="/" exact={true} element={<Dashboard />} />
              <Route path="/dashboard" exact={true} element={<Dashboard />} />
              <Route path="/login" exact={true} element={<Login />} />
              <Route path="/signUp" exact={true} element={<SignUp />} />
              <Route path="/products" exact={true} element={<Products />} />
              <Route path="/product/details/:id" exact={true} element={<ProductDetails />} />
              <Route path="/product/upload" exact={true} element={<ProductUpload />} />
              <Route path="/product/edit/:id" exact={true} element={<EditProduct />} />
              <Route path="/category" exact={true} element={<Category />} />
              <Route path="/category/add" exact={true} element={<CategoryAdd />} />
              <Route path="/category/edit/:id" exact={true} element={<EditCategory />} />
              <Route path="/subCategory/" exact={true} element={<SubCatList />} />
              <Route path="/subCategory/add" exact={true} element={<SubCatAdd />} />
              <Route path="/productRAMS/add" exact={true} element={<AddProductRAMS />} />
              <Route path="/productWEIGHT/add" exact={true} element={<ProductWeight />} />
              <Route path="/productSIZE/add" exact={true} element={<ProductSize />} />
              <Route path="/orders/" exact={true} element={<Orders />} />
              <Route path="/addHomeBannerSlide/" exact={true} element={<AddHomeBannerSlide />} />
              <Route path="/homeBannerSlideList/" exact={true} element={<HomeBannerSlideList />} />
              <Route path="/editHomeBannerSlide/:id" exact={true} element={<EditHomeBannerSlide />} />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

// Export the MyContext for use in other components
export { MyContext };

// Export the App component as the default export
export default App;
