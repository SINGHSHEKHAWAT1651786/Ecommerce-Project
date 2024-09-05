import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.webp';
import patern from '../../assets/images/pattern.webp';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { FaUserCircle, FaPhoneAlt } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import googleIcon from '../../assets/images/googleIcon.png';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

// Initialize Firebase authentication
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {

    // State variables
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formfields, setFormfields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isAdmin: true
    });

    const history = useNavigate();
    const context = useContext(MyContext);

    // Effect to hide sidebar and header on component mount
    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        window.scrollTo(0, 0);
    }, [context]);

    // Handle input focus
    const focusInput = (index) => {
        setInputIndex(index);
    };

    // Handle form field changes
    const onchangeInput = (e) => {
        setFormfields(prevFields => ({
            ...prevFields,
            [e.target.name]: e.target.value
        }));
    };

    // Handle sign-up form submission
    const signUp = (e) => {
        e.preventDefault();
        try {
            // Basic validation
            if (formfields.name === "") {
                context.setAlertBox({ open: true, error: true, msg: "Name cannot be blank!" });
                return false;
            }
            if (formfields.email === "") {
                context.setAlertBox({ open: true, error: true, msg: "Email cannot be blank!" });
                return false;
            }
            if (formfields.phone === "") {
                context.setAlertBox({ open: true, error: true, msg: "Phone cannot be blank!" });
                return false;
            }
            if (formfields.password === "") {
                context.setAlertBox({ open: true, error: true, msg: "Password cannot be blank!" });
                return false;
            }
            if (formfields.confirmPassword === "") {
                context.setAlertBox({ open: true, error: true, msg: "Confirm password cannot be blank!" });
                return false;
            }
            if (formfields.confirmPassword !== formfields.password) {
                context.setAlertBox({ open: true, error: true, msg: "Passwords do not match" });
                return false;
            }

            setIsLoading(true);

            // Submit form data
            postData("/api/user/signup", formfields).then((res) => {
                if (res.error !== true) {
                    context.setAlertBox({ open: true, error: false, msg: "Registered Successfully!" });
                    setTimeout(() => {
                        setIsLoading(false);
                        history("/login");
                    }, 2000);
                } else {
                    setIsLoading(false);
                    context.setAlertBox({ open: true, error: true, msg: res.msg });
                }
            }).catch(error => {
                setIsLoading(false);
                console.error('Error posting data:', error);
                // Handle error
            });

        } catch (error) {
            console.error(error);
        }
    };

    // Handle Google Sign-In
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
                    if (res.error !== true) {
                        localStorage.setItem("token", res.token);
                        const user = {
                            name: res.user?.name,
                            email: res.user?.email,
                            userId: res.user?.id,
                        };
                        localStorage.setItem("user", JSON.stringify(user));
                        context.setAlertBox({ open: true, error: false, msg: res.msg });
                        setTimeout(() => {
                            context.setIsLogin(true);
                            history("/dashboard");
                        }, 2000);
                    } else {
                        context.setAlertBox({ open: true, error: true, msg: res.msg });
                        setIsLoading(false);
                    }
                }).catch(error => {
                    console.error('Error during Google authentication:', error);
                    setIsLoading(false);
                });

                context.setAlertBox({ open: true, error: false, msg: "User authenticated successfully!" });
            })
            .catch((error) => {
                const errorMessage = error.message;
                context.setAlertBox({ open: true, error: true, msg: errorMessage });
            });
    };

    return (
        <>
            <img src={patern} className='loginPatern' alt="Background pattern" />
            <section className="loginSection signUpSection">
                <div className='row'>
                    {/* Left side section */}
                    <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
                        <h1>BEST UX/UI FASHION <span className='text-sky'>ECOMMERCE DASHBOARD</span> & ADMIN PANEL</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                        <div className='w-100 mt-4'>
                            <Link to={'/'}> 
                                <Button className="btn-blue btn-lg btn-big"><IoMdHome /> Go To Home</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right side sign-up form */}
                    <div className='col-md-4 pr-0'>
                        <div className="loginBox">
                            <div className='logo text-center'>
                                <img src={Logo} width="60px" alt="Logo" />
                                <h5 className='font-weight-bold'>Register a new account</h5>
                            </div>

                            <div className='wrapper mt-3 card border'>
                                <form onSubmit={signUp}>
                                    {/* Form Fields */}
                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><FaUserCircle /></span>
                                        <input type='text' className='form-control' placeholder='Enter your name' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="name" onChange={onchangeInput} />
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input type='text' className='form-control' placeholder='Enter your email' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name="email" onChange={onchangeInput} />
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><FaPhoneAlt /></span>
                                        <input type='number' className='form-control' placeholder='Enter your phone' onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} name="phone" onChange={onchangeInput} />
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input type={isShowPassword ? 'text' : 'password'} className='form-control' placeholder='Enter your password' onFocus={() => focusInput(3)} onBlur={() => setInputIndex(null)} name="password" onChange={onchangeInput} />
                                        <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                                            {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input type={isShowConfirmPassword ? 'text' : 'password'} className='form-control' placeholder='Confirm password' onFocus={() => focusInput(4)} onBlur={() => setInputIndex(null)} name="confirmPassword" onChange={onchangeInput} />
                                        <span className='toggleShowPassword' onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                                            {isShowConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>

                                    {/* Remember me checkbox */}
                                    <div className="form-check">
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="I agree to the terms and conditions" />
                                    </div>

                                    {/* Submit button */}
                                    <div className='text-center'>
                                        <Button className="btn-blue btn-lg btn-big" type='submit'>
                                            {isLoading ? <CircularProgress color="inherit" /> : "Create Account"}
                                        </Button>
                                    </div>

                                    {/* Google Sign-In */}
                                    <div className='d-flex justify-content-center'>
                                        <Button className="btn-outline" onClick={signInWithGoogle}>
                                            <img src={googleIcon} alt="Google Icon" width="20px" />
                                            &nbsp; Sign Up With Google
                                        </Button>
                                    </div>
                                </form>

                                <p className='text-center mt-2'>
                                    Already have an account? <Link to="/login">Log in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignUp;
