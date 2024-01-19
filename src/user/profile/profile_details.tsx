import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import 'react-international-phone/style.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { apiURL } from '../../enviornment';
import { MuiPhone } from '../../utils/MuiPhone ';
import { isValidPhoneNumber } from '../../utils/phoneNumberUtils'; // Adjust the import path
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { User } from '../../utils/models/User';
import axiosInstance from '../../utils/intercepter';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
interface SuccessMessage {
  messageType: string;
  message: string;
}

interface ApiResponse {
  data: {
    user: User;
  };
  errorMsg: any[]; // Change this to a more specific type if needed
  successMsgList: SuccessMessage[];
}
const ProfileDetails: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [iskycEnabled, setIsKycEnabled] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success' as 'success' | 'error' | 'info' | 'warning');
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { profile } = useParams();
  const [activeItem, setActiveItem] = useState(profile);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [autocomplete ,setAutoComplete] = useState<any>(null);
  const passwordString = 'password'
  let timeoutId;
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNo: '',
      countryCode: '',
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
      mobileNo: Yup.string().required('Mobile number is required').test('isValidPhoneNumber', 'Invalid phone number', function (value) {
        const { countryCode } = this.parent;
        return isValidPhoneNumber(value, countryCode);
      }),
      streetAddress: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipcode: Yup.string().required('ZipCOde is required'),
      country: Yup.string().required('Country is required'),
    }),
    onSubmit: async (values) => {

      const data = values;
      const uData = userData;
      let params = {
        id: uData?.id,
        lastName: data.lastName,
        firstName: data.firstName,
        mobileNo: data.mobileNo.replace(`+${data.countryCode}`, ''),
        countryCode: data.countryCode,
        streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country

      }
      try {
        // Replace 'your-api-endpoint' with the actual API endpoint
        const response: AxiosResponse<ApiResponse> = await axios.post(apiURL + '/user/updateProfile', params, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const { errorMsg, successMsgList } = response.data;
        if (successMsgList != null && successMsgList.length > 0) {
          showAlert(successMsgList[0].message, 'success');
          
         
        } else {
          showAlert(errorMsg[0].message, 'warning');
        }

      } catch (error) {
        console.error('Signup failed:', error);
        showAlert('Data fetched unsuccessfully!', 'error');
      }


    },
  });
  
  const udapteForm = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .test('passwords-match', 'Passwords must not match the old password', function (value) {
      const { oldPassword } = this.parent;
      return value !== oldPassword;
    }),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    
    }),
    onSubmit: async (values) => {

      const data = values;
      const uData = userData;
      let params = {
        email:username,
        password:data.confirmPassword,
        oldPassword:data.oldPassword
      }
      try {
        // Replace 'your-api-endpoint' with the actual API endpoint
        const response: AxiosResponse<ApiResponse> = await axios.post(apiURL + '/user/resetPassword', params, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const { errorMsg, successMsgList } = response.data;
        if (successMsgList != null && successMsgList.length > 0) {
          showAlert(successMsgList[0].message, 'success');
          udapteForm.resetForm();
        } else {

          if(errorMsg[0].message==="Account is Temporarily locked due to too many failed attempts!"){
            
            localStorage.removeItem('token');
            showAlert(errorMsg[0].message, 'error');
            
            setTimeout(function () {
              navigate('/login', { replace: true });
          }, 3000);
    
          }

          showAlert(errorMsg[0].message, 'error');
        }

      } catch (error) {
        console.error('Signup failed:', error);
        showAlert('Data fetched unsuccessfully!', 'error');
      }


    },
  });

  useEffect(() => {
   
    if(null == autocomplete){
      setAutoComplete(new google.maps.places.Autocomplete(document.getElementById('autocomplete')! as HTMLInputElement, {componentRestrictions: { country: ["aus"] },}));
       if(autocomplete != null){
           autocomplete.addListener("place_changed", handlePlaceSelect)
        }
    }else{
        autocomplete.addListener("place_changed", handlePlaceSelect)
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

   const updatedValues = {
    streetAddress: address1,
    city: locality,
    state: state1,
    zipcode: postcode,
    country: country1
  };
  
  formik.setValues(prevValues => ({
    ...prevValues,
    ...updatedValues
  }));

   
 };
  useEffect(() => {
    const fetchData = async () => {
      try {


        if (!username || !token) {
          // Handle the case where username or token is missing
          return;
        }

        const response: AxiosResponse<ApiResponse> = await axiosInstance.get(apiURL + '/user/userDetail/' + username, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const { errorMsg, successMsgList, data } = response.data;

        if (successMsgList != null && successMsgList.length > 0) {
          //showAlert(successMsgList[0].message, 'success');
          setUserData(data.user);
          if (data.user?.kycVerification === 'PENDING') {
            setIsKycEnabled(false)
          } else {
            setIsKycEnabled(true)
          }
          formik.setValues({
            ...formik.values,
            firstName: typeof data.user?.firstName === 'string' ? data.user.firstName : '',
            lastName: typeof data.user?.lastName === 'string' ? data.user.lastName : '',
            mobileNo: typeof data.user?.mobileNo === 'number' ? '+' + data.user.countryCode + data.user.mobileNo : '',
            email: typeof data.user?.email === 'string' ? data.user.email : '',
            countryCode: typeof data.user?.countryCode === 'string' ? data.user.countryCode : '',
            streetAddress: typeof data.user?.streetAddress === 'string' ? data.user.streetAddress : '',
            city: typeof data.user?.city === 'string' ? data.user.city : '',
            state: typeof data.user?.state === 'string' ? data.user.state : '',
            zipcode: typeof data.user?.zipcode === 'string' ? data.user.zipcode : '',
            country: typeof data.user?.country === 'string' ? data.user.country : ''
          });
        } else {
          showAlert(errorMsg[0].message, 'warning');
        }

        console.log(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [username, token, formik.setValues]);

  const handlePhoneChange = (phoneData: any, dialCode: any) => {
    //const { country, phone } = phoneData;
    // const phoneNumber = phoneData.replace(`+${country.dialCode}`, '');
    //console.log(phoneNumber);
    formik.setFieldValue('countryCode', dialCode);
    formik.setFieldValue('mobileNo', phoneData);
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
  const Home = () => {
    navigate('/', { replace: true });
  }
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  const handleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowPassword) => !prevShowPassword);
};
const handleNewPasswordVisibility = () => {
  setShowNewPassword((prevShowPassword) => !prevShowPassword);
};
const handleConfirmPasswordVisibility = () => {
  setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
};

const moveToKyc = () =>{
  navigate(`/kyc`);
}
  return (
    <section >
      <div>
        <div className="max-w-screen-xl mx-auto start  my-10 p-8">
          <h1 className="text-2xl font-bold text-gray-700 px-6 md:px-0">Account Settings</h1>
          <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-600 mt-3 px-6 md:px-0">
            <li className={`mr-8 ${activeItem === 'profile' ? 'text-gray-900 border-b-2 border-gray-800' : ''}`}>
              <a className="py-4 inline-block" onClick={() => handleItemClick('profile')}>
                Profile Info
              </a>
            </li>
            <li className={`mr-8 hover:text-gray-900 ${activeItem === 'password' ? 'border-b-2 border-gray-800' : ''}`}>
              <a className="py-4 inline-block" onClick={() => handleItemClick('password')}>
                Update Password
              </a>
            </li>
          </ul>
          {activeItem === 'profile' && (
            <div className="w-full bg-white rounded-lg mx-auto mt-1 md:mt-8 flex overflow-hidden rounded-b-none">
              <div className="w-1/3 bg-gray-100 p-8 hidden md:inline-block">
                <h2 className="font-medium text-md text-gray-700 mb-4 tracking-wide">Profile Info</h2>
                <p className="text-xs text-gray-500">Update your basic profile information such as Email Address, Name, and Image.</p>
              </div>
              <div className="md:w-2/3 w-full">
                <form onSubmit={formik.handleSubmit} className=" my-2 mx-2 md:my-5 md:mx-5">
                  <div className="flex flex-col space-y-5">
                    <div className="flex flex-row justify-between gap-4">
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        disabled={iskycEnabled}
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
                        disabled={iskycEnabled}
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        margin="normal"
                      />
                    </div>
                    <MuiPhone name="mobileNo" disabled={iskycEnabled} onChange={handlePhoneChange} value={formik.values.mobileNo}
                      error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
                      helperText={formik.touched.mobileNo && formik.errors.mobileNo} />
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      disabled
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      margin="normal"
                    />
                     <TextField fullWidth id="autocomplete"  label="Please enter new address"/>

                     <div className="flex flex-row justify-between gap-4">
                      <TextField
                        fullWidth
                        id="streetAddress"
                        name="streetAddress"
                        label="Street Address"
                        required
                        disabled
                        value={formik.values.streetAddress}
                        onChange={formik.handleChange}
                        error={formik.touched.streetAddress && Boolean(formik.errors.streetAddress)}
                        helperText={formik.touched.streetAddress && formik.errors.streetAddress}
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        id="city"
                        name="city"
                        label="City"
                        required
                        disabled
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        error={formik.touched.city && Boolean(formik.errors.city)}
                        helperText={formik.touched.city && formik.errors.city}
                        margin="normal"
                      />
                    </div>
                    <div className="flex flex-row justify-between gap-4">
                      <TextField
                        fullWidth
                        id="state"
                        name="state"
                        label="State"
                        required
                        disabled
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        error={formik.touched.state && Boolean(formik.errors.state)}
                        helperText={formik.touched.state && formik.errors.state}
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        id="zipcode"
                        name="zipcode"
                        label="Zipcode"
                        required
                        disabled
                        value={formik.values.zipcode}
                        onChange={formik.handleChange}
                        error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                        helperText={formik.touched.zipcode && formik.errors.zipcode}
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        id="country"
                        name="country"
                        label="Country"
                        required
                        disabled
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        error={formik.touched.country && Boolean(formik.errors.country)}
                        helperText={formik.touched.country && formik.errors.country}
                        margin="normal"
                      />
                    </div>


                    <div className='flex justify-center md:justify-end'>
                      <button
                        className="btn-solid-lg secondary" onClick={Home}>
                        <span>Back </span>
                      </button>
                      <button
                        className="btn-solid-lg" type="submit">
                        <span>Update Profile </span>
                      </button>
                      <button  onClick={() => moveToKyc()} className="btn-solid-lg">
                          <span > KYC</span>
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          )}
          {activeItem === 'password' && (
            <div className="w-full bg-white rounded-lg mx-auto mt-1 md:mt-8 flex overflow-hidden rounded-b-none">
              <div className="w-1/3 bg-gray-100 p-8 hidden md:inline-block">
                <h2 className="font-medium text-md text-gray-700 mb-4 tracking-wide">Password Update</h2>
                <p className="text-xs text-gray-500">Update Password.</p>
              </div>
              <div className="md:w-2/3 w-full">
                <form onSubmit={udapteForm.handleSubmit} className=" my-2 mx-2 md:my-5 md:mx-5">
                  <div className="flex flex-col space-y-5">


                    <TextField
                      fullWidth
                      id="oldPassword"
                      name="oldPassword"
                      label="Old Password"
                      type={showOldPassword ? 'text' : 'password'}
                      value={udapteForm.values.oldPassword}
                      onChange={udapteForm.handleChange}
                      error={udapteForm.touched.oldPassword && Boolean(udapteForm.errors.oldPassword)}
                      helperText={udapteForm.touched.oldPassword && udapteForm.errors.oldPassword}
                      margin="normal"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleOldPasswordVisibility} edge="end">
                                                {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                    />
                    <TextField
                      fullWidth
                      id="newPassword"
                      name="newPassword"
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={udapteForm.values.newPassword}
                      onChange={udapteForm.handleChange}
                      error={udapteForm.touched.newPassword && Boolean(udapteForm.errors.newPassword)}
                      helperText={udapteForm.touched.newPassword && udapteForm.errors.newPassword}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleNewPasswordVisibility} edge="end">
                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    />
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={udapteForm.values.confirmPassword}
                      onChange={udapteForm.handleChange}
                      error={udapteForm.touched.confirmPassword && Boolean(udapteForm.errors.confirmPassword)}
                      helperText={udapteForm.touched.confirmPassword && udapteForm.errors.confirmPassword}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleConfirmPasswordVisibility} edge="end">
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    />
                    <div className='flex justify-center md:justify-end'>
                      <button
                        className="btn-solid-lg secondary" onClick={Home}>
                        <span>Back </span>
                      </button>
                      <button
                        className="btn-solid-lg" type="submit">
                        <span>Update Password </span>
                      </button>

                    </div>

                  </div>
                </form>
              </div>
            </div>
          )}


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

export default ProfileDetails;
