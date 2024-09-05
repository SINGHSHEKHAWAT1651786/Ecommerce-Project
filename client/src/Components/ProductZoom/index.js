// Import required modules from Swiper for carousel functionality
import { Swiper, SwiperSlide } from 'swiper/react'; // Swiper component and SwiperSlide for carousel
import 'swiper/css'; // Swiper core styles
import 'swiper/css/navigation'; // Swiper navigation styles
import { Navigation } from 'swiper/modules'; // Swiper navigation module

// Import InnerImageZoom for zooming functionality
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'; // InnerImageZoom styles

// Import React hooks for state and refs
import { useRef, useState } from 'react';

const ProductZoom = (props) => {
    // State to keep track of the current slide index
    const [slideIndex, setSlideIndex] = useState(0);
    
    // Refs for the Swiper instances
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    // Function to navigate to a specific slide
    const goto = (index) => {
        setSlideIndex(index); // Update slideIndex state
        zoomSlider.current.swiper.slideTo(index); // Navigate in the small slider
        zoomSliderBig.current.swiper.slideTo(index); // Navigate in the large slider
    }

    return (
        <div className="productZoom">
            {/* Large image carousel with zoom functionality */}
            <div className='productZoom productZoomBig position-relative mb-3'>
                <div className='badge badge-primary'>{props?.discount}%</div>
                <Swiper
                    slidesPerView={1} // Display one slide at a time
                    spaceBetween={0} // No space between slides
                    navigation={false} // Disable navigation buttons
                    slidesPerGroup={1} // Move one slide at a time
                    modules={[Navigation]} // Use Navigation module
                    className="zoomSliderBig" // Custom class for styling
                    ref={zoomSliderBig} // Attach ref for controlling the Swiper
                >
                    {
                        props?.images?.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className='item'>
                                    <InnerImageZoom
                                        zoomType="hover" // Zoom on hover
                                        zoomScale={1} // Zoom scale
                                        src={img} // Source image
                                    />
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>

            {/* Thumbnail carousel for selecting images */}
            <Swiper
                slidesPerView={5} // Display five slides at a time
                spaceBetween={0} // No space between slides
                navigation={true} // Enable navigation buttons
                slidesPerGroup={1} // Move one slide at a time
                modules={[Navigation]} // Use Navigation module
                className="zoomSlider" // Custom class for styling
                ref={zoomSlider} // Attach ref for controlling the Swiper
            >
                {
                    props?.images?.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className={`item ${slideIndex === index && 'item_active'}`}>
                                <img src={img} className='w-100' onClick={() => goto(index)} /> {/* Click to change slide */}
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default ProductZoom;
