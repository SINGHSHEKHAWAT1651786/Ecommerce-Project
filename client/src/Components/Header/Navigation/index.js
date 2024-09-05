import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../App";
import CountryDropdown from "../../CountryDropdown";

const Navigation = (props) => {
  // State variables for controlling sidebar and submenu visibility
  const [isopenSidebarVal, setIsOpenSidebarVal] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [isOpenSubMenuIndex, setIsOpenSubMenuIndex] = useState(null);
  const [isOpenSubMenu_, setIsOpenSubMenu_] = useState(false);

  // Context for accessing global state
  const context = useContext(MyContext);

  // Effect to synchronize the navigation state with props
  useEffect(() => {
    setIsOpenNav(props.isOpenNav);
  }, [props.isOpenNav]);

  // Toggle submenu visibility
  const isOpenSubMenu = (index) => {
    setIsOpenSubMenuIndex(index);
    setIsOpenSubMenu_(!isOpenSubMenu_);
  };

  return (
    <nav>
      <div className="container">
        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-sm-2 navPart1">
            <div className="catWrapper">
              {/* Button to toggle sidebar visibility */}
              <Button
                className="allCatTab align-items-center res-hide"
                onClick={() => setIsOpenSidebarVal(!isopenSidebarVal)}
              >
                <span className="icon1 mr-2">
                  <IoIosMenu />
                </span>
                <span className="text">ALL CATEGORIES</span>
                <span className="icon2 ml-2">
                  <FaAngleDown />
                </span>
              </Button>

              {/* Sidebar content */}
              <div
                className={`sidebarNav ${
                  isopenSidebarVal ? "open" : ""
                }`}
              >
                <ul>
                  {props.navData?.map((item, index) => (
                    <li key={index}>
                      <Link to={`/products/category/${item?._id}`}>
                        <Button>
                          {item?.name} <FaAngleRight className="ml-auto" />
                        </Button>
                      </Link>
                      {item?.children?.length > 0 && (
                        <div className="submenu">
                          {item?.children?.map((subCat, key) => (
                            <Link to={`/products/subCat/${subCat?._id}`} key={key}>
                              <Button>{subCat?.name}</Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div
            className={`col-sm-10 navPart2 d-flex align-items-center res-nav-wrapper ${
              isOpenNav ? "open" : "close"
            }`}
          >
            <div className="res-nav-overlay" onClick={props.closeNav}></div>

            <ul className="list list-inline ml-auto res-nav">
              {context.windowWidth < 992 && (
                <>
                  {!context.isLogin && (
                    <li className="list-inline-item pl-3">
                      <Link to="/signIn">
                        <Button className="btn-blue btn-round mr-3">
                          Sign In
                        </Button>
                      </Link>
                    </li>
                  )}

                  <li className="list-inline-item">
                    <div className="p-3">
                      {context.countryList.length > 0 &&
                        context.windowWidth < 992 && <CountryDropdown />}
                    </div>
                  </li>
                </>
              )}
              <li className="list-inline-item" onClick={props.closeNav}>
                <Link to="/">
                  <Button>Home</Button>
                </Link>
              </li>
              {props.navData
                .filter((item, idx) => idx < 8)
                .map((item, index) => (
                  <li className="list-inline-item" key={index}>
                    <Link
                      to={`/products/category/${item?._id}`}
                      onClick={props.closeNav}
                    >
                      <Button>{item?.name}</Button>
                    </Link>

                    {item?.children?.length > 0 &&
                      context.windowWidth < 992 && (
                        <span
                          className={`arrow ${
                            isOpenSubMenuIndex === index &&
                            isOpenSubMenu_ &&
                            "rotate"
                          }`}
                          onClick={() => isOpenSubMenu(index)}
                        >
                          <FaAngleDown />
                        </span>
                      )}

                    {item?.children?.length > 0 && (
                      <div
                        className={`submenu ${
                          isOpenSubMenuIndex === index &&
                          isOpenSubMenu_ &&
                          "open"
                        }`}
                      >
                        {item?.children?.map((subCat, key) => (
                          <Link
                            to={`/products/subCat/${subCat?._id}`}
                            key={key}
                            onClick={props.closeNav}
                          >
                            <Button>{subCat?.name}</Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
