import Button from '@mui/material/Button'; // Import Button component from Material UI for styled buttons
import { MdDashboard } from "react-icons/md"; // Import Dashboard icon from react-icons library
import { FaAngleRight } from "react-icons/fa6"; // Import Angle Right icon from react-icons library
import { FaProductHunt } from "react-icons/fa"; // Import Product Hunt icon from react-icons library
import { FaCartArrowDown } from "react-icons/fa6"; // Import Cart Arrow Down icon from react-icons library
import { MdMessage } from "react-icons/md"; // Import Message icon from react-icons library
import { FaBell } from "react-icons/fa6"; // Import Bell icon from react-icons library
import { IoIosSettings } from "react-icons/io"; // Import Settings icon from react-icons library
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom for navigation
import { useContext, useState } from 'react'; // Import useContext and useState hooks from React
import { IoMdLogOut } from "react-icons/io"; // Import Logout icon from react-icons library
import { MyContext } from '../../App'; // Import context from App component for state management

const Sidebar = () => {

    // State to track the currently active tab
    const [activeTab, setActiveTab] = useState(0);
    // State to manage the visibility of submenu
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    // Access context values
    const context = useContext(MyContext);

    // Function to handle submenu visibility and active tab
    const isOpenSubmenu = (index) => {
        setActiveTab(index); // Set active tab index
        setIsToggleSubmenu(!isToggleSubmenu); // Toggle submenu visibility
    }

    return (
        <>
            <div className="sidebar">
                <ul>
                    {/* Sidebar menu item for Dashboard */}
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className='icon'><MdDashboard /></span>
                                Dashboard
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    {/* Sidebar menu item for Products with collapsible submenu */}
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className='icon'><FaProductHunt /></span>
                            Products
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/products">Product List</Link></li>
                                <li><Link to="/product/details">Product View</Link></li>
                                <li><Link to="/product/upload">Product Upload</Link></li>
                            </ul>
                        </div>
                    </li>
                    {/* Sidebar menu item for Orders */}
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                <span className='icon'><FaCartArrowDown /></span>
                                Orders
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    {/* Sidebar menu item for Messages */}
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                <span className='icon'><MdMessage /></span>
                                Messages
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    {/* Sidebar menu item for Notifications */}
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                <span className='icon'><FaBell /></span>
                                Notifications
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    {/* Sidebar menu item for Settings */}
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                <span className='icon'><IoIosSettings /></span>
                                Settings
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>

                    {/* Repeated sidebar items for demonstration */}
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                <span className='icon'><MdDashboard /></span>
                                Dashboard
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
                                <span className='icon'><FaProductHunt /></span>
                                Products
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 8 ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                                <span className='icon'><FaCartArrowDown /></span>
                                Orders
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 9 ? 'active' : ''}`} onClick={() => isOpenSubmenu(9)}>
                                <span className='icon'><MdMessage /></span>
                                Messages
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 10 ? 'active' : ''}`} onClick={() => isOpenSubmenu(10)}>
                                <span className='icon'><FaBell /></span>
                                Notifications
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 11 ? 'active' : ''}`} onClick={() => isOpenSubmenu(11)}>
                                <span className='icon'><IoIosSettings /></span>
                                Settings
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                </ul>

                <br />

                {/* Logout button */}
                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant="contained"><IoMdLogOut /> Logout</Button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar;
