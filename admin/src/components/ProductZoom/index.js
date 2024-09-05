// Importing Swiper and SwiperSlide components for creating sliders
import { Swiper, SwiperSlide } from 'swiper/react';
// Importing Swiper's core styles
import 'swiper/css';
// Importing styles for Swiper's navigation component
import 'swiper/css/navigation';
// Importing the Navigation module from Swiper
import { Navigation } from 'swiper/modules';

// Importing InnerImageZoom for zooming functionality on images
import InnerImageZoom from 'react-inner-image-zoom';
// Importing styles for InnerImageZoom component
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

// Importing React hooks for managing state and references
import { useRef, useState } from 'react';

const ProductZoom = (props) => {
    // State to keep track of the currently selected slide index
    const [slideIndex, setSlideIndex] = useState(0);
    
    // Refs for the two Swiper instances to control their slides programmatically
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    // Function to navigate to a specific slide index in both Swiper instances
    const goto = (index) => {
        setSlideIndex(index); // Update the slide index state
        // Programmatically slide to the specified index in the zoomSlider
        zoomSlider.current.swiper.slideTo(index);
        // Programmatically slide to the specified index in the zoomSliderBig
        zoomSliderBig.current.swiper.slideTo(index);
    }

    return (
        <div className="productZoom">
            {/* Swiper component for displaying the large image with zoom functionality */}
            <div className='productZoom productZoomBig position-relative mb-3'>
                {/* Displaying discount badge if available */}
                <div className='badge badge-primary'>{props?.discount}%</div>
                <Swiper
                    slidesPerView={1} // Show one slide at a time
                    spaceBetween={0} // No space between slides
                    navigation={false} // Disable navigation buttons
                    slidesPerGroup={1} // Number of slides to move per swipe
                    modules={[Navigation]} // Enable Navigation module
                    className="zoomSliderBig" // Class for styling the big slider
                    ref={zoomSliderBig} // Reference to control the Swiper instance
                >
                    {/* Mapping over images to create SwiperSlide components */}
                    {
                        props?.images?.map((img, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className='item'>
                                        {/* InnerImageZoom component for zooming effect */}
                                        <InnerImageZoom
                                            zoomType="hover" // Zoom effect on hover
                                            zoomScale={1} // Zoom scale
                                            src={img} // Image source
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>

            {/* Swiper component for displaying thumbnail images */}
            <Swiper
                slidesPerView={5} // Show five slides at a time
                spaceBetween={0} // No space between slides
                navigation={true} // Enable navigation buttons
                slidesPerGroup={1} // Number of slides to move per swipe
                modules={[Navigation]} // Enable Navigation module
                className="zoomSlider" // Class for styling the thumbnail slider
                ref={zoomSlider} // Reference to control the Swiper instance
            >
                {/* Mapping over images to create SwiperSlide components for thumbnails */}
                {
                    props?.images?.map((img, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <div className={`item ${slideIndex === index && 'item_active'}`}>
                                    {/* Thumbnail image */}
                                    <img src={img} className='w-100' onClick={() => goto(index)} />
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default ProductZoom;
