import { Snackbar } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
import { apiURL } from 'enviornment';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { User } from 'utils/models/User';
import MuiAlert from '@mui/material/Alert';
import { useAuth } from 'reducers/AuthContext';

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

const KycFailure: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success' as 'success' | 'error' | 'info' | 'warning');
    const navigate = useNavigate();
    const { getIntendedDestination } = useAuth();
    const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };
    const token = localStorage.getItem('token');
    const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 2000);
    };

    useEffect(()=>{
       // setKycStatus();
    },[]);

    const setKycStatus =async () =>{
      
      try {
        // Replace 'your-api-endpoint' with the actual API endpoint
        let params = {
          email:localStorage.getItem('username'),
          kycVerification:'Failed'
        }
        const response: AxiosResponse<ApiResponse> = await axios.post(apiURL + '/user/kycStatus', params, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const { errorMsg, successMsgList } = response.data;
        if (successMsgList != null && successMsgList.length > 0) {
          showAlert(successMsgList[0].message, 'success');
         
        } else {

          showAlert(errorMsg[0].message, 'error');
        }

      } catch (error) {
        console.error('Kyc Update failed:', error);
        showAlert('Data fetched unsuccessfully!', 'error');
      }
    }
    
    const Home = () => {
      const intendedDestination = getIntendedDestination();
        navigate(intendedDestination || '/');
      }

  return (
    <div>
            <Navbar/>
    <div className="h-screen flex items-center justify-center bg-red-100">
      <div className="text-center failure-container relative flex flex-col items-center">
        <FaExclamationCircle className="text-red-700 text-4xl" />
        <h1 className="text-4xl">Kyc Failed</h1>
        <p className="text-gray-700 text-2xl">We're sorry, your kyc was not compleated.</p>
        <div className='flex justify-center md:justify-bottom '>
                      <button
                        className="btn-solid-lg " onClick={Home}>
                        <span>Back To Home</span>
                      </button>
                     

                    </div>
      </div>
      
    </div>
    <Snackbar open={openSnackbar} autoHideDuration={1000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
    <Footer/>
        </div>
  );
};

export default KycFailure;
