import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import { IoIosSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { MyContext } from '../../App';

// Transition for the modal sliding effect
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown = () => {
    const [isOpenModal, setIsOpenModal] = useState(false); // State to control modal visibility
    const [selectedTab, setSelectedTab] = useState(null); // State for tracking the selected country tab
    const [countryList, setCountryList] = useState([]); // State for holding the list of countries

    const context = useContext(MyContext); // Accessing context for country list and selected country

    // Function to handle country selection
    const selectCountry = (index, country) => {
        setSelectedTab(index); // Set the selected tab index
        setIsOpenModal(false); // Close the modal
        context.setSelectedCountry(country); // Update the selected country in context
        localStorage.setItem("location", country); // Save the selected country in local storage
        window.location.href = "/"; // Redirect to home page
    }

    // Effect to set country list from context on component mount
    useEffect(() => {
        setCountryList(context.countryList);
    }, [context.countryList]);

    // Function to filter the country list based on search input
    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

        if (keyword !== "") {
            const list = context.countryList.filter((item) => {
                return item.country.toLowerCase().includes(keyword); // Filter list based on search input
            });
            setCountryList(list);
        } else {
            setCountryList(context.countryList); // Reset to original list if search input is cleared
        }
    }

    return (
        <>
            <Button className='countryDrop' onClick={() => {
                setIsOpenModal(true); // Open the modal
                setCountryList(context.countryList); // Reset country list when modal opens
            }}>
                <div className='info d-flex flex-column'>
                    <span className='label'>Your Location</span>
                    <span className='name'>
                        {context.selectedCountry !== "" ? 
                            context.selectedCountry.length > 10 ? 
                            context.selectedCountry.substr(0, 10) + '...' : 
                            context.selectedCountry 
                        : 
                        'Select Location'}
                    </span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>

            <Dialog open={isOpenModal} onClose={() => setIsOpenModal(false)} className='locationModal' TransitionComponent={Transition}>
                <h4 className='mb-0'>Choose your Delivery Location</h4>
                <p>Enter your address and we will specify the offer for your area.</p>
                <Button className='close_' onClick={() => setIsOpenModal(false)}><MdClose /></Button>

                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Search your area...' onChange={filterList} />
                    <Button><IoIosSearch /></Button>
                </div>

                <ul className='countryList mt-3'>
                    <li><Button onClick={() => selectCountry(0, "All")}>All</Button></li>
                    {
                        countryList?.length !== 0 && countryList?.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Button onClick={() => selectCountry(index, item.country)}
                                        className={`${selectedTab === index ? 'active' : ''}`}
                                    >
                                        {item.country}
                                    </Button>
                                </li>
                            )
                        })
                    }
                </ul>
            </Dialog>
        </>
    )
}

export default CountryDropdown;
