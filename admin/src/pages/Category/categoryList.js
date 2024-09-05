import React, { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { deleteData, fetchDataFromApi } from "../../utils/api";

// Custom styling for breadcrumb chips
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const Category = () => {
    // State to hold category data and loading state
    const [catData, setCatData] = useState([]);
    const [isLoadingBar, setIsLoadingBar] = useState(false);
    
    // Context for managing global state and progress
    const context = useContext(MyContext);

    // Effect to fetch category data on component mount
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top when component mounts
        context.setProgress(20); // Set initial progress
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res); // Set category data
            context.setProgress(100); // Set progress to 100% when data is fetched
        });
    }, []);

    // Function to delete a category
    const deleteCat = (id) => {
        if (context?.user?.email === "admin9643@gmail.com") {
            setIsLoadingBar(true); // Set loading state
            context.setProgress(30); // Set progress to 30% during deletion
            deleteData(`/api/category/${id}`).then(res => {
                context.setProgress(100); // Set progress to 100% after deletion
                fetchDataFromApi('/api/category').then((res) => {
                    setCatData(res); // Update category data after deletion
                    context.setProgress(100); // Set progress to 100% after data update
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Category Deleted!"
                    });
                    setIsLoadingBar(false); // Reset loading state
                });
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Only admin can delete Category!"
            });
        }
    };

    return (
        <>
            <div className="right-content w-100">
                {/* Header section with breadcrumbs and add category button */}
                <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                    <h5 className="mb-0">Category List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Category"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                        <Link to="/category/add">
                            <Button className="btn-blue  ml-3 pl-3 pr-3">Add Category</Button>
                        </Link>
                    </div>
                </div>

                {/* Table to display category data */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '100px' }}>IMAGE</th>
                                    <th>CATEGORY</th>
                                    <th>COLOR</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    catData?.categoryList?.length !== 0 && catData?.categoryList?.slice(0)
                                    .reverse().map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center " style={{ width: '150px' }}>
                                                        <div className="imgWrapper" style={{ width: '50px', flex: '0 0 50px' }}>
                                                            <div className="img card shadow m-0">
                                                                <LazyLoadImage
                                                                    alt={"image"}
                                                                    effect="blur"
                                                                    className="w-100"
                                                                    src={item.images[0]} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.color}</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to={`/category/edit/${item._id}`}>
                                                            <Button className="success" color="success">
                                                                <FaPencilAlt />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            className="error"
                                                            color="error"
                                                            onClick={() => deleteCat(item._id)}
                                                            disabled={isLoadingBar}
                                                        >
                                                            <MdDelete />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Category;
