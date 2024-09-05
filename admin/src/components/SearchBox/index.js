// Importing IoSearch icon from react-icons for the search functionality
import { IoSearch } from "react-icons/io5";

// Functional component for the search box
const SearchBox = () => {
    return (
        <div className="searchBox posotion-relative d-flex align-items-center">
            {/* Search icon */}
            <IoSearch className="mr-2" />
            {/* Input field for search queries */}
            <input type="text" placeholder="Search here..." />
        </div>
    )
}

export default SearchBox;
