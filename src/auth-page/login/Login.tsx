import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import axios, { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'reducers/AuthContext';
import * as Yup from 'yup';
import companyLogo from '../../assets/images/spo_logo.png';
import { apiURL } from '../../enviornment';
interface Message {
    messageType: string;
    message: string;
}
interface ApiResponse {
    data: Record<string, any>;
    errorMsg: Message[];
    successMsgList: Message[];
}
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success' as 'success' | 'error' | 'info' | 'warning');
    const navigate = useNavigate();
    const { getIntendedDestination } = useAuth();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',

        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters')
                .required('Password is required'),

        }),
        onSubmit: async (values) => {

            const data = values;

            let params = {
                username: data.email.toLowerCase(),
                password: data.password
            }
            try {
                // Replace 'your-api-endpoint' with the actual API endpoint
                const response: AxiosResponse<ApiResponse> = await axios.post(apiURL + '/auth/authorization', params);
                const { errorMsg, successMsgList } = response.data;
                if (successMsgList != null && successMsgList.length > 0) {
                    showAlert(successMsgList[0].message, 'success');
                    const jwtToken = response.data.data.token;
                    localStorage.setItem('token', jwtToken);
                    localStorage.setItem('username', params.username);
                    const intendedDestination = getIntendedDestination();
                    navigate(intendedDestination || '/');
                    

                } else {
                    showAlert(errorMsg[0].message, 'error');
                }

            } catch (error) {
                showAlert('Data fetched unsuccessfully!', 'error');
            }


        },
    });

    const Home = () => {
        navigate('/', { replace: true });
    }
    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
        setTimeout(() => {
            setOpenSnackbar(false);
        }, 3000);
    };
    const handleDownload = async (documentName: string) => {
        try {
            // Fetch the PDF content from a local file
            const pdfPath = `/assets/documents/${documentName}.pdf`;
            window.open(pdfPath, '_blank');
        } catch (error) {
        }
    };
    return (
        <section>
            <div className="max-w-lg mx-auto center header my-10 p-8 rounded-xl shadow shadow-slate-300">
                <div className='flex'>
                    <div className="w-3/4 ">
                        <h1 className="text-4xl mb-2 font-medium">Sign In</h1>
                        <p className="text-slate-500">Hi, Welcome to SPO Markets</p>
                    </div>
                    <div className="w-1/3 flex items-start justify-end cursor-pointer" onClick={Home}>
                        <img src={companyLogo} className='w-16' alt='' />
                    </div>
                </div>
                <h6 className='mt-2 text-sm text-darkGrayishBlue'>
                    By logging in to SPO Markets, I agree to the{' '}
                    <a onClick={() => handleDownload("terms_conditions")} className='font-semibold text-indigo-600 hover:text-gray-500 cursor-pointer'>
                        Conditions of use
                    </a>{' '}
                    and{' '}
                    <a onClick={() => handleDownload("privacy_policy")} className='font-semibold text-indigo-600 hover:text-gray-500 cursor-pointer' >
                        Privacy policy
                    </a>
                </h6>
                <form onSubmit={formik.handleSubmit} className="my-5">
                    <div className="flex flex-col space-y-5">
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            autoComplete="off"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            autoComplete="off"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className="flex flex-row justify-between">
                            <div>
                                <label htmlFor="remember" className="">
                                    <input type="checkbox" id="remember" className="w-4 h-4 border-slate-200 focus:bg-indigo-600" />
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <div className="font-medium text-gray-600 ">
                                    Forgot Password ?
                                </div>
                            </div>
                        </div>
                        <button className="btn-solid-lg">
                            <span>Login</span>
                        </button>
                        <p className="text-center">
                            Not registered yet?{' '}
                            <a href="./signup" className="text-indigo-600 font-medium inline-flex space-x-1 items-center">
                                <span>Register now </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </span>
                            </a>
                        </p>
                    </div>
                </form>
                <Snackbar open={openSnackbar} autoHideDuration={1000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </div>
        </section>
    );
}