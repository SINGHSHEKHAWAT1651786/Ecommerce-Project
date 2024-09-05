import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoCloseSharp } from "react-icons/io5";
import { deleteData, fetchDataFromApi } from "../../utils/api";

// Styled component for breadcrumbs
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const SubCategory = () => {
  // State to store category data
  const [catData, setCatData] = useState([]);
  // State to manage loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access context
  const context = useContext(MyContext);

  // Effect to fetch data on component mount
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    context.setProgress(20); // Set initial progress
    fetchDataFromApi("/api/category")
      .then((res) => {
        setCatData(res); // Update state with fetched data
        context.setProgress(100); // Complete progress
      })
      .catch((err) => {
        setError('Failed to load data'); // Handle errors
        context.setProgress(100); // Complete progress
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetch
      });
  }, []);

  // Function to delete a category
  const deleteCat = (id) => {
    context.setProgress(30); // Set progress to show deletion
    deleteData(`/api/category/${id}`)
      .then((res) => {
        return fetchDataFromApi("/api/category"); // Fetch updated data
      })
      .then((res) => {
        setCatData(res); // Update state with new data
        context.setProgress(100); // Complete progress
        context.setProgress({
          open: true,
          error: false,
          msg: "Category Deleted!", // Show success message
        });
      })
      .catch((err) => {
        context.setProgress({
          open: true,
          error: true,
          msg: "Failed to delete category", // Show error message
        });
      });
  };

  // Function to delete a subcategory with admin check
  const deleteSubCat = (id) => {
    if (context?.user?.email === "admin9643@gmail.com") { // Check for admin
      context.setProgress(30); // Set progress to show deletion
      deleteData(`/api/category/${id}`)
        .then((res) => {
          return fetchDataFromApi("/api/category"); // Fetch updated data
        })
        .then((res) => {
          setCatData(res); // Update state with new data
          context.setProgress(100); // Complete progress
          context.setProgress({
            open: true,
            error: false,
            msg: "Sub Category Deleted!", // Show success message
          });
        })
        .catch((err) => {
          context.setProgress({
            open: true,
            error: true,
            msg: "Failed to delete sub category", // Show error message
          });
        });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Only admin can delete Sub Category!", // Show permission error
      });
    }
  };

  // Display loading or error message if applicable
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">Sub Category List</h5>
          <div className="ml-auto d-flex align-items-center">
            <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb label="Category" deleteIcon={<ExpandMoreIcon />} />
            </Breadcrumbs>
            <Link to="/subCategory/add">
              <Button className="btn-blue ml-3 pl-3 pr-3">Add Sub Category</Button>
            </Link>
          </div>
        </div>
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th style={{ width: "100px" }}>CATEGORY IMAGE</th>
                  <th>CATEGORY</th>
                  <th>SUB CATEGORY</th>
                </tr>
              </thead>
              <tbody>
                {catData?.categoryList?.length !== 0 &&
                  catData?.categoryList?.map((item, index) => {
                    if (item?.children?.length !== 0) {
                      return (
                        <tr key={index}>
                          <td>
                            <div
                              className="d-flex align-items-center"
                              style={{ width: "150px" }}
                            >
                              <div
                                className="imgWrapper"
                                style={{ width: "50px", flex: "0 0 50px" }}
                              >
                                <div className="img card shadow m-0">
                                  <LazyLoadImage
                                    alt={"image"}
                                    effect="blur"
                                    className="w-100"
                                    src={item.images[0]}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{item.name} </td>
                          <td>
                            {item?.children?.length !== 0 &&
                              item?.children?.map((subCat, index) => {
                                return (
                                  <span className="badge badge-primary mx-1" key={subCat._id}>
                                    {subCat.name}{" "}
                                    <IoCloseSharp
                                      className="cursor"
                                      onClick={() => deleteSubCat(subCat._id)}
                                    />
                                  </span>
                                );
                              })}
                          </td>
                        </tr>
                      );
                    }
                    return null; // Ensure `map` always returns something
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubCategory;
