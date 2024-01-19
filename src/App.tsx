import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './landing-page/LandingPage';
import CaptchLogin from './auth-page/CaptchaLogin';
import CaptchSignUp from './auth-page/CaptchSignUp';
import './App.css';
import { LoaderProvider } from './utils/Loader/LoaderContext';
import Loader from './utils/Loader/Loader';
import PropertyDetails from './property/property_details/property_nav';
import Profile from './user/profile/profile_nav';
import axios from 'axios';
import { apiURL } from './enviornment';
import InvestmentCalculatorDetails from 'property/investment_calculator/investment_calculator_nav';
import PropertyListPage from 'property/property_list/propertylist_nav';
import CartDetails from 'property/cart/cart_nav';
import { ScrollToTop } from 'react-router-scroll-to-top';
import Kyc from 'user/kyc/Kyc';
import PaymentSuccess from 'stripe_response/success';
import PaymentFailure from 'stripe_response/failure';
import KycSuccess from 'kyc_response/success';
import KycFailure from 'kyc_response/failure';
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);


  // Schedule token refresh every 30 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 29 * 60 * 1000);

    // Clear the interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const refreshAccessToken = async () => {
    try {
      const oldToken = localStorage.getItem('token');
      // console.log('Access token Notrefreshed:', oldToken);
      if (oldToken) {
        const response = await axios.post(apiURL + '/auth/refresh', { token: oldToken }, {
          headers: {
            Authorization: `Bearer ${oldToken}`,
            'Content-Type': 'application/json', // Specify the content type if needed
          },
        });
        const newRefreshToken = response.data.data.token;

        // Update the stored tokens with the new values

        if (newRefreshToken) {
          localStorage.setItem('token', newRefreshToken);
        }

        console.log('Access token refreshed:', newRefreshToken);
      }
    } catch (error) {
      console.error('Error refreshing access token', error);
      // Handle the error, e.g., redirect to the login page
    }
  };
  return (

    <Router>
     
        <LoaderProvider>
         
         
            <div>
            <ScrollToTop>
              {loading && <Loader />}
              <div className={`content ${loading ? 'loading' : ''}`}>
                <div>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route path="/login" element={<CaptchLogin />} />

                    <Route path="/signup" element={<CaptchSignUp />} />
                    <Route path="/DetailsPage/:propertyId" element={<PropertyDetails />} />
                    <Route path="/profileDetails/:profile" element={<Profile />} />
                    <Route path="/investment/:propertyId"  element={<InvestmentCalculatorDetails />} />
                    <Route path="/propertyList" element={<PropertyListPage />} />
                    <Route path="/cart" element={<CartDetails />} />
                    <Route path="/investment/:propertyId/:cartId" element={<InvestmentCalculatorDetails />} />
                    <Route path="/kyc" element={<Kyc/>} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failed" element={<PaymentFailure />} />
                    <Route path="/kyc/success" element={<KycSuccess />} />
                    <Route path="/kyc/failed" element={<KycFailure />} />
                  </Routes>
                </div>
              </div>
              </ScrollToTop>
            </div>

         
          
        </LoaderProvider>

     






    </Router>
  );
}

export default App;
