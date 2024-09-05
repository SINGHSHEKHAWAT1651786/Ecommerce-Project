import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.jpg';
import Button from '@mui/material/Button';
import CountryDropdown from '../CountryDropdown';
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from './SearchBox';
import Navigation from './Navigation';
import { useContext } from 'react';
import { MyContext } from '../../App';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FaClipboardCheck, FaHeart, FaUserAlt } from "react-icons/fa";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { IoMdMenu } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpenNav, setIsOpenNav] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const open = Boolean(anchorEl);
    const headerRef = useRef();
    const context = useContext(MyContext);
    const history = useNavigate();

    // Open menu on user icon click
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle logout, clear local storage and redirect to sign in
    const logout = () => {
        setAnchorEl(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        context.setIsLogin(false);
        history("/signIn");
    };

    // Add fixed class to header on scroll
    useEffect(() => {
        const handleScroll = () => {
            let position = window.pageYOffset;
            if (headerRef.current) {
                if (position > 100) {
                    headerRef.current.classList.add('fixed');
                } else {
                    headerRef.current.classList.remove('fixed');
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Toggle navigation menu
    const openNav = () => {
        setIsOpenNav(!isOpenNav);
        context.setIsOpenNav(true);
    };

    // Close navigation menu
    const closeNav = () => {
        setIsOpenNav(false);
        context.setIsOpenNav(false);
    };

    // Toggle search box
    const openSearch = () => {
        setIsOpenSearch(!isOpenSearch);
    };

    // Close search box
    const closeSearch = () => {
        setIsOpenSearch(false);
    };

    return (
        <>
            <div className='headerWrapperFixed' ref={headerRef}>
                <div className="headerWrapper">
                    <div className="top-strip bg-blue">
                        <div className="container">
                            <p className="mb-0 mt-0 text-center">
                                Due to the <b>COVID 19</b> epidemic, orders may be processed with a slight delay
                            </p>
                        </div>
                    </div>

                    <header className="header">
                        <div className="container">
                            <div className="row">
                                <div className="logoWrapper d-flex align-items-center col-sm-2">
                                    <Link to={'/'}>
                                        <img src={Logo} alt='Logo' />
                                    </Link>
                                </div>

                                <div className='col-sm-10 d-flex align-items-center part2'>
                                    {/* Country dropdown for large screens */}
                                    {context.countryList.length !== 0 && context.windowWidth > 992 && <CountryDropdown />}

                                    {/* Search box */}
                                    <div className={`headerSearchWrapper ${isOpenSearch ? 'open' : ''}`}>
                                        <div className='d-flex align-items-center'>
                                            <span className="closeSearch mr-3" onClick={closeSearch}><FaAngleLeft /></span>
                                            <SearchBox closeSearch={closeSearch} />
                                        </div>
                                    </div>

                                    {/* User and cart icons */}
                                    <div className='part3 d-flex align-items-center ml-auto'>
                                        {context.windowWidth < 992 && <Button className="circle ml-3 toggleNav" onClick={openSearch}><IoIosSearch /></Button>}

                                        {/* Show Sign In button if not logged in */}
                                        {context.isLogin !== true && context.windowWidth > 992 && (
                                            <Link to="/signIn">
                                                <Button className="btn-blue btn-round mr-3">Sign In</Button>
                                            </Link>
                                        )}

                                        {/* User menu and options if logged in */}
                                        {context.isLogin === true && (
                                            <>
                                                <Button className='circle mr-3' onClick={handleClick}><FiUser /></Button>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    id="accDrop"
                                                    open={open}
                                                    onClose={handleClose}
                                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                >
                                                    <Link to="/my-account">
                                                        <MenuItem onClick={handleClose}>
                                                            <ListItemIcon>
                                                                <FaUserAlt fontSize="small" />
                                                            </ListItemIcon>
                                                            My Account
                                                        </MenuItem>
                                                    </Link>
                                                    <Link to="/orders">
                                                        <MenuItem onClick={handleClose}>
                                                            <ListItemIcon>
                                                                <FaClipboardCheck fontSize="small" />
                                                            </ListItemIcon>
                                                            Orders
                                                        </MenuItem>
                                                    </Link>
                                                    <Link to="/my-list">
                                                        <MenuItem onClick={handleClose}>
                                                            <ListItemIcon>
                                                                <FaHeart fontSize="small" />
                                                            </ListItemIcon>
                                                            My List
                                                        </MenuItem>
                                                    </Link>
                                                    <MenuItem onClick={logout}>
                                                        <ListItemIcon>
                                                            <RiLogoutCircleRFill fontSize="small" />
                                                        </ListItemIcon>
                                                        Logout
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        )}

                                        {/* Cart icon and item count */}
                                        <div className='ml-auto cartTab d-flex align-items-center'>
                                            {context.windowWidth > 1000 && (
                                                <span className='price'>
                                                    {(context.cartData?.length !== 0 ?
                                                        context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                                </span>
                                            )}

                                            <div className='position-relative ml-2'>
                                                <Link to="/cart">
                                                    <Button className='circle'><IoBagOutline /></Button>
                                                    <span className='count d-flex align-items-center justify-content-center'>{context.cartData?.length > 0 ? context.cartData?.length : 0}</span>
                                                </Link>
                                            </div>

                                            {context.windowWidth < 992 && <Button className="circle ml-3 toggleNav" onClick={openNav}><IoMdMenu /></Button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Navigation component */}
                    {context.categoryData?.length !== 0 && <Navigation navData={context.categoryData} isOpenNav={isOpenNav} closeNav={closeNav} />}
                </div>
            </div>
        </>
    );
};

export default Header;
