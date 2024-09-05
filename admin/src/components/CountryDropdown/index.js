// Import necessary dependencies and components from React, Material-UI, React Icons, and React Router
import React, { useContext, useEffect } from 'react'; 
import Button from '@mui/material/Button'; // Material-UI Button component
import { FaAngleDown } from "react-icons/fa6"; // Import the down arrow icon from React Icons
import Dialog from '@mui/material/Dialog'; // Material-UI Dialog component for modals
import { IoIosSearch } from "react-icons/io"; // Import the search icon from React Icons
import { MdClose } from "react-icons/md"; // Import the close icon from React Icons
import { useState } from 'react'; // React useState hook for managing local state
import Slide from '@mui/material/Slide'; // Material-UI Slide component for transitions
import { MyContext } from '../../App'; // Import the context from App.js
import { Link, useParams } from "react-router-dom"; // React Router imports for navigation and URL parameters

// Transition effect for the modal dialog, using Slide from Material-UI
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// CountryDropdown Component
const CountryDropdown = (props) => {

    // State for managing modal visibility
    const [isOpenModal, setisOpenModal] = useState(false);
    // State for keeping track of the selected country tab
    const [selectedTab, setselectedTab] = useState(null);
    // State for storing the list of countries
    const [countryList, setcountryList] = useState([]);

    // Access the global context values
    const context = useContext(MyContext);

    // Function to handle country selection
    const selectCountry = (index, country) => {
        setselectedTab(index); // Update selected tab index
        setisOpenModal(false); // Close the modal
        context.setselectedCountry(country); // Update the selected country in context
    }

    // Extract the 'id' parameter from the URL
    let { id } = useParams();

    // Effect hook to initialize the country list and set the selected country on mount
    useEffect(() => {
        setcountryList(context.countryList); // Set the country list from context
        context.setselectedCountry(props.selectedLocation); // Set the selected country based on props
    }, []);

    // Function to filter the country list based on search input
    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase(); // Convert search input to lowercase

        if (keyword !== "") {
            // Filter the country list based on the search keyword
            const list = countryList.filter((item) => {
                return item.country.toLowerCase().includes(keyword);
            });
            setcountryList(list); // Update the country list with filtered results
        } else {
            setcountryList(context.countryList); // Reset the country list if search input is cleared
        }
    }

    // Render the component UI
    return (
        <>
            {/* Button to open the country dropdown modal */}
            <Button className='countryDrop' onClick={() => {
                setisOpenModal(true); // Open the modal
                setcountryList(context.countryList); // Reset the country list when modal opens
            }}>
                <div className='info d-flex flex-column'>
                    {/* Display the selected country or prompt to select a location */}
                    <span className='name'>{context.selectedCountry !== "" 
                        ? context.selectedCountry.length > 10 
                            ? context.selectedCountry.substr(0, 10) + '...' 
                            : context.selectedCountry 
                        : 'Select Location'}
                    </span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span> {/* Down arrow icon */}
            </Button>

            {/* Modal dialog for country selection */}
            <Dialog open={isOpenModal} onClose={() => setisOpenModal(false)} 
                className='locationModal' TransitionComponent={Transition}>
                
                <h4 className='mb-0'>Choose your Delivery Location</h4>
                <p>Enter your address and we will specify the offer for your area.</p>
                {/* Close button for the modal */}
                <Button className='close_' onClick={() => setisOpenModal(false)}><MdClose /></Button>

                {/* Search input to filter country list */}
                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Search your area...' onChange={filterList} />
                    <Button><IoIosSearch /></Button> {/* Search icon */}
                </div>

                {/* List of countries displayed as buttons */}
                <ul className='countryList mt-3'>
                    {
                        countryList?.length !== 0 && countryList.map((item, index) => {
                            return (
                                <li key={index}>
                                    {/* Button for each country, highlights if selected */}
                                    <Button onClick={() => selectCountry(index, item.country)}
                                        className={`${selectedTab === index ? 'active' : ''}`}
                                    >{item.country}</Button>
                                </li>
                            )
                        })
                    }
                </ul>

            </Dialog>
        </>
    )
}

// Export the CountryDropdown component as default
export default CountryDropdown;
