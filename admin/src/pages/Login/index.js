import React, { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.webp'; // Import logo image
import patern from '../../assets/images/pattern.webp'; // Import pattern background image
import { MyContext } from '../../App'; // Import context for global state management
import { MdEmail } from "react-icons/md"; // Import email icon
import { RiLockPasswordFill } from "react-icons/ri"; // Import password icon
import { IoMdEye, IoMdEyeOff } from "react-icons/io"; // Import eye icons for password visibility toggle
import Button from '@mui/material/Button'; // Import MUI Button component
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate from react-router-dom

import googleIcon from '../../assets/images/googleIcon.png'; // Import Google icon
import CircularProgress from '@mui/material/CircularProgress'; // Import MUI CircularProgress for loading state
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Import Firebase authentication methods
import { firebaseApp } from "../../firebase"; // Import configured Firebase app

const auth = getAuth(firebaseApp); // Initialize Firebase Authentication
const googleProvider = new GoogleAuthProvider(); // Create Google provider instance

const Login = () => {
    const [inputIndex, setInputIndex] = useState(null); // State to track focused input field
    const [isShowPassword, setIsShowPassword] = useState(false); // State to toggle password visibility
    const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner
    const [isLogin, setIsLogin] = useState(false); // State to manage login status
    
    const history = useNavigate(); // Hook to programmatically navigate
    const context = useContext(MyContext); // Access global context

    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
        isAdmin: true
    });

    useEffect(() => {
        context.setisHideSidebarAndHeader(true); // Hide sidebar and header on login page

        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
            history("/");
        } else {
            history("/login");
        }
    }, [context, history]);

    const focusInput = (index) => {
        setInputIndex(index); // Set focused input field index
    };

    const onChangeInput = (e) => {
        setFormFields(prevFields => ({
            ...prevFields,
            [e.target.name]: e.target.value
        }));
    };

    const signIn = (e) => {
        e.preventDefault();

        if (!formFields.email) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "email can not be blank!"
            });
            return;
        }

        if (!formFields.password) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "password can not be blank!"
            });
            return;
        }

        setIsLoading(true);
        postData("/api/user/signin", formFields).then((res) => {
            try {
                if (!res.error) {
                    localStorage.setItem("token", res.token);

                    if (res.user?.isAdmin) {
                        const user = {
                            name: res.user?.name,
                            email: res.user?.email,
                            userId: res.user?.id,
                            isAdmin: res.user?.isAdmin
                        };

                        localStorage.removeItem('user');
                        localStorage.setItem("user", JSON.stringify(user));

                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "User Login Successfully!"
                        });

                        setTimeout(() => {
                            context.setIsLogin(true);
                            history("/dashboard");
                            setIsLoading(false);
                        }, 2000);
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: "you are not an admin"
                        });
                        setIsLoading(false);
                    }
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        });
    };

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                const fields = {
                    name: user.providerData[0].displayName,
                    email: user.providerData[0].email,
                    password: null,
                    images: user.providerData[0].photoURL,
                    phone: user.providerData[0].phoneNumber,
                    isAdmin: true
                };

                postData("/api/user/authWithGoogle", fields).then((res) => {
                    try {
                        if (!res.error) {
                            localStorage.setItem("token", res.token);

                            const user = {
                                name: res.user?.name,
                                email: res.user?.email,
                                userId: res.user?.id
                            };

                            localStorage.setItem("user", JSON.stringify(user));

                            context.setAlertBox({
                                open: true,
                                error: false,
                                msg: res.msg
                            });

                            setTimeout(() => {
                                context.setIsLogin(true);
                                history("/dashboard");
                            }, 2000);
                        } else {
                            context.setAlertBox({
                                open: true,
                                error: true,
                                msg: res.msg
                            });
                            setIsLoading(false);
                        }
                    } catch (error) {
                        console.log(error);
                        setIsLoading(false);
                    }
                });

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "User authentication Successfully!"
                });
            })
            .catch((error) => {
                const errorMessage = error.message;
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: errorMessage
                });
            });
    };

    return (
        <>
            <img src={patern} className='loginPatern' /> {/* Background pattern image */}
            <section className="loginSection">
                <div className="loginBox">
                    <div className='logo text-center'>
                        <img src={Logo} width="60px" /> {/* Logo image */}
                        <h5 className='font-weight-bold'>Login to Hotash</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={signIn}>
                            <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><MdEmail /></span> {/* Email icon */}
                                <input type='text' className='form-control' placeholder='enter your email' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="email" onChange={onChangeInput} />
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span> {/* Password icon */}
                                <input type={`${isShowPassword ? 'text' : 'password'}`} className='form-control' placeholder='enter your password'
                                    onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name="password" onChange={onChangeInput} />

                                <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />} {/* Toggle password visibility icon */}
                                </span>
                            </div>

                            <div className='form-group'>
                                <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                    {isLoading ? <CircularProgress /> : 'Sign In '} {/* Show loading spinner if isLoading is true */}
                                </Button>
                            </div>

                            <div className='form-group text-center mb-0'>
                                <Link to={'/forgot-password'} className="link">FORGOT PASSWORD</Link> {/* Link to forgot password page */}
                                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                    <span className='line'></span>
                                    <span className='txt'>or</span>
                                    <span className='line'></span>
                                </div>

                                <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle' onClick={signInWithGoogle}>
                                    <img src={googleIcon} width="25px" /> &nbsp; Sign In with Google {/* Button for Google sign-in */}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className='wrapper mt-3 card border footer p-3'>
                        <span className='text-center'>
                            Don't have an account?
                            <Link to={'/signUp'} className='link color ml-2'>Register</Link> {/* Link to registration page */}
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;
