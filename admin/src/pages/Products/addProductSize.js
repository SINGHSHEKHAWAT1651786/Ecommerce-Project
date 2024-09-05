import React, { useContext, useEffect, useRef, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt, FaPencilAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

// Styled Breadcrumb component
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

// AddProductSize component for managing product sizes
const AddProductSize = () => {
    // State hooks
    const [editId, setEditId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productSizeData, setProductSizeData] = useState([]);
    const [formFields, setFormFields] = useState({
        size: '',
    });

    // Hooks for navigation and context
    const history = useNavigate();
    const input = useRef();
    const context = useContext(MyContext);

    // Handler for input changes
    const inputChange = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    }

    // Fetch product sizes on component mount
    useEffect(() => {
        fetchDataFromApi("/api/productSIZE").then((res) => {
            setProductSizeData(res);
        });
    }, []);

    // Add or edit product size
    const addproductSize = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('size', formFields.size);

        // Validation check
        if (formFields.size === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please add Product size'
            });
            return false;
        }

        setIsLoading(true);

        // Add new product size
        if (editId === "") {
            postData('/api/productSIZE/create', formFields).then(res => {
                setIsLoading(false);
                setFormFields({ size: "" });
                fetchDataFromApi("/api/productSIZE").then((res) => {
                    setProductSizeData(res);
                });
            });
        } else {
            // Edit existing product size
            editData(`/api/productSIZE/${editId}`, formFields).then((res) => {
                fetchDataFromApi("/api/productSIZE").then((res) => {
                    setProductSizeData(res);
                    setEditId("");
                    setIsLoading(false);
                    setFormFields({ size: "" });
                });
            });
        }
    }

    // Delete a product size
    const deleteItem = (id) => {
        deleteData(`/api/productSIZE/${id}`).then((res) => {
            fetchDataFromApi("/api/productSIZE").then((res) => {
                setProductSizeData(res);
            });
        });
    }

    // Update a product size (populate form for editing)
    const updateData = (id) => {
        input.current.focus();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        fetchDataFromApi(`/api/productSIZE/${id}`).then((res) => {
            setEditId(id);
            setFormFields({ size: res.size });
        });
    }

    return (
        <div className="right-content w-100">
            {/* Breadcrumbs for navigation */}
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Add Product SIZE</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="Product SIZE"
                        href="#"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Add Product SIZE"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            {/* Form for adding or editing product size */}
            <form className='form' onSubmit={addproductSize}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>PRODUCT SIZE</h6>
                                        <input
                                            type='text'
                                            name="size"
                                            value={formFields.size}
                                            onChange={inputChange}
                                            ref={input}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit button with loader */}
                            <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                <FaCloudUploadAlt /> &nbsp;  
                                {isLoading 
                                    ? <CircularProgress color="inherit" className="loader" /> 
                                    : 'PUBLISH AND VIEW'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Display list of product sizes */}
            {productSizeData.length !== 0 && (
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='card p-4 mt-0'>
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered table-striped v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>PRODUCT SIZE</th>
                                            <th width="25%">ACTION</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productSizeData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.size}</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button 
                                                            className="success" 
                                                            color="success" 
                                                            onClick={() => updateData(item.id)}
                                                        >
                                                            <FaPencilAlt />
                                                        </Button>
                                                        <Button 
                                                            className="error" 
                                                            color="error" 
                                                            onClick={() => deleteItem(item.id)}
                                                        >
                                                            <MdDelete />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddProductSize;
