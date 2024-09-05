import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IoMdCloudUpload } from "react-icons/io";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  deleteData,
  deleteImages,
  editData,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";
import { MyContext } from "../../App";
import NoUserImg from "../../assets/images/no-user.jpg";
import CircularProgress from "@mui/material/CircularProgress";

// Component for displaying tab panels
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Function to generate a11y props for tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyAccount = () => {
  const [isLogin, setIsLogin] = useState(false); // State to check if user is logged in
  const [value, setValue] = React.useState(0); // State to manage tab value

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const history = useNavigate(); // Hook to navigate programmatically
  const context = useContext(MyContext); // Context for alert messages

  const [isLoading, setIsLoading] = useState(false); // State for form submission loading
  const [uploading, setUploading] = useState(false); // State for file upload loading

  const [previews, setPreviews] = useState([]); // State for image previews
  const [userData, setUserData] = useState([]); // State for user data

  const formdata = new FormData(); // FormData instance for file uploads

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    images: [],
    isAdmin: false,
    password: "",
  });

  const [fields, setFields] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch user data and handle authentication on component mount
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount

    const token = localStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true); // User is logged in
    } else {
      history("/signIn"); // Redirect to sign-in page if not logged in
    }

    deleteData("/api/imageUpload/deleteAllImages"); // Clean up old images
    const user = JSON.parse(localStorage.getItem("user"));

    fetchDataFromApi(`/api/user/${user?.userId}`).then((res) => {
      setUserData(res); // Set user data
      setPreviews(res.images); // Set image previews

      setFormFields({
        name: res.name,
        email: res.email,
        phone: res.phone,
      });
    });
  }, []);

  // Handle input change for user profile
  const changeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change for password fields
  const changeInput2 = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  let img_arr = [];
  let uniqueArray = [];
  let selectedImages = [];

  // Handle file input change for image uploads
  const onChangeFile = async (e, apiEndPoint) => {
    try {
      setPreviews([]); // Clear current previews

      const files = e.target.files;
      setUploading(true); // Set uploading state

      for (var i = 0; i < files.length; i++) {
        // Validate and process each file
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(`images`, file);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Please select a valid JPG or PNG image file.",
          });

          return false;
        }
      }

      formFields.images = selectedImages;
      selectedImages.push(selectedImages);
    } catch (error) {
      console.log(error);
    }

    // Upload images and update previews
    uploadImage(apiEndPoint, formdata).then((res) => {
      fetchDataFromApi("/api/imageUpload").then((response) => {
        if (
          response !== undefined &&
          response !== null &&
          response !== "" &&
          response.length !== 0
        ) {
          response.length !== 0 &&
            response.map((item) => {
              item?.images.length !== 0 &&
                item?.images?.map((img) => {
                  img_arr.push(img);
                });
            });

          uniqueArray = img_arr.filter(
            (item, index) => img_arr.indexOf(item) === index
          );

          setPreviews([]);

          const appendedArray = [...previews, ...uniqueArray];

          setPreviews(uniqueArray);

          const user = JSON.parse(localStorage.getItem("user"));

          fetchDataFromApi(`/api/user/${user?.userId}`).then((res) => {
            const data = {
              name: res?.name,
              email: res?.email,
              phone: res?.phone,
              images: uniqueArray,
              isAdmin: res?.isAdmin
            };

            editData(`/api/user/${user?.userId}`, data).then((res) => {
              setTimeout(() => {
                setUploading(false);
                img_arr = [];
                context.setAlertBox({
                  open: true,
                  error: false,
                  msg: "Images Uploaded!",
                });
                setUploading(false);
              }, 200);
            });
          });
        }
      });
    });
  };

  // Handle profile update form submission
  const edituser = (e) => {
    e.preventDefault();

    const appendedArray = [...previews, ...uniqueArray];

    img_arr = [];
    formdata.append("name", formFields.name);
    formdata.append("email", formFields.email);
    formdata.append("phone", formFields.phone);

    formdata.append("images", appendedArray);

    formFields.images = appendedArray;

    if (
      formFields.name !== "" &&
      formFields.email !== "" &&
      formFields.phone !== "" &&
      previews.length !== 0
    ) {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      editData(`/api/user/${user?.userId}`, formFields).then((res) => {
        setIsLoading(false);

        deleteData("/api/imageUpload/deleteAllImages");

        context.setAlertBox({
          open: true,
          error: false,
          msg: "user updated",
        });
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return false;
    }
  };

  // Handle password change form submission
  const changePassword = (e) => {
    e.preventDefault();
    formdata.append("password", fields.password);

    if (
      fields.oldPassword !== "" &&
      fields.password !== "" &&
      fields.confirmPassword !== ""
    ) {
      if (fields.password !== fields.confirmPassword) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Password and confirm password not match",
        });
      } else {
        const user = JSON.parse(localStorage.getItem("user"));

        const data = {
          name: user?.name,
          email: user?.email,
          password: fields.oldPassword,
          newPass: fields.password,
          phone: formFields.phone,
          images: formFields.images,
        };

        editData(`/api/user/changePassword/${user.userId}`, data).then(
          (res) => {
            // Handle response
          }
        );
      }
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return false;
    }
  };

  return (
    <section className="section myAccountPage">
      <div className="container">
        <h2 className="hd">My Account</h2>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="fullWidth"
            >
              <Tab label="Profile" {...a11yProps(0)} />
              <Tab label="Change Password" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <div className="myAccountCard">
              <form>
                <div className="imgUpload">
                  <div className="imgBox">
                    <img
                      src={
                        previews.length === 0
                          ? NoUserImg
                          : previews[0]
                      }
                      alt="Profile"
                      width="100%"
                    />
                    <label htmlFor="upload">
                      {uploading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          <IoMdCloudUpload className="uploadIcon" />
                          <span>Upload</span>
                        </>
                      )}
                    </label>
                    <input
                      type="file"
                      id="upload"
                      multiple
                      onChange={(e) =>
                        onChangeFile(e, "/api/imageUpload/uploadImages")
                      }
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="formField">
                  <TextField
                    name="name"
                    label="Name"
                    variant="outlined"
                    value={formFields.name}
                    onChange={changeInput}
                    fullWidth
                  />
                </div>

                <div className="formField">
                  <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={formFields.email}
                    onChange={changeInput}
                    fullWidth
                  />
                </div>

                <div className="formField">
                  <TextField
                    name="phone"
                    label="Phone"
                    variant="outlined"
                    value={formFields.phone}
                    onChange={changeInput}
                    fullWidth
                  />
                </div>

                <div className="formBtn">
                  <Button
                    onClick={edituser}
                    variant="contained"
                    color="primary"
                  >
                    {isLoading ? <CircularProgress /> : "Update"}
                  </Button>
                </div>
              </form>
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <div className="myAccountCard">
              <form>
                <div className="formField">
                  <TextField
                    name="oldPassword"
                    label="Old Password"
                    type="password"
                    variant="outlined"
                    value={fields.oldPassword}
                    onChange={changeInput2}
                    fullWidth
                  />
                </div>

                <div className="formField">
                  <TextField
                    name="password"
                    label="New Password"
                    type="password"
                    variant="outlined"
                    value={fields.password}
                    onChange={changeInput2}
                    fullWidth
                  />
                </div>

                <div className="formField">
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={fields.confirmPassword}
                    onChange={changeInput2}
                    fullWidth
                  />
                </div>

                <div className="formBtn">
                  <Button
                    onClick={changePassword}
                    variant="contained"
                    color="primary"
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </CustomTabPanel>
        </Box>
      </div>
    </section>
  );
};

export default MyAccount;
