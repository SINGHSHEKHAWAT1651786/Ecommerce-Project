import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MdCategory } from "react-icons/md";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardBox from "../Dashboard/components/dashboardBox";
import Checkbox from "@mui/material/Checkbox";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

// Custom styled breadcrumb for navigation
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const Products = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBy, setShowBy] = useState(8);
  const [categoryVal, setCategoryVal] = useState("all");
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState();
  const [totalCategory, setTotalCategory] = useState();
  const [totalSubCategory, setTotalSubCategory] = useState();
  const [isLoadingBar, setIsLoadingBar] = useState(false);
  const open = Boolean(anchorEl);

  const context = useContext(MyContext);
  const [productList, setProductList] = useState([]);

  const ITEM_HEIGHT = 48;

  useEffect(() => {
    // Fetch initial data
    window.scrollTo(0, 0);
    context.setProgress(40);
    
    // Fetch products for the first page
    fetchDataFromApi("/api/products?page=1&perPage=8&location=All").then(res => {
      setProductList(res);
      context.setProgress(100);
    });

    // Fetch total products count
    fetchDataFromApi("/api/products/get/count").then(res => {
      setTotalProducts(res.productsCount);
    });

    // Fetch total categories count
    fetchDataFromApi("/api/category/get/count").then(res => {
      setTotalCategory(res.categoryCount);
    });

    // Fetch total subcategories count
    fetchDataFromApi("/api/category/subCat/get/count").then(res => {
      setTotalSubCategory(res.categoryCount);
    });
  }, []);

  const deleteProduct = (id) => {
    if (context?.user?.email === "admin9643@gmail.com") {
      context.setProgress(40);
      setIsLoadingBar(true);

      // Delete product and refresh list
      deleteData(`/api/products/${id}`).then(res => {
        context.setProgress(100);
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Product Deleted!",
        });

        fetchDataFromApi(`/api/products?page=${page}&perPage=8&location=All`).then(res => {
          setProductList(res);
        });

        context.fetchCategory();
        setIsLoadingBar(false);
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Only admin can delete Product",
      });
    }
  };

  const handleChange = (event, value) => {
    context.setProgress(40);
    setPage(value);

    // Fetch products for the selected page
    fetchDataFromApi(`/api/products?page=${value}&perPage=8&location=All`).then(res => {
      setProductList(res);
      context.setProgress(100);
      window.scrollTo({
        top: 200,
        behavior: "smooth",
      });
    });
  };

  const showPerPage = (e) => {
    setShowBy(e.target.value);

    // Fetch products for the selected number per page
    fetchDataFromApi(`/api/products?page=${1}&perPage=${e.target.value}&location=All`).then(res => {
      setProductList(res);
      context.setProgress(100);
    });
  };

  const handleChangeCategory = (event) => {
    if (event.target.value !== "all") {
      setCategoryVal(event.target.value);

      // Fetch products by selected category
      fetchDataFromApi(`/api/products/catId?catId=${event.target.value}&location=All`).then(res => {
        setProductList(res);
        context.setProgress(100);
      });
    } else {
      setCategoryVal(event.target.value);

      // Fetch products when "all" category is selected
      fetchDataFromApi(`/api/products?page=${1}&perPage=${8}&location=All`).then(res => {
        setProductList(res);
        context.setProgress(100);
      });
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">Product List</h5>

          <div className="ml-auto d-flex align-items-center">
            <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
              <StyledBreadcrumb component="a" href="#" label="Dashboard" icon={<HomeIcon fontSize="small" />} />
              <StyledBreadcrumb label="Products" deleteIcon={<ExpandMoreIcon />} />
            </Breadcrumbs>

            <Link to="/product/upload">
              <Button className="btn-blue ml-3 pl-3 pr-3">Add Product</Button>
            </Link>
          </div>
        </div>

        <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox color={["#1da256", "#48d483"]} icon={<MdShoppingBag />} title="Total Products" count={totalProducts} grow={true} />
              <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<MdCategory />} title="Total Categories" count={totalCategory} />
              <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<IoShieldCheckmarkSharp />} title="Total Sub Category" count={totalSubCategory} />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Best Selling Products</h3>

          <div className="row cardFilters mt-3">
            <div className="col-md-3">
              <h4>SHOW BY</h4>
              <FormControl size="small" className="w-100">
                <Select value={showBy} onChange={showPerPage} displayEmpty inputProps={{ "aria-label": "Without label" }} labelId="demo-select-small-label" className="w-100">
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={40}>40</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={60}>60</MenuItem>
                  <MenuItem value={70}>70</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="col-md-3">
              <h4>CATEGORY BY</h4>
              <FormControl size="small" className="w-100">
                <Select value={categoryVal} onChange={handleChangeCategory} displayEmpty inputProps={{ "aria-label": "Without label" }} className="w-100">
                  <MenuItem value="all"><em value={"all"}>All</em></MenuItem>
                  {context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => (
                    <MenuItem className="text-capitalize" value={cat._id} key={index}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="row mt-4">
            {productList?.map((item, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                <div className="productBox card shadow">
                  <div className="productImage">
                    <Link to={`/product/${item._id}`}>
                      <LazyLoadImage effect="blur" src={item.images[0]?.url} alt="" />
                    </Link>
                    <div className="productRating">
                      <Rating name="read-only" value={item.rating} readOnly />
                    </div>
                    <div className="productActions">
                      <Link to={`/product/${item._id}`}><FaEye className="productActionIcon" /></Link>
                      <Link to={`/product/edit/${item._id}`}><FaPencilAlt className="productActionIcon" /></Link>
                      <MdDelete className="productActionIcon" onClick={() => deleteProduct(item._id)} />
                    </div>
                  </div>
                  <div className="productInfo">
                    <h5>{item.name}</h5>
                    <p className="productPrice">₹ {item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {productList.length === 0 && <div className="text-center">No Products Found</div>}

          <div className="paginationWrapper mt-4">
            <Pagination count={Math.ceil(totalProducts / showBy)} page={page} onChange={handleChange} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
