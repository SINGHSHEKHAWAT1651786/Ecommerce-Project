import React, { useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';  // Import Swiper components for carousel functionality
import 'swiper/css';  // Import Swiper styles
import 'swiper/css/navigation';  // Import Swiper navigation styles
import { Navigation, Autoplay } from 'swiper/modules';  // Import Swiper modules for navigation and autoplay
import { MyContext } from "../../App";  // Import context to get window width

const HomeBanner = (props) => {

    const context = useContext(MyContext);  // Get context for window width

    return (
        <div className="container mt-3">  // Container with margin top
            <div className="homeBannerSection">
                <Swiper
                    slidesPerView={1}  // Display one slide at a time
                    spaceBetween={15}  // Space between slides
                    navigation={context.windowWidth > 992 ? true : false}  // Enable navigation based on window width
                    loop={true}  // Enable looping of slides
                    speed={500}  // Transition speed
                    autoplay={{
                        delay: 3500,  // Delay between slide transitions
                        disableOnInteraction: false,  // Autoplay continues even after user interaction
                    }}
                    modules={[Navigation, Autoplay]}  // Add modules for navigation and autoplay
                    className="mySwiper"  // Custom class for styling
                >
                    {
                        props?.data?.length !== 0 && props?.data?.map((item, index) => {
                            return (
                                <SwiperSlide key={index}>  // Render each slide with a unique key
                                    <div className="item">
                                        <img src={item?.images[0]} className="w-100" />  // Display image for the slide
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default HomeBanner;
