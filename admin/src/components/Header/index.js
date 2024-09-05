// Import necessary React hooks and components
import React, { useContext, useEffect, useState } from 'react';

// Import routing components from React Router
import { Link } from "react-router-dom";

// Import logo image
import logo from '../../assets/images/logo.png';

// Import Material-UI components and icons
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

// Import icons from various icon libraries
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { MdNightlightRound } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { IoShieldHalfSharp } from "react-icons/io5";

// Import custom components
import SearchBox from "../SearchBox";
import { MyContext } from '../../App';
import UserAvatarImgComponent from '../userAvatarImg';

// Import navigation hook from React Router
import { useNavigate } from 'react-router-dom';

// Define the Header component
const Header = () => {

    // State to manage the anchor element for account menu
    const [anchorEl, setAnchorEl] = useState(null);

    // State to manage the visibility of notification dropdown
    const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);

    // Boolean values to check if account menu and notification dropdown are open
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationDrop);

    // Access context values from MyContext
    const context = useContext(MyContext);

    // Hook for navigation
    const history = useNavigate();

    // Handler to open account dropdown menu
    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Handler to close account dropdown menu
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    // Handler to open notifications dropdown
    const handleOpenotificationsDrop = () => {
        setisOpennotificationDrop(true);
    };

    // Handler to close notifications dropdown
    const handleClosenotificationsDrop = () => {
        setisOpennotificationDrop(false);
    };

    // Function to toggle between light and dark themes
    const changeTheme = () => {
        if (context.theme === "dark") {
            context.setTheme("light");
        } else {
            context.setTheme("dark");
        }
    };

    // Function to handle user logout
    const logout = () => {
        // Clear local storage
        localStorage.clear();

        // Close account menu
        setAnchorEl(null);

        // Show logout success alert
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout successfull"
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
            history("/login");
        }, 2000);
    };

    // Render the Header component
    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/* Logo Wrapper */}
                        <div className="col-sm-2 part1 pr-0">
                            <Link to={'/'} className="d-flex align-items-center logo">
                                <img src={logo} />
                                <span className="ml-2">ECOMMERCE</span>
                            </Link>
                        </div>

                        {/* Sidebar Toggle and Search Box */}
                        <div className="col-sm-3 d-flex align-items-center part2">
                            <Button
                                className="rounded-circle mr-3"
                                onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}
                            >
                                {
                                    context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                }
                            </Button>
                            <SearchBox />
                        </div>

                        {/* Action Buttons and User Account */}
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            {/* Theme Toggle Button */}
                            <Button className="rounded-circle mr-3" onClick={changeTheme}>
                                {
                                    context.theme === "light" ? <MdNightlightRound /> : <MdOutlineLightMode />
                                }
                            </Button>

                            {/* Cart Button */}
                            <Button className="rounded-circle mr-3">
                                <IoCartOutline />
                            </Button>

                            {/* Mail Button */}
                            <Button className="rounded-circle mr-3">
                                <MdOutlineMailOutline />
                            </Button>

                            {/* Notifications Dropdown */}
                            <div className='dropdownWrapper position-relative'>
                                <Button
                                    className="rounded-circle mr-3"
                                    onClick={handleOpenotificationsDrop}
                                >
                                    <FaRegBell />
                                </Button>

                                <Menu
                                    anchorEl={isOpennotificationDrop}
                                    className='notifications dropdown_list'
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleClosenotificationsDrop}
                                    onClick={handleClosenotificationsDrop}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {/* Notifications Header */}
                                    <div className='head pl-3 pb-0'>
                                        <h4>Orders (12)</h4>
                                    </div>

                                    <Divider className="mb-1" />

                                    {/* Notifications List */}
                                    <div className='scroll'>
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <div className='d-flex'>
                                                <div>
                                                    <UserAvatarImgComponent img={'https://mironcoder-hotash.netlify.app/images/avatar/01.webp'} />
                                                </div>

                                                <div className='dropdownInfo'>
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudul </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className='text-sky mb-0'>few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>

                                        {/* Repeat similar MenuItems as needed */}
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <div className='d-flex'>
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='dropdownInfo'>
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudul </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className='text-sky mb-0'>few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>

                                        {/* Additional notifications can be added here */}
                                    </div>

                                    {/* View All Notifications Button */}
                                    <div className='pl-3 pr-3 w-100 pt-2 pb-1'>
                                        <Button className='btn-blue w-100'>View all notifications</Button>
                                    </div>

                                </Menu>
                            </div>

                            {/* Conditional Rendering for Sign In and User Account */}
                            {
                                context.isLogin !== true ?
                                    // Sign In Button when user is not logged in
                                    <Link to={'/login'}>
                                        <Button className='btn-blue btn-lg btn-round'>Sign In</Button>
                                    </Link>
                                    :
                                    // User Account Dropdown when user is logged in
                                    <div className="myAccWrapper">
                                        <Button
                                            className="myAcc d-flex align-items-center"
                                            onClick={handleOpenMyAccDrop}
                                        >
                                            <div className="userImg">
                                                <span className="rounded-circle">
                                                    {context.user?.name?.charAt(0)}
                                                </span>
                                            </div>

                                            <div className="userInfo">
                                                <h4>{context.user?.name}</h4>
                                                <p className="mb-0">{context.user?.email}</p>
                                            </div>
                                        </Button>

                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={openMyAcc}
                                            onClose={handleCloseMyAccDrop}
                                            onClick={handleCloseMyAccDrop}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            {/* My Account Menu Item */}
                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <PersonAdd fontSize="small" />
                                                </ListItemIcon>
                                                My Account
                                            </MenuItem>

                                            {/* Reset Password Menu Item */}
                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <IoShieldHalfSharp />
                                                </ListItemIcon>
                                                Reset Password
                                            </MenuItem>

                                            {/* Logout Menu Item */}
                                            <MenuItem onClick={logout}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

// Export the Header component
export default Header;
