import React, { useEffect, useState, useContext } from 'react'; // Import React and hooks
import FormGroup from '@mui/material/FormGroup'; // MUI FormGroup component (not used in this code)
import FormControlLabel from '@mui/material/FormControlLabel'; // MUI FormControlLabel component
import Checkbox from '@mui/material/Checkbox'; // MUI Checkbox component (not used in this code)
import RangeSlider from 'react-range-slider-input'; // RangeSlider component for price filtering
import 'react-range-slider-input/dist/style.css'; // RangeSlider styles
import Radio from '@mui/material/Radio'; // MUI Radio component
import RadioGroup from '@mui/material/RadioGroup'; // MUI RadioGroup component
import { useParams, Link } from 'react-router-dom'; // React Router hooks
import Rating from '@mui/material/Rating'; // MUI Rating component
import { MyContext } from '../../App'; // Import context for global state

const Sidebar = (props) => {
    // State to manage price range
    const [value, setValue] = useState([100, 100000]);
    // State to manage selected category
    const [filterSubCat, setfilterSubCat] = useState();
    // State to manage filter sidebar open/close
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    // State to manage sub-category ID
    const [subCatId, setSubCatId] = useState('');

    // Access global context
    const context = useContext(MyContext);

    // Get 'id' from URL parameters
    const { id } = useParams();

    // Effect to set the sub-category ID when 'id' changes
    useEffect(() => {
        setSubCatId(id);
    }, [id]);

    // Effect to set the filter sidebar open/close state
    useEffect(() => {
        setIsOpenFilter(props.isOpenFilter);
    }, [props.isOpenFilter]);

    // Handler for changing the selected sub-category
    const handleChange = (event) => {
        setfilterSubCat(event.target.value);
        props.filterData(event.target.value);
        setSubCatId(event.target.value);
    };

    // Effect to apply price filter when value or id changes
    useEffect(() => {
        props.filterByPrice(value, subCatId);
    }, [value, id]);

    // Handler for filtering by rating
    const filterByRating = (rating) => {
        props.filterByRating(rating, subCatId);
    }

    return (
        <>
            <div className={`sidebar ${isOpenFilter && 'open'}`}>
                {/* Product Categories Filter */}
                <div className="filterBox">
                    <h6>PRODUCT CATEGORIES</h6>
                    <div className='scroll'>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={filterSubCat}
                            onChange={handleChange}
                        >
                            {
                                context?.subCategoryData?.length !== 0 &&
                                context?.subCategoryData?.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={item?.id}
                                        control={<Radio />}
                                        label={item?.name}
                                    />
                                ))
                            }
                        </RadioGroup>
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="filterBox">
                    <h6>FILTER BY PRICE</h6>
                    <RangeSlider
                        value={value}
                        onInput={setValue}
                        min={100}
                        max={60000}
                        step={5}
                    />
                    <div className='d-flex pt-2 pb-2 priceRange'>
                        <span>From: <strong className='text-dark'>Rs: {value[0]}</strong></span>
                        <span className='ml-auto'>To: <strong className='text-dark'>Rs: {value[1]}</strong></span>
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="filterBox">
                    <h6>FILTER BY RATING</h6>
                    <div className='scroll pl-0'>
                        <ul>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <li key={rating} onClick={() => filterByRating(rating)} className='cursor'>
                                    <Rating
                                        name="read-only"
                                        value={rating}
                                        readOnly
                                        size="small"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sidebar Banner */}
                <br />
                <Link to="#">
                    <img
                        src='https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif'
                        className='w-100'
                        alt='Sidebar Banner'
                    />
                </Link>
            </div>
        </>
    )
}

export default Sidebar;
