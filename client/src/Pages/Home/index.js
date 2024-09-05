import HomeBanner from "../../Components/HomeBanner"; // Import the HomeBanner component
import banner1 from "../../assets/images/banner1.jpg"; // Import image for the first banner
import banner2 from "../../assets/images/banner2.jpg"; // Import image for the second banner
import Button from "@mui/material/Button"; // Import MUI Button component
import { IoIosArrowRoundForward } from "react-icons/io"; // Import icon for forward arrow
import React, { useContext, useEffect, useState } from "react"; // Import React and hooks
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components for carousel
import "swiper/css"; // Import Swiper CSS
import "swiper/css/navigation"; // Import Swiper navigation CSS
import { Navigation } from "swiper/modules"; // Import Navigation module for Swiper
import ProductItem from "../../Components/ProductItem"; // Import ProductItem component
import HomeCat from "../../Components/HomeCat"; // Import HomeCat component

import banner3 from "../../assets/images/banner3.jpg"; // Import image for the third banner
import banner4 from "../../assets/images/banner4.jpg"; // Import image for the fourth banner

import { MyContext } from "../../App"; // Import MyContext from App component
import { fetchDataFromApi } from "../../utils/api"; // Import function to fetch data from API
import Tabs from "@mui/material/Tabs"; // Import MUI Tabs component
import Tab from "@mui/material/Tab"; // Import MUI Tab component

