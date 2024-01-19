import React, { FormEvent, useState, useEffect } from 'react';
import { GoogleReCaptcha, GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import 'react-international-phone/style.css';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/images/spo_logo.png';
import axios, { AxiosResponse } from 'axios';
import { apiURL } from '../../enviornment';
import { MuiPhone } from '../../utils/MuiPhone ';
import { isValidPhoneNumber } from '../../utils/phoneNumberUtils'; // Adjust the import path
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { jsPDF } from 'jspdf';
import { Address } from 'utils/models/User';
interface Message {
    messageType: string;
    message: string;
}
interface ApiResponse {
    data: Record<string, any>;
    errorMsg: Message[];
    successMsgList: Message[];
}
const SignUpForm: React.FC = () => {
    const [token, setToken] = useState<string | undefined>(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success' as 'success' | 'error' | 'info' | 'warning');
    const { executeRecaptcha } = useGoogleReCaptcha();
    const navigate = useNavigate();
    const [userAddress ,setUserAddress] = useState<Address>();
    const [autocomplete ,setAutoComplete] = useState<any>(null);
    let timeoutId;
    useEffect(() => {
        const fetchReCaptchaToken = async () => {
            if (executeRecaptcha) {
                const token = await executeRecaptcha("register");
                console.log('ReCAPTCHA token on page load:', token);
                setRecaptchaToken(token);
            } else {
                console.error('executeRecaptcha is not available.');
            }
        };

        fetchReCaptchaToken();
    }, [executeRecaptcha]);
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            mobileNo: '',
            countryCode: '',
            countryAnother: "",
            streetAddress: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters')
                .required('Password is required')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                ),
            mobileNo: Yup.string().required('Mobile number is required').test('isValidPhoneNumber', 'Invalid phone number', function (value) {
                const { countryCode } = this.parent;
                return isValidPhoneNumber(value, countryCode);
            }),
        }),
        onSubmit: async (values) => {

            const data = values;
            if (recaptchaToken) {
                let params = {
                    password: data.password,
                    lastName: data.lastName,
                    firstName: data.firstName,
                    email: data.email.toLowerCase(),
                    mobileNo: data.mobileNo.replace(`+${data.countryCode}`, ''),
                    countryCode: data.countryCode,
                    r_request: recaptchaToken,
                    streetAddress: userAddress?.streetAddress,
                    city:  userAddress?.city,
                    state:  userAddress?.state,
                    zipcode:  userAddress?.zipcode,
                    country:  userAddress?.country
                }
                try {
                    // Replace 'your-api-endpoint' with the actual API endpoint
                    const response: AxiosResponse<ApiResponse> = await axios.post(apiURL + '/user/registration', params);
                    const { errorMsg, successMsgList } = response.data;
                    if (successMsgList != null && successMsgList.length > 0) {
                        showAlert(successMsgList[0].message, 'success');
                        timeoutId = setTimeout(() => {
                            navigate('/login', { replace: true });
                        }, 2000);

                    } else {
                        showAlert(errorMsg[0].message, 'warning');
                    }

                } catch (error) {
                    console.error('Signup failed:', error);
                    showAlert('Data fetched unsuccessfully!', 'error');
                }
            } else {
                showAlert('ReCAPTCHA token is not available!', 'error');
                console.error('ReCAPTCHA token is not available.');
            }

        },
    });
    const handlePhoneChange = (phoneData: any, dialCode: any) => {
        //const { country, phone } = phoneData;
        // const phoneNumber = phoneData.replace(`+${country.dialCode}`, '');
        //console.log(phoneNumber);
        formik.setFieldValue('countryCode', dialCode);
        formik.setFieldValue('mobileNo', phoneData);
    };
    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    const Home = () => {
        navigate('/', { replace: true });
    }
    const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
        setTimeout(() => {
            setOpenSnackbar(false);
        }, 2000);
    };
    const handleDownload = async (documentName: string) => {
        try {
            // Fetch the PDF content from a local file
            const pdfPath = `/assets/documents/${documentName}.pdf`;
            window.open(pdfPath, '_blank');
        } catch (error) {
            console.error('Error fetching or creating PDF:', error);
        }
    };


    useEffect(() => {
   
        if(null == autocomplete){
            setAutoComplete(new google.maps.places.Autocomplete(document.getElementById('autocomplete')! as HTMLInputElement, {componentRestrictions: { country: ["aus"] },}));
            if(autocomplete != null){
                autocomplete.addListener("place_changed", handlePlaceSelect);
            }
        }else{
             autocomplete.addListener("place_changed", handlePlaceSelect);
        }
        
      },[autocomplete]);
    
      const  handlePlaceSelect = () => {
         let address1 = "";
      let postcode = "";
      let locality="";
      let state1="";
      let country1="";
       let addressObject = autocomplete.getPlace();
       let address = addressObject.address_components;
    
       for (const component of address) {
        const componentType = component.types[0];
    
        switch (componentType) {
          case "street_number": {
            address1 = `${component.long_name} ${address1}`;
            break;
          }
    
          case "route": {
            address1 += component.short_name;
            break;
          }
    
          case "postal_code": {
            postcode = `${component.long_name}${postcode}`;
            break;
          }
    
          case "postal_code_suffix": {
            postcode = `${postcode}-${component.long_name}`;
            break;
          }
    
          case "locality":
            locality =
              component.long_name;
            break;
    
          case "administrative_area_level_1": {
            state1 =
              component.long_name;
            break;
          }
    
          case "country":
            country1 =
              component.long_name;
            break;
        }
       }

      setUserAddress(  {'streetAddress':address1,
      'city':locality,
      'state':state1,
      'zipcode':postcode,
      'country':country1});  
    //    formik.setValues({
    //     ...formik.values,
    //     firstName: formik.values.firstName,
    //     lastName: formik.values.lastName ,
    //     mobileNo: formik.values.countryCode + formik.values.mobileNo ,
    //     email: formik.values.email ,
    //     countryCode: formik.values.countryCode ,
    //     streetAddress:address1,
    //     city:  locality,
    //     state:  state1,
    //     zipcode: postcode,
    //     country:  country1
    //   });
    
       
     };

    return (
        <section>

            <div>
                <div className="max-w-lg mx-auto center header my-10 p-8 rounded-xl shadow shadow-slate-300">
                    <div className='flex'>
                        <div className="w-3/4 ">
                            <h1 className="text-4xl mb-2 font-medium">Sign Up</h1>
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
                    {/* <div className="my-5">
            <button className="w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-6 h-6" alt="" /> <span>Sign Up with Google</span>
            </button>
        </div> */}

                    <form onSubmit={formik.handleSubmit} className="my-5">
                        <div className="flex flex-col space-y-5">
                            <div className="flex flex-row justify-between gap-4">
                                <TextField
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    margin="normal"
                                />

                                <TextField
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    margin="normal"
                                />
                            </div>


                            {/* <PhoneInput
                            name="mobileNo"
                            defaultCountry="au"
                            value={formik.values.mobileNo}
                            onChange={(phone) => formik.setFieldValue('mobileNo', phone)}
                            inputStyle={{ width: '100%', marginTop: '16px' }}
                        /> */}
                            <MuiPhone name="mobileNo" onChange={handlePhoneChange} value={formik.values.mobileNo}
                                error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
                                helperText={formik.touched.mobileNo && formik.errors.mobileNo} />
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                margin="normal"
                            />
                            <TextField fullWidth id="autocomplete"  label="Location"/>

                            
                            {/* <Autocomplete
                                apiKey={YOUR_GOOGLE_MAPS_API_KEY}
                                onPlaceSelected={(place) => console.log(place)}
                            /> */}

                            <TextField
                                fullWidth
                                id="password"
                                name="password"
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
                                {/* <div>
                                    <a href="#" className="font-medium text-indigo-600">
                                        Forgot Password?
                                    </a>
                                </div> */}
                            </div>
                            <div className="g-recaptcha" data-sitekey="6Le22skZAAAAAAKGyUL9nj0jHflbWdn9vC4gNAYa" data-badge="inline" data-size="invisible" data-callback="setResponse"></div>
                            <button
                                className="btn-solid-lg" type="submit">
                                <span>Sign Up </span>
                            </button>
                            <p className="text-center">
                                Already have an account?{' '}
                                <a href="./login" className="text-indigo-600 font-medium inline-flex space-x-1 items-center">
                                    <span>Login </span>
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
            </div>

        </section>


    );
};

export default SignUpForm;