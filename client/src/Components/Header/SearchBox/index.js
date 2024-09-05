import Button from '@mui/material/Button';
import { IoIosSearch } from "react-icons/io";
import { fetchDataFromApi } from '../../../utils/api';
import { useContext, useState } from 'react';
import { MyContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const SearchBox = (props) => {
  // State variables for managing search input and loading status
  const [searchFields, setSearchFields] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Access context for global state management
  const context = useContext(MyContext);

  // Navigate function to redirect user
  const history = useNavigate();

  // Handle input change and update the searchFields state
  const onChangeValue = (e) => {
    setSearchFields(e.target.value);
  };

  // Function to perform the search operation
  const searchProducts = () => {
    if (searchFields !== "") {
      setIsLoading(true); // Set loading state to true
      fetchDataFromApi(`/api/search?q=${searchFields}`) // Fetch search results from API
        .then((res) => {
          context.setSearchData(res); // Update context with search results
          setTimeout(() => {
            setIsLoading(false); // Set loading state to false after delay
          }, 2000);
          props.closeSearch(); // Close search box
          history("/search"); // Redirect to search results page
        });
    }
  };

  return (
    <div className='headerSearch ml-3 mr-3'>
      <input
        type='text'
        placeholder='Search for products...'
        onChange={onChangeValue} // Handle input changes
      />
      <Button onClick={searchProducts}>
        {isLoading ? <CircularProgress /> : <IoIosSearch />} {/* Show loading spinner or search icon */}
      </Button>
    </div>
  );
};

export default SearchBox;
