import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import { Container, Grid, Typography, TextField } from '@mui/material';
import './investment.css';
import { formatCurrency } from 'utils/utils';
import axios, { AxiosResponse } from 'axios';
import { apiURL } from '../../enviornment';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import axiosInstance from 'utils/intercepter';
import { PropertyFractionalisation } from 'utils/models/PropertyFractionalisation';
import { useCart } from 'property/cart/CartContext';
// Define the InvestmentCalculator component

interface Message {
  messageType: string;
  message: string;
}
interface ApiResponse {
  data: Record<string, any>;
  errorMsg: Message[];
  successMsgList: Message[];
}

interface CartResponse {
  data: {
    CartSummary: any[];
  };
  errorMsg: any[]; // Change this to a more specific type if needed
  successMsgList: any[];
}
const InvestmentCalculator: React.FC = () => {
  // State for input values
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success' as 'success' | 'error' | 'info' | 'warning');
  const [propertyAmount, setPropertyAmount] = useState<number>(0);

  const { cartId, propertyId } = useParams();

  const [propertyFData, setPropertyFData] = useState<PropertyFractionalisation | null>(null);
  const [blockPrice, setBlockPrice] = useState<number>(0);
  const [minBlock, setMinBlock] = useState<number>(1);
  const [maxBlock, setMaxBlock] = useState<number>(999);
  const [plateformCharges, setPlateformCharges] = useState(0.50);
  const [noBlock, setNoBlock] = useState<number>(1);
  const [blockSize, setBloackSize] = useState<number>(1);
  const [button, setButton] = useState(false);
  let calcPrice = 100;
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const calculateTotalPrice = () => {

    const totalPrice = blockPrice * blockSize * noBlock;
    calcPrice = totalPrice;

    return formatCurrency(parseInt(totalPrice.toFixed(2)));
  };
  const finalPrice = () => {
    const price =  blockPrice * blockSize * noBlock;
    const finalPriceA = (plateformCharges / 100) * price + price;

    return formatCurrency(parseFloat(finalPriceA.toFixed(2)));
  }
  const formik = useFormik({
    initialValues: {
      noOfSelectedUnits: null,
    },
    onSubmit: async (values) => {

      const data = values;
      let params = {
        id: cartId,
        userToken: localStorage.getItem('token'),
        propertyId: propertyId,
        noOfSelectedUnits: noBlock * blockSize,
        isActive: true
      }
      try {
        // Replace 'your-api-endpoint' with the actual API endpoint
        const Token = localStorage.getItem('token');
        console.log(apiURL);

        const response: AxiosResponse<ApiResponse> = await axios.post(apiURL + '/userCart/saveUserCart', params
          , {
            headers: {
              Authorization: `Bearer ${Token}`,
              'Content-Type': 'application/json', // Specify the content type if needed
            },
          });
        const { errorMsg, successMsgList } = response.data;
        if (successMsgList != null && successMsgList.length > 0) {
          showAlert(successMsgList[0].message, 'success');
          if(null == cartId && undefined == cartId){
            dispatch({ type: 'ADD_TO_CART', payload: response.data.data.SavedUserCart });
          }
          
          navigate('/cart', { replace: true });
        } else {
          showAlert(errorMsg[0].message, 'warning');
        }

      } catch (error) {
        console.error('Signup failed:', error);
        showAlert('Data fetched unsuccessfully!', 'error');
      }

    },
  });
  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 2000);
  };
  const getPropertyById = async () => {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(apiURL + '/fractionalisation/propertyId/' + propertyId, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { errorMsg, successMsgList, data } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        //setProperty(data.property);
        console.log('Setting propertyData:', data.Property);
        setPropertyFData(data.PropertyFractionalisation);
        setBlockPrice(data.PropertyFractionalisation.pricePerUnit);
        setPropertyAmount(parseFloat(data.PropertyFractionalisation.totalCostOfProperty));
        setMaxBlock(data.PropertyFractionalisation.totalAvailableUnitsForTrade-1);
        setBloackSize(data.PropertyFractionalisation.blockSize);
        setPlateformCharges(data.PropertyFractionalisation.platformCharges);
        console.log('Updated propertyData:', propertyFData);
      } else {
        // Handle error or empty successMsgList
      }
      // Assuming the response contains the data property
      console.log(response.data);
      // Additional actions or logic based on the response data can be added here

      console.log(response);
    } catch (error) {
      console.error('Error fetching property data:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  const getCartById = async () => {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(apiURL + '/userCart/summary/cartId/' + cartId, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { errorMsg, successMsgList, data } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        //setProperty(data.property);
        console.log('Setting propertyData:', data.CartSummary);
        setPropertyFData(data.CartSummary.propertyFractionalisation);
        setBlockPrice(data.CartSummary.propertyFractionalisation.pricePerUnit);
        setPropertyAmount(parseFloat(data.CartSummary.propertyFractionalisation.totalCostOfProperty));
        setMaxBlock(data.CartSummary.propertyFractionalisation.totalAvailableUnitsForTrade-1);
        setNoBlock(data.CartSummary.noOfSelectedUnits);
        setPlateformCharges(data.CartSummary.propertyFractionalisation.platformCharges);
      } else {
        // Handle error or empty successMsgList
      }
      // Assuming the response contains the data property
      console.log(response.data);
      // Additional actions or logic based on the response data can be added here

      console.log(response);
    } catch (error) {
      console.error('Error fetching property data:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };


  const getCartSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem("username");
      const response: AxiosResponse<CartResponse> = await axiosInstance.get(apiURL + '/userCart/summary/' + userName, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { errorMsg, successMsgList, data } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {

        response.data.data.CartSummary.forEach(item => {
          if (item.propertyId === propertyId && (cartId == null || cartId.length === 0)) {
            setButton(true)
          }
        });

      } else {
        // Handle error or empty successMsgList

      }
      // Assuming the response contains the data property
      console.log(response.data);
      // Additional actions or logic based on the response data can be added here

      console.log(response);
    } catch (error) {
      console.error('Error fetching property data:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  const handleInputChange = (e:any) => {
    const inputValue = Number(e.target.value);
    // Add validation for noBlock not greater than 999
    if (inputValue <= maxBlock) {
      setNoBlock(inputValue);
    }
  };

  useEffect(() => {
    console.log('Component mounted');
    getPropertyById();
    if(cartId){
    getCartById();}
    getCartSummary();
    
  }, []);
  return (
    <div className='w-full p-4 md:pt-16' style={{ backgroundColor: '#F8FBFF' }}>
      <div className="container mx-auto p-4 " id="ms525">
        <h2 className="text-2xl top-title">Invest Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <p className="normal-p">
              Calculate the amount to see how much your money can grow. Let's assume you invested in a $1,000,000 property.
            </p>
            <p className="normal-p">Use the sliders or the fields to change the amounts or percentages.</p>

            <div className="input-box">
              <label htmlFor="in_invest" className="in_1">
                Property Value
              </label>
              <br />
              <span className="input-field">
                <input
                  type="text"
                  className="form-field cl-input"
                  id="in_invest"
                  disabled
                  value={formatCurrency(propertyAmount)}
                  onChange={(e) => setPropertyAmount(Number(e.target.value))}
                />
              </span>
              <div className="in-b-sp"></div>
            </div>

            <div className="mid-sec">
              <label htmlFor="in_an_return_vl" style={{ flex: 3 }} className="ann">
                Block Price
              </label>
              <input
                type="text"
                className="form-control sp-form"
                id="in_an_return_vl"
                disabled
                style={{ width: '33%' }}
                value={formatCurrency(blockPrice)}
              />
            </div>

            <div className="mid-sec">
              <label htmlFor="in_an_return_vl" style={{ flex: 3 }} className="ann">
                No. Of Blocks
              </label>
              <input
                type="text"
                className="form-control sp-form"
                id="in_an_return_vl"
                name="noOfSelectedUnits"
                style={{ width: '33%' }}
                value={noBlock === 0 ? '' : noBlock}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group customFrom">
              <div className="slidecontainer">
                <Slider
                  min={minBlock}
                  max={maxBlock}
                  step={20}
                  value={noBlock}
                  onChange={(event, value) => setNoBlock(value as number)}
                  className="slider cl-in cl-input"
                  id="in_an_return"


                />
              </div>
            </div>

            <div className="range-sec">
              <span className="range sl_range_low">Min {minBlock}</span>
              <span className="range sl_range_high">Max {maxBlock}</span>
            </div>
          </div>

          <div className="col-span-1 ml-4 md:ml-0">
            <h3 className="right-mid-h3">Block's price in $</h3>

            <div className="bottom-sec">
              <div className="left-sec">
                <div className="head-p">Platform Charges</div>
                <div className="per-p" id="rs_avg_return">
                  {plateformCharges} %
                </div>
              </div>

              <div className="left-sec">
                <div className="head-p">Total Price</div>
                <div className="per-p" id="rs_total_roi">
                  {calculateTotalPrice()}
                </div>
              </div>
            </div>

            <div className="sp-bottom left-sec">
              <div className="sp-left">
                <div className="per-p" id="rs_vl_invest">
                  {finalPrice()}
                </div>
              </div>
              <div className="head-p">Final Block Investment Value</div>
            </div>
            <div className="flex flex-row md:mt-16 w-full items-center justify-center gap-20 p-2">
            <form onSubmit={formik.handleSubmit}>
                <button className={`btn-solid-lg secondary ${button||noBlock<minBlock ? 'opacity-50 pointer-events-none' : ''}`} style={{ marginBottom: '0px' }} type="submit" disabled={button||noBlock<minBlock} >
                  <span className="hidden md:flex">Add to Cart</span>
                  <span className="md:hidden" >Add to Cart</span>
                </button>
                </form>
                <button className='btn-solid-lg' style={{ marginBottom: 0 }} >
                  <span className="hidden md:flex">PLACE ORDER</span>
                  <span className="md:hidden">PLACE ORDER</span>
                </button>
              </div>
            
          </div>
        </div>
      </div>
    </div>

  );
};

export default InvestmentCalculator;