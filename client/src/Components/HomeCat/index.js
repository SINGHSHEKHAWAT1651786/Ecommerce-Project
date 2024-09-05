import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';  // Import Swiper components for carousel functionality
import 'swiper/css';  // Import Swiper styles
import 'swiper/css/navigation';  // Import Swiper navigation styles
import { Navigation } from 'swiper/modules';  // Import Swiper navigation module
import { Link } from "react-router-dom";  // Import Link for routing

import { MyContext } from "../../App";  // Import context to get window width

const HomeCat = (props) => {

    const context = useContext(MyContext);  // Get context for window width

    return (
        <section className="homeCat pb-2">  // Section with bottom padding
            <div className="container">  // Container for layout
                <h3 className="mb-3 hd">Featured Categories</h3>  // Header for the section
                <Swiper
                    slidesPerView={9}  // Default number of slides to view
                    spaceBetween={8}  // Default space between slides
                    navigation={context.windowWidth > 992 ? true : false}  // Enable navigation based on window width
                    slidesPerGroup={context.windowWidth > 992 ? 3 : 1}  // Number of slides per group based on window width
                    modules={[Navigation]}  // Add navigation module
                    loop={false}  // Disable looping of slides
                    className="mySwiper"  // Custom class for styling
                    breakpoints={{  // Responsive breakpoints
                        320: {
                            slidesPerView: 3,  // Number of slides to view on small screens
                            spaceBetween: 10,  // Space between slides on small screens
                        },
                        500: {
                          slidesPerView: 5,  // Number of slides to view on medium screens
                          spaceBetween: 10,  // Space between slides on medium screens
                        },
                        768: {
                          slidesPerView: 8,  // Number of slides to view on larger screens
                          spaceBetween: 10,  // Space between slides on larger screens
                        }
                    }}
                >
                    {
                        props.catData?.length !== 0 && props.catData?.map((cat, index) => {  // Check if there is category data and map over it
                            return (
                                <SwiperSlide key={index}>  // Render each slide with a unique key
                                    <Link to={`/products/category/${cat._id}`}>  // Link to category page
                                        <div className="item text-center cursor" style={{ background: cat.color }}>  // Category item with background color
                                            <img src={cat.images[0]} />  // Display category image
                                            <h6>{cat.name}</h6>  // Display category name
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </section>
    )
}

export default HomeCat;