const Home = () => {
  // State for featured products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // State for general products data
  const [productsData, setProductsData] = useState([]);
  // State for selected category
  const [selectedCat, setselectedCat] = useState();
  // State for filtered products based on selected category
  const [filterData, setFilterData] = useState([]);
  // State for home slide banners
  const [homeSlides, setHomeSlides] = useState([]);

  // State for active tab index
  const [value, setValue] = React.useState(0);

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Access context from MyContext
  const context = useContext(MyContext);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Set selected category when a category is selected
  const selectCat = (cat) => {
    setselectedCat(cat);
  };

  // Fetch data on component mount
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top of page
    context.setisHeaderFooterShow(true); // Show header and footer
    setselectedCat(context.categoryData[0]?.name); // Set default category to the first category

    const location = localStorage.getItem("location"); // Get location from local storage

    if (location !== null && location !== "" && location !== undefined) {
      // Fetch featured products based on location
      fetchDataFromApi(`/api/products/featured?location=${location}`).then((res) => {
        setFeaturedProducts(res);
      });

      // Fetch general products data based on location
      fetchDataFromApi(`/api/products?page=1&perPage=8&location=${location}`).then((res) => {
        setProductsData(res);
      });
    }

    // Fetch home slide banners
    fetchDataFromApi("/api/homeBanner").then((res) => {
      setHomeSlides(res);
    });
  }, []);

  // Update selected category when categoryData changes
  useEffect(() => {
    if (context.categoryData[0] !== undefined)
      setselectedCat(context.categoryData[0].name);
  }, [context.categoryData]);

  // Fetch filtered data based on selected category
  useEffect(() => {
    if (selectedCat !== undefined) {
      setIsLoading(true);
      const location = localStorage.getItem("location");
      fetchDataFromApi(`/api/products/catName?catName=${selectedCat}&location=${location}`).then((res) => {
        setFilterData(res.products);
        setIsLoading(false);
      });
    }
  }, [selectedCat]);

  return (
    <>
      {/* Render HomeBanner if there are homeSlides */}
      {homeSlides?.length !== 0 && <HomeBanner data={homeSlides} />}

      {/* Render HomeCat if there are categoryData */}
      {context.categoryData?.length !== 0 && (
        <HomeCat catData={context.categoryData} />
      )}

      <section className="homeProducts">
        <div className="container">
          <div className="row homeProductsRow">
            <div className="col-md-3">
              <div className="sticky">
                {/* Render banner images */}
                <div className="banner">
                  <img src={banner1} className="cursor w-100" />
                </div>

                <div className="banner mt-4">
                  <img src={banner2} className="cursor w-100" />
                </div>
              </div>
            </div>

            <div className="col-md-9 productRow">
              <div className="d-flex align-items-center res-flex-column">
                <div className="info" style={{ width: "35%" }}>
                  <h3 className="mb-0 hd">Popular Products</h3>
                  <p className="text-light text-sml mb-0">
                    Do not miss the current offers until the end of March.
                  </p>
                </div>

                <div
                  className="ml-auto d-flex align-items-center justify-content-end res-full"
                  style={{ width: "65%" }}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="filterTabs"
                  >
                    {/* Render tabs for categories */}
                    {context.categoryData?.map((item, index) => {
                      return (
                        <Tab
                          className="item"
                          label={item.name}
                          onClick={() => selectCat(item.name)}
                        />
                      );
                    })}
                  </Tabs>
                </div>
              </div>

              <div
                className="product_row w-100 mt-2"
                style={{ opacity: `${isLoading === true ? "0.5" : "1"}` }}
              >
                {/* Render products based on screen width */}
                {context.windowWidth > 992 ? (
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={0}
                    navigation={true}
                    slidesPerGroup={context.windowWidth > 992 ? 3 : 1}
                    modules={[Navigation]}
                    className="mySwiper"
                  >
                    {filterData?.length !== 0 &&
                      filterData
                        ?.slice(0)
                        ?.reverse()
                        ?.map((item, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <ProductItem item={item} />
                            </SwiperSlide>
                          );
                        })}
                  </Swiper>
                ) : (
                  <div className="productScroller">
                    {filterData?.length !== 0 &&
                      filterData
                        ?.slice(0)
                        ?.reverse()
                        ?.map((item, index) => {
                          return (
                              <ProductItem item={item} key={index} />
                          );
                        })}
                  </div>
                )}
              </div>

              <div className="d-flex mt-4 mb-3 bannerSec">
                {/* Render additional banner images */}
                <div className="banner">
                  <img src={banner3} className="cursor w-100" />
                </div>

                <div className="banner">
                  <img src={banner4} className="cursor w-100" />
                </div>

                <div className="banner">
                  <img src={banner4} className="cursor w-100" />
                </div>
              </div>

              <div className="d-flex align-items-center mt-4">
                <div className="info w-75">
                  <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                  <p className="text-light text-sml mb-0">
                    New products with updated stocks.
                  </p>
                </div>
              </div>

              <div className="product_row productRow2 w-100 mt-4 d-flex productScroller">
                {/* Render new products */}
                {productsData?.products?.length !== 0 &&
                  productsData?.products
                    ?.slice(0)
                    .reverse()
                    .map((item, index) => {
                      return <ProductItem key={index} item={item} />;
                    })}
              </div>

              <div className="d-flex align-items-center mt-4">
                <div className="info">
                  <h3 className="mb-0 hd">featured products</h3>
                  <p className="text-light text-sml mb-0">
                    Do not miss the current offers until the end of March.
                  </p>
                </div>
              </div>

              <div className="product_row w-100 mt-2">
              {
                context.windowWidth>992 ?
                <Swiper
                slidesPerView={4}
                spaceBetween={0}
                navigation={true}
                slidesPerGroup={context.windowWidth > 992 ? 3 : 1}
                modules={[Navigation]}
                className="mySwiper"
                >
                {featuredProducts?.length !== 0 &&
                  featuredProducts
                    ?.slice(0)
                    ?.reverse()
                    ?.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <ProductItem item={item} />
                        </SwiperSlide>
                      );
                    })}
              </Swiper>:
                <div className="productScroller">
                  {featuredProducts?.length !== 0 &&
                    featuredProducts
                      ?.slice(0)
                      ?.reverse()
                      ?.map((item, index) => {
                        return (
                            <ProductItem item={item} key={index} />
                        );
                      })}
                </div>
              }
              </div>

              <div className="mt-3">
                <Button
                  className="explore_btn"
                  variant="contained"
                  endIcon={<IoIosArrowRoundForward />}
                >
                  Explore More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
