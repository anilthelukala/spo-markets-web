import axios, { AxiosResponse } from 'axios';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
import { apiURL } from 'enviornment';
import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
interface SuccessMessage {
  messageType: string;
  message: string;
}

interface ApiResponse {
  data: {
    user: any;
  };
  errorMsg: any[]; // Change this to a more specific type if needed
  successMsgList: SuccessMessage[];
}
const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    const token = localStorage.getItem('token');
    const Home = () => {
        navigate('/', { replace: true });
      }
      useEffect(()=>{
        updatePaymentStatus();
    },[]);
    const updatePaymentStatus =async () =>{
      
      try {
        // Replace 'your-api-endpoint' with the actual API endpoint
        let params = {
          orderId:orderId,
          paymentStatus:'COMPLETED'
        }
        const response: AxiosResponse<ApiResponse> = await axios.post(apiURL + '/payments/paymentStatus', params, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const { errorMsg, successMsgList } = response.data;
        if (successMsgList != null && successMsgList.length > 0) {
        
         
        } else {

         
        }

      } catch (error) {
        console.error('Kyc Update failed:', error);
       
      }
    }
    return (
        <div>
            <Navbar/>
            <div className="h-screen flex items-center justify-center bg-green-100">
                <div className="text-center success-container relative flex flex-col items-center">
                    <FaCheckCircle className="text-green-700 text-4xl " />
                    <h1 className="text-4xl mb-2">Payment Successful!</h1>
                    <p className="text-gray-700 text-2xl mb-2">Thank you for your payment. Your orderId {orderId} was successful.</p>

                    <div className='flex justify-center md:justify-bottom '>
                      <button
                        className="btn-solid-lg " onClick={Home}>
                        <span>Back To Home</span>
                      </button>
                     

                    </div>
                </div>
            </div>
            
            <Footer/>
        </div>

    );
};

export default PaymentSuccess;
