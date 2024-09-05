// Importing necessary components and libraries
import { useContext, useEffect, useState } from "react"; // React hooks for state and context management
import Logo from "../../assets/images/logo.jpg"; // Importing logo image
import { MyContext } from "../../App"; // Importing context for global state management
import TextField from "@mui/material/TextField"; // MUI TextField component for input fields
import Button from "@mui/material/Button"; // MUI Button component for buttons
import { Link, useNavigate } from "react-router-dom"; // Hooks for navigation and routing

import GoogleImg from "../../assets/images/googleImg.png"; // Importing Google login image
import CircularProgress from "@mui/material/CircularProgress"; // MUI CircularProgress component for loading spinner
import { postData } from "../../utils/api"; // Utility function for API calls

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Firebase authentication methods
import { firebaseApp } from "../../firebase"; // Importing configured Firebase app

const auth = getAuth(firebaseApp); // Initialize Firebase Auth
const googleProvider = new GoogleAuthProvider(); // Set up Google Auth provider

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const context = useContext(MyContext); // Accessing global context
  const history = useNavigate(); // Hook for programmatic navigation

  // useEffect hook to hide header and footer when component mounts
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  // State to manage form fields
  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
  });

  // Handler for input field changes
  const onchangeInput = (e) => {
    setFormfields((prevFields) => ({
      ...prevFields,
      [e.target.name]: e.target.value,
    }));
  };

  // Handler for form submission
  const login = (e) => {
    e.preventDefault();

    // Validate form fields
    if (formfields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "email can not be blank!",
      });
      return false;
    }

    if (formfields.password === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "password can not be blank!",
      });
      return false;
    }

    setIsLoading(true); // Set loading state to true
    postData("/api/user/signin", formfields).then((res) => {
      try {
        if (res.error !== true) {
          localStorage.setItem("token", res.token); // Store token in localStorage

          const user = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id,
          };

          localStorage.setItem("user", JSON.stringify(user)); // Store user details in localStorage

          context.setAlertBox({
            open: true,
            error: false,
            msg: res.msg,
          });

          setTimeout(() => {
            history("/"); // Navigate to home page
            context.setIsLogin(true); // Update context to indicate user is logged in
            setIsLoading(false); // Set loading state to false
            context.setisHeaderFooterShow(true); // Show header and footer
          }, 2000);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg,
          });
          setIsLoading(false); // Set loading state to false
        }
      } catch (error) {
        console.log(error); // Log error
        setIsLoading(false); // Set loading state to false
      }
    });
  };

  // Handler for Google sign-in
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; // Access token from Google

        const user = result.user; // Google user info

        // Prepare data for server-side authentication
        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          try {
            if (res.error !== true) {
              localStorage.setItem("token", res.token); // Store token in localStorage

              const user = {
                name: res.user?.name,
                email: res.user?.email,
                userId: res.user?.id,
              };

              localStorage.setItem("user", JSON.stringify(user)); // Store user details in localStorage

              context.setAlertBox({
                open: true,
                error: false,
                msg: res.msg,
              });

              setTimeout(() => {
                history("/"); // Navigate to home page
                context.setIsLogin(true); // Update context to indicate user is logged in
                setIsLoading(false); // Set loading state to false
                context.setisHeaderFooterShow(true); // Show header and footer
              }, 2000);
            } else {
              context.setAlertBox({
                open: true,
                error: true,
                msg: res.msg,
              });
              setIsLoading(false); // Set loading state to false
            }
          } catch (error) {
            console.log(error); // Log error
            setIsLoading(false); // Set loading state to false
          }
        });

        context.setAlertBox({
          open: true,
          error: false,
          msg: "User authentication Successfully!",
        });

      })
      .catch((error) => {
        const errorCode = error.code; // Error code from Firebase
        const errorMessage = error.message; // Error message from Firebase
        const email = error.customData.email; // Email associated with the error
        const credential = GoogleAuthProvider.credentialFromError(error); // AuthCredential from error

        context.setAlertBox({
          open: true,
          error: true,
          msg: errorMessage,
        });
      });
  };

  return (
    <section className="section signInPage">
      <div className="shape-bottom">
        {" "}
        <svg
          fill="#fff"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1921 819.8"
          style={{ enableBackground: "new 0 0 1921 819.8" }}
        >
          {" "}
          <path
            className="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
          ></path>{" "}
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={Logo} alt="Logo" /> {/* Displaying the logo */}
          </div>

          <form className="mt-3" onSubmit={login}>
            <h2 className="mb-4">Sign In</h2>

            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Email"
                type="email"
                required
                variant="standard"
                className="w-100"
                name="email"
                onChange={onchangeInput} // Handle input changes
              />
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Password"
                type="password"
                required
                variant="standard"
                className="w-100"
                name="password"
                onChange={onchangeInput} // Handle input changes
              />
            </div>

            <a className="border-effect cursor txt">Forgot Password?</a> {/* Link for password recovery */}

            <div className="d-flex align-items-center mt-3 mb-3 ">
              <Button type="submit" className="btn-blue col btn-lg btn-big">
                {isLoading === true ? <CircularProgress /> : "Sign In"} {/* Show loading spinner if loading */}
              </Button>
              <Link to="/">
                <Button
                  className="btn-lg btn-big col ml-3"
                  variant="outlined"
                  onClick={() => context.setisHeaderFooterShow(true)}
                >
                  Cancel
                </Button>
              </Link>
            </div>

            <p className="txt">
              Not Registered?{" "}
              <Link to="/signUp" className="border-effect">
                Sign Up
              </Link>
            </p>

            <h6 className="mt-4 text-center font-weight-bold">
              Or continue with social account
            </h6>

            <Button
              className="loginWithGoogle mt-2"
              variant="outlined"
              onClick={signInWithGoogle} // Handle Google sign-in
            >
              <img src={GoogleImg} alt="Google" /> Sign In with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn; // Export the SignIn component
