import { Box, Tab, Tabs, Typography } from "@mui/material";

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Tooltip from '@mui/material/Tooltip';
import { AxiosResponse } from "axios";
import { apiURL } from "enviornment";
import React, { useEffect, useState } from "react";
import ReactPlayer from 'react-player';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "reducers/AuthContext";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import axiosInstance from "utils/intercepter";
import { Property } from "utils/models/Property";
import { formatCurrency, formatDate } from "utils/utils";
import "../../assets/css/details.css";
import image1 from "../../assets/images/property_detail_1.jpg";
import image2 from "../../assets/images/property_detail_2.jpg";
import image3 from "../../assets/images/property_detail_3.jpg";
interface SuccessMessage {
  messageType: string;
  message: string;
}
interface ApiResponse {
  data: {
    Property: Property;
  };
  errorMsg: any[]; // Change this to a more specific type if needed
  successMsgList: SuccessMessage[];
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FeatureItem {
  title: string;
  image: string;
  description: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const DetailsPage: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const { propertyId } = useParams();
  const [propertyData, setProperty] = useState<Property | null>(null);
  const token = localStorage.getItem('token');
  const isButtonDisabled = true;
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showTokenMessage, setTokenMessage] = useState(false);
  const location = useLocation();
  const { user, setIntendedDestination } = useAuth();
  const [iskycEnabled, setIsKycEnabled] = useState(false);
  const [kycStatus, setKycStatus] = useState('');
  const [isKycButtonDisabled,setKycButtonDisabled] = useState(false) ;
  const itemsFeatures: FeatureItem[] = [
    {
      title: "Simplicity",
      image: image1,
      description:
        "Select your property and within minutes you can own Blocks in an investment property.",
    },
    {
      title: "Finally - Access to Property Market",
      image: image2,
      description:
        "Feeling locked out of the property market? With Blocks from under $50, now there’s an affordable way to invest.",
    },
    {
      title: " Property team expertise",
      image: image3,
      description:
        "Properties are hand-picked by our property team. Learn More.",
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const back = () => {
    setCurrentIndex((prevIndex: any) => (prevIndex === 1 ? itemsFeatures.length : prevIndex - 1));
  };

  const next = () => {
    setCurrentIndex((prevIndex: any) => (prevIndex === itemsFeatures.length ? 1 : prevIndex + 1));
  };
  const settingsFeatures = {
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  };
  const handleClick = (propertyId: any) => {
    if (token != null) {
      if(!iskycEnabled){
        setIntendedDestination(location.pathname);
        navigate(`/kyc`);
      }else{
        navigate(`/investment/${propertyId}`);
      }
      
    } else {
      // Show the message for a certain duration (e.g., 3 seconds)
      setTokenMessage(true);
      setTimeout(() => {
        setTokenMessage(false);
      }, 3000);
    }

  };

  
  const getPropertyById = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(apiURL + '/property/propertyId/' + propertyId);
      const { errorMsg, successMsgList, data } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        //setProperty(data.property);
        console.log('Setting propertyData:', data.Property);
        setProperty(data.Property);
        console.log('Updated propertyData:', propertyData);
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
  useEffect(() => {
        if(!iskycEnabled){
          var kycVerification = localStorage.getItem("userKyc");
         var kycButtonDisab = localStorage.getItem("kycVerificationBlocked");
         setKycButtonDisabled(kycButtonDisab === "true" || false);
          setKycStatus(kycVerification || '');
          if (kycVerification === 'Success') {
              setIsKycEnabled(true)
          } else {
            setIsKycEnabled(false)
          }
        }
  },[])
  useEffect(() => {
    console.log('Component mounted');
    getPropertyById();
  }, []);
  const handleLoginClick = () => {
    setIntendedDestination(location.pathname);
    navigate('/login');
  };
  const handleSignupClick = () => {
    setIntendedDestination(location.pathname);
    navigate('/signup');
  }
  return (
    <section >

      <div className="lg:p-8 lg:pb-0 sm:pl-0 sm:pt-8 md:pt-10 lg:mt-2 smPadding">
        <div className="flex flex-col sm:flex-row mt-2 sm:ml-4 lg:ml-0">
          {/* Left side content */}
          <div className="p-4">
            <p className="tracking-wide text-left mb-2 text-sm font-bold text-red-700">Properties/SPM01</p>
            <p className="text-3xl text-left text-gray-900  mb-2 font-bold"> {propertyData?.propertyName}</p>
            <p className="flex text-left items-center text-gray-700"><LocationOnIcon className="mr-2" /> {propertyData?.description}</p>
          </div>

          {/* Right side content */}
          <div className="p-4 lg:ml-auto flex justify-center">

            <div className="flex flex-row sm:flex-row bg-white px-4 py-1 space-x-5 rounded-lg overflow-hidden shadow">
              <div className="flex items-center font-medium text-gray-800 mb-2 sm:mb-0">
                <svg className="lg:w-8 lg:h-8 w-8 h-8 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480,226.15V80a48,48,0,0,0-48-48H80A48,48,0,0,0,32,80V226.15C13.74,231,0,246.89,0,266.67V472a8,8,0,0,0,8,8H24a8,8,0,0,0,8-8V416H480v56a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V266.67C512,246.89,498.26,231,480,226.15ZM64,192a32,32,0,0,1,32-32H208a32,32,0,0,1,32,32v32H64Zm384,32H272V192a32,32,0,0,1,32-32H416a32,32,0,0,1,32,32ZM80,64H432a16,16,0,0,1,16,16v56.9a63.27,63.27,0,0,0-32-8.9H304a63.9,63.9,0,0,0-48,21.71A63.9,63.9,0,0,0,208,128H96a63.27,63.27,0,0,0-32,8.9V80A16,16,0,0,1,80,64ZM32,384V266.67A10.69,10.69,0,0,1,42.67,256H469.33A10.69,10.69,0,0,1,480,266.67V384Z"></path></svg>
                <span className="text-xs lg:text-xl"> {propertyData?.bedType}</span>
              </div>
              <div className="flex items-center font-medium text-gray-800">
                <svg className="lg:w-8 lg:h-8 w-8 h-8 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504,256H64V61.25a29.26,29.26,0,0,1,49.94-20.69L139.18,65.8A71.49,71.49,0,0,0,128,104c0,20.3,8.8,38.21,22.34,51.26L138.58,167a8,8,0,0,0,0,11.31l11.31,11.32a8,8,0,0,0,11.32,0L285.66,65.21a8,8,0,0,0,0-11.32L274.34,42.58a8,8,0,0,0-11.31,0L251.26,54.34C238.21,40.8,220.3,32,200,32a71.44,71.44,0,0,0-38.2,11.18L136.56,18A61.24,61.24,0,0,0,32,61.25V256H8a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8H32v96c0,41.74,26.8,76.9,64,90.12V504a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V480H384v24a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V474.12c37.2-13.22,64-48.38,64-90.12V288h24a8,8,0,0,0,8-8V264A8,8,0,0,0,504,256ZM228.71,76.9,172.9,132.71A38.67,38.67,0,0,1,160,104a40,40,0,0,1,40-40A38.67,38.67,0,0,1,228.71,76.9ZM448,384a64.07,64.07,0,0,1-64,64H128a64.07,64.07,0,0,1-64-64V288H448Z"></path></svg>

                <span className="text-xs lg:text-xl"> {propertyData?.bathType}</span>
              </div>
              <div className="flex items-center font-medium text-gray-800 mb-2 sm:mb-0">
                <svg className="lg:w-8 lg:h-8 w-8 h-8 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512"><path d="M423.18 195.81l-24.94-76.58C387.51 86.29 356.81 64 322.17 64H157.83c-34.64 0-65.34 22.29-76.07 55.22L56.82 195.8C24.02 205.79 0 235.92 0 271.99V400c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48v-16h256v16c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48V271.99c0-36.07-24.02-66.2-56.82-76.18zm-310.99-66.67c6.46-19.82 24.8-33.14 45.64-33.14h164.34c20.84 0 39.18 13.32 45.64 33.13l20.47 62.85H91.72l20.47-62.84zM80 400c0 8.83-7.19 16-16 16H48c-8.81 0-16-7.17-16-16v-16h48v16zm368 0c0 8.83-7.19 16-16 16h-16c-8.81 0-16-7.17-16-16v-16h48v16zm0-80.01v32H32v-80c0-26.47 21.53-48 48-48h320c26.47 0 48 21.53 48 48v48zM104.8 248C78.84 248 60 264.8 60 287.95c0 23.15 18.84 39.95 44.8 39.95l10.14.1c39.21 0 45.06-20.1 45.06-32.08 0-24.68-31.1-47.92-55.2-47.92zm10.14 56c-3.51 0-7.02-.1-10.14-.1-12.48 0-20.8-6.38-20.8-15.95S92.32 272 104.8 272s31.2 14.36 31.2 23.93c0 7.17-10.53 8.07-21.06 8.07zm260.26-56c-24.1 0-55.2 23.24-55.2 47.93 0 11.98 5.85 32.08 45.06 32.08l10.14-.1c25.96 0 44.8-16.8 44.8-39.95 0-23.16-18.84-39.96-44.8-39.96zm0 55.9c-3.12 0-6.63.1-10.14.1-10.53 0-21.06-.9-21.06-8.07 0-9.57 18.72-23.93 31.2-23.93s20.8 6.38 20.8 15.95-8.32 15.95-20.8 15.95z"></path></svg>

                <span className="text-xs lg:text-xl"> {propertyData?.parkingType}</span>
              </div>


            </div>
          </div>
        </div>
      </div>

      <section className="pb-8 lg:px-10 sm:px-4">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="lg:w-3/4  p-4 flex-shrink-0">
            <article className="relative w-full flex flex-shrink-0 overflow-hidden shadow-1xl">
              <div className="rounded-full bg-gray-600 text-white absolute top-5 right-5 text-sm px-2 text-center z-10">
                <span>{currentIndex}</span>/
                <span>{itemsFeatures.length}</span>
              </div>

              {itemsFeatures.map((image, index) => (
                <figure
                  key={index}
                  className={`h-96 ${currentIndex === index + 1 ? 'block' : 'hidden'}`}
                  style={{
                    transition: 'opacity 0.3s',
                    opacity: currentIndex === index + 1 ? 1 : 0,
                  }}
                >

                  <img
                    src={image.image}
                    alt="Image"
                    className="ml-0 mr-0 rounded-2xl absolute inset-0 z-10 h-full w-full opacity-70"
                  />

                </figure>
              ))}

              <button onClick={back}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 flex justify-center items-center rounded-full shadow-md z-10 bg-gray-100 hover:bg-gray-200 lg:hidden" // Hide on screens larger than lg (1024px)
              >
                <svg
                  className="w-8 h-8 font-bold transition duration-500 ease-in-out transform motion-reduce:transform-none text-gray-500 hover:text-gray-600 hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <button
                onClick={next}
                className="absolute right-0 top-1/2 translate-y-1/2 w-11 h-11 flex justify-center items-center rounded-full shadow-md z-10 bg-gray-100 hover:bg-gray-200
                  lg:hidden" // Hide on screens larger than lg (1024px)
              >
                <svg
                  className="w-8 h-8 font-bold transition duration-500 ease-in-out transform motion-reduce:transform-none text-gray-500 hover:text-gray-600 hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                onClick={back}
                className="absolute left-14 top-1/2 -translate-y-1/2 hidden lg:flex w-11 h-11 flex justify-center items-center rounded-full shadow-md z-10 bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  className="w-8 h-8 font-bold transition duration-500 ease-in-out transform motion-reduce:transform-none text-gray-500 hover:text-gray-600 hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <button
                onClick={next}
                className="absolute right-14 top-1/2 translate-y-1/2 hidden lg:flex w-11 h-11 flex justify-center items-center rounded-full shadow-md z-10 bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  className="w-8 h-8 font-bold transition duration-500 ease-in-out transform motion-reduce:transform-none text-gray-500 hover:text-gray-600 hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </article>
          </div>
          <div className="lg:w-1/4 p-4   justify-evenly flex-shrink-0">
            <div className="sideTable flex flex-col items-center rounded-xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] w-full w-1/6 justify-evenly">
              <div className="flex flex-row w-full items-center justify-evenly">
                {/* <div className="flex flex-col w-full gap-1 items-center justify-center p-2.5">
                  <span className=" text-neutral-500 mb-2 font-bold text-base sm:text-base md:text-base lg:text-base">
                    Lowest Price
                  </span>
                  <div className="flex w-16 h-16 rounded-full items-center justify-center">
                    <h3 className="w-full h-full">$300</h3>
                 
                  </div>
                  <span className=" text-neutral-500 text-green-600 text-xs sm:text-xs md:text-xs lg:text-xs">
                    X% lower than SPO Valuation
                  </span>
                </div> */}
                <div className="flex flex-col w-full gap-1 items-center justify-center p-2.5">
                  <span className=" text-neutral-500 mb-2 font-bold text-base sm:text-base md:text-base lg:text-base">
                    SPO Valuation
                  </span>
                  <div className="flex w-16 h-16 rounded-full items-center justify-center">
                    {/* <img alt="" src={doller} className="w-full h-full rounded-full" /> */}
                    <h3 className="w-full h-full">{propertyData && propertyData.latestBlockValuation !== undefined
                      ? formatCurrency(propertyData.propertyFractionalisation.spoValuation) : 'N/A'}</h3>
                  </div>
                  <span className=" text-neutral-500 font-bold text-sm sm:text-xs md:text-xs lg:text-sm">
                    Last Valuation: 
                  </span>
                </div>
              </div>
              {/* <div className="flex flex-row w-full items-center justify-evenly">
                <div className="flex flex-col w-full gap-1 items-center justify-center p-2.5">
                  <span className=" text-neutral-500 mb-2 mt-2 font-bold text-base sm:text-base md:text-base lg:text-base">
                    No. of Units Available
                  </span>
                </div>
                <div className="flex flex-col w-full gap-1 items-center grid justify-center p-2.5">
                  <h2 className="w-full h-full">200</h2>
                </div>
              </div> */}
              <div className="flex flex-row w-full items-center justify-center gap-20 p-2">
                <button className={`btn-solid-lg ${!token || isKycButtonDisabled ? 'opacity-50 pointer-events-none' : 'secondary'}`}
                  onClick={() => propertyData && handleClick(propertyData.id)} style={{ marginBottom: '0px' }}
                  disabled={isKycButtonDisabled}>
                  <span className="hidden md:flex">Buy</span>
                  <span className="md:hidden">Buy</span>
                </button>
                <button
                  className={`btn-solid-lg ${isButtonDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                  style={{ marginBottom: 0 }}
                  disabled={isButtonDisabled}
                >
                  <span className="hidden md:flex">Sell</span>
                  <span className="md:hidden">Sell</span>
                </button>
              </div>
              {!token && (
                <small className="text-gray-500 block mt-2 text-center" style={{ marginLeft: '8px', color: 'red' }}>
                  Please log in to sign up enable the Buy button <br />
                  <button className="mr-2" style={{ marginLeft: '8px', color: 'blue' }} onClick={handleLoginClick}>Login</button>
                  or  <button className="ml-2" style={{ marginLeft: '8px', color: 'blue' }} onClick={handleSignupClick}>Sign Up</button>
                </small>
              )}

            </div>
          </div>
        </div>
        <div className="lg:grid sm:grid grid-cols-3  md:grid-cols-3">
          <div className="col-span-2">
            <Box>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Summary" {...a11yProps(0)} />

                  <Tab label="Capital Return" {...a11yProps(1)} />
                  <Tab label="Details Section" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div className="md:flex">
                  <div className="md:w-1/2 m-2">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="text-xl font-bold mb-4">Investment Info</div>

                      {/* Rental Distribution Info */}
                      <div className="mb-4">
                        {/* <div className="flex items-start">
                          <span className="mr-2 material-icons">
                            <MonetizationOnIcon />
                          </span>
                          <div className="font-bold">Rental Distribution Info</div>
                        </div> */}
                        <hr className="border-gray-800 my-2" />

                        {/* <div className="flex items-center justify-between mb-2">
                          <div className="">Est. Net Rental Yield</div>
                          <div className="ml-2 text-right text-xl text-red-500">
                            ?<small>p.a.</small>
                            <span className="ml-2 text-gray-500">
                              <Tooltip arrow placement="top" title={
                                <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                  The forecasted Net Rental Yield, based on the Initial SPO Price and weekly rent expected by the SPO property management team.
                                </Typography>
                              }>
                                <HelpOutlineIcon style={{ cursor: 'pointer' }} />
                              </Tooltip>
                            </span>
                          </div>
                        </div> */}
                      </div>
                      <hr className="border-gray-300 my-2" />
                      {/* Capital Returns Info */}
                      <div className="mb-4">
                        <div className="flex items-start">
                          <span className="mr-2">
                            <TrendingUpIcon />
                          </span>
                          <div className="font-bold">Capital Returns Info</div>
                        </div>

                        <hr className="border-gray-300 my-2" />
                        <div className="flex items-start mb-2">
                          <div className="flex mr-2 items-center">
                            <div className="text-sm ml-2"> 5Y Historical Suburb Growth*</div>
                          </div>

                          <div className="ml-auto text-right text-xl text-blue-500">{propertyData?.historicalSuburbGrowthRate}% <small>p.a.</small></div>
                        </div>
                        <hr className="border-gray-300 my-2" />
                        <span className="text-sm ">Development objective</span>
                        <div className="flex items-center justify-between mb-2">
                          <div>

                            <span className="text-sm "> capital growth rate</span>
                          </div>


                          <div className="ml-2 text-right  text-xl text-blue-500">{propertyData?.capitalGrowthRate}% <small>p.a.</small></div>
                        </div>
                        <hr className="border-gray-300 my-2" />
                        <div className="flex items-center justify-between mb-2">
                          <div className="">Gearing Effect (0% Debt)</div>
                          <div className="ml-auto text-xl">{propertyData?.propertyFractionalisation.gearingEffect.toFixed(2)}% </div>
                          <span className="ml-2 text-gray-500">
                            <Tooltip arrow placement="top" title={
                              <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                The 'Gearing effect' can be added to/subtracted from the 'historical suburb growth'
                                figure to estimate the effects of having a mortgage on the property as its value grows or declines.
                              </Typography>
                            }>
                              <HelpOutlineIcon style={{ cursor: 'pointer' }} />
                            </Tooltip>
                          </span>

                        </div>
                        <div className="text-sm">
                          <small className="text-gray-500">
                            Learn more about how gearing works <a href="/">here</a>.
                          </small>
                        </div>
                      </div>
                      <hr className="border-gray-900 my-2" />
                      <div className="text-sm">
                        <div className="mb-2">
                          <small className="text-gray-500">*Past performance does not indicate future performance.</small>
                        </div>
                        <div>
                          <small className="text-gray-500">Neither income nor capital returns are guaranteed.</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 m-2">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="text-xl font-bold mb-4">Settlement Date: {formatDate(propertyData?.settlementDate)}</div>

                      {/* Rental Distribution Info */}
                      <div className="mb-4">
                        <div className="flex items-end justify-between">
                          <div className="grid items-center">
                            <span className="mr-2 material-icons" style={{ fontSize: '24px !important' }}>
                              <HomeIcon />
                            </span>
                            <div>
                              <div className="text-sm font-bold">Total Purchase Cost</div>
                            </div>
                          </div>
                          <div className="text-xl text-bold" style={{ textAlign: 'right' }}>{formatCurrency(propertyData?.propertyFractionalisation.totalCostOfProperty || 0)}
                            <Tooltip arrow placement="top" title={
                              <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                The Total Purchase Cost consists of the Property Purchase Cost, Acquisition Costs, and Cash Reserve.
                              </Typography>
                            }>
                              <HelpOutlineIcon style={{ cursor: 'pointer' }} />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex mt-2 mb-4 items-end justify-between">
                          <div className="grid items-center">
                            <span className="mr-2 material-icons" style={{ fontSize: '24px !important' }}>
                              <HomeIcon />
                            </span>
                            <div>
                              <div className="font-bold text-sm ">Geared (0% Debt)</div>
                            </div>
                          </div>
                          <div className="text-xl text-bold" style={{ textAlign: 'right' }}>{formatCurrency(propertyData?.propertyFractionalisation?.gearedAmountOfProperty || 0)}
                            <Tooltip arrow placement="top" title={
                              <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                The outstanding Debt from any mortgage on this investment.
                              </Typography>
                            }>
                              <HelpOutlineIcon style={{ cursor: 'pointer' }} />
                            </Tooltip></div>
                        </div>
                        <hr className="border-gray-800 my-2" />
                        <div className="flex mt-2 mb-4 items-end justify-between">
                          <div className="grid items-center">
                            <span className="mr-2 material-icons" style={{ fontSize: '24px !important' }}>
                              <HomeIcon />
                            </span>
                            <div>
                              <div className="font-bold text-sm ">Equity</div>
                            </div>
                          </div>
                          <div className="text-xl text-bold" style={{ textAlign: 'right' }}>{formatCurrency(propertyData?.propertyFractionalisation?.equity || 0)}
                            <Tooltip arrow placement="top" title={
                              <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                The remaining value in this property investment, after Debt.
                              </Typography>
                            }>
                              <HelpOutlineIcon style={{ cursor: 'pointer' }} />
                            </Tooltip></div>
                        </div>
                        <hr className="border-gray-300 my-2" />
                        <div className="flex mt-2 mb-4 items-end justify-between">
                          <div className="grid items-center">
                            <span className="mr-2 material-icons" style={{ fontSize: '24px !important' }}>
                              <HomeIcon />
                            </span>
                            <div>
                              <div className="font-bold text-sm ">SPO Valuation</div>
                            </div>
                          </div>
                          <div className="text-xl text-bold" style={{ textAlign: 'right' }}>{propertyData && propertyData.propertyFractionalisation.spoValuation !== undefined
                            ? formatCurrency(propertyData.propertyFractionalisation.spoValuation) : 'N/A'}
                            <Tooltip arrow placement="top" title={
                              <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                The value of 1 spo in this property investment, based on the Total Purchase Cost and/or Equity at Settlement Date.
                              </Typography>
                            }>
                              <HelpOutlineIcon style={{ cursor: 'pointer' }} />
                            </Tooltip></div>
                        </div>

                      </div>
                      <hr className="border-gray-800 my-2" />


                      <div className="text-sm">
                        <div className="mb-2">
                          <small className="text-gray-500"><b>Next Valuation Date: {formatDate(propertyData?.propertyFractionalisation.propertyValutaionDate)}.</b></small>
                        </div>
                        <div>
                          <small className="text-gray-500">* Based on the Latest Independent Property Valuation of $4,800,000 . See Capital Returns tab for more info.</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </CustomTabPanel>

              <CustomTabPanel value={value} index={1}>
                <div className=" mx-auto bg-white rounded-md overflow-hidden shadow-md">
                  <div className="bg-gray-400 p-4 text-white font-bold">Capital Returns: Key Metrics</div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-100 text-center p-3 rounded-md">
                        <div className="text-base uppercase">HISTORICAL SUBURB GROWTH</div>
                        <div className="text-3xl items-center grid  h-12" data-test-reference="capital-returns-value">{propertyData?.historicalSuburbGrowthRate}%</div>
                        <div className="text-base" data-test-reference="capital-returns-description">20 years compound annual, CoreLogic</div>
                      </div>
                      <div className="bg-gray-100  text-center p-3 rounded-md">
                        <div className="text-base uppercase">TOTAL PURCHASE COST</div>
                        <div className="text-3xl items-center grid  h-12" data-test-reference="capital-returns-value">{formatCurrency(propertyData?.propertyFractionalisation.totalCostOfProperty || 0)}</div>
                        {/* <div className="text-base" data-test-reference="capital-returns-description">{formatDate(propertyData?.settlementDate)}</div> */}
                      </div>
                      <div className="bg-gray-100 text-center p-3 rounded-md">
                        <div className="text-base uppercase">DEBT</div>
                        <div className="text-3xl items-center grid  h-12" data-test-reference="capital-returns-value">{formatCurrency(propertyData?.propertyFractionalisation.equity || 0)}</div>
                        {/* <div className="text-base" data-test-reference="capital-returns-description">{formatDate(propertyData?.settlementDate)}</div> */}
                      </div>
                      <div className="bg-gray-100 text-center p-3 rounded-md">
                        <div className="text-base uppercase">INITIAL BRICK PRICE</div>
                        <div className="text-3xl items-center grid  h-12" data-test-reference="capital-returns-value">{formatCurrency(propertyData?. propertyFractionalisation.pricePerUnit|| 0)}</div>
                        {/* <div className="text-base" data-test-reference="capital-returns-description">{formatDate(propertyData?.settlementDate)}</div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" mx-auto bg-white rounded-md overflow-hidden shadow-md mt-4">
                  <div className="bg-gray-400 p-4 text-white font-bold">Settlement Date: {formatDate(propertyData?.settlementDate)}</div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="blue-label">ASSETS</div>
                            <hr className=" my-2" />
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center">
                                {/* Use ml-auto to push the HomeIcon to the right */}
                                <HomeIcon style={{ cursor: 'pointer', fontSize: 24 }} className="ml-auto" />
                              </div>
                              <div className="flex-grow grid justify-center text-left">
                                <div className="text-sm">Land Purchase Cost</div>
                                <div className="text-sm">{formatCurrency(propertyData?.propertyFractionalisation.landPurchaseCost || 0)}</div>
                              </div>
                              <div className="flex items-center">
                                <Tooltip
                                  arrow
                                  placement="top"
                                  title={
                                    <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                      The market value, paid to purchase the property..
                                    </Typography>
                                  }
                                >
                                  <HelpOutlineIcon style={{ cursor: 'pointer', fontSize: 14 }} />
                                </Tooltip>
                              </div>
                            </div>
                            <hr className=" my-2" />
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center">
                                <HomeIcon style={{ cursor: 'pointer', fontSize: 24 }} />
                              </div>
                              <div className="flex-grow grid justify-center text-left">
                                <div className="text-sm">Acquisition Costs</div>
                                <div className="text-sm">{formatCurrency(propertyData?.propertyFractionalisation.acquisitionCost || 0)}</div>
                              </div>
                              <div className="flex items-center">
                                <Tooltip arrow placement="top" title={
                                  <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                    The unamortised Acquisition Costs, to be written off over 5 years, including stamp duty, legal and professional fees, and more. Full details below.
                                  </Typography>
                                }>
                                  <HelpOutlineIcon style={{ cursor: 'pointer', fontSize: 14 }} />
                                </Tooltip>
                              </div>
                            </div>
                            <hr className=" my-2" />
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center">
                                <HomeIcon style={{ cursor: 'pointer', fontSize: 24 }} />
                              </div>
                              <div className="flex-grow grid justify-center text-left">
                                <div className="text-sm">Development Cost</div>
                                <div className="text-sm">{formatCurrency(propertyData?.propertyFractionalisation.developmentCost || 0)}</div>
                              </div>
                              <div className="flex items-center">
                                <Tooltip arrow placement="top" title={
                                  <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                    Money kept primarily for funding unexpected expenses and to cover bills during void periods at the property..
                                  </Typography>
                                }>
                                  <HelpOutlineIcon style={{ cursor: 'pointer', fontSize: 14 }} />
                                </Tooltip>
                              </div>
                            </div>
                            <hr className=" border-gray-800 my-2" />
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center">
                                <HomeIcon style={{ cursor: 'pointer', fontSize: 24 }} />
                              </div>
                              <div className="flex-grow grid justify-center text-left">
                                <div className="text-sm">Total Purchase Cost</div>
                                <div className="text-sm">{formatCurrency(propertyData?.propertyFractionalisation.totalCostOfProperty || 0)}</div>
                              </div>
                              <div className="flex items-center">
                                <Tooltip arrow placement="top" title={
                                  <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                                    The sum of the assets in this property, including the Purchase Cost, Acquisition Costs, and Cash Reserve.
                                  </Typography>
                                }>
                                  <HelpOutlineIcon style={{ cursor: 'pointer', fontSize: 14 }} />
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="blue-label">LIABILITIES</div>
                            <hr className=" my-2" />
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center">
                                <HomeIcon style={{ cursor: 'pointer', fontSize: 24 }} />
                              </div>
                              <div className="flex-grow grid justify-center text-left">
                                <div className="text-sm">Debt</div>
                                <div className="text-sm">{formatCurrency(propertyData?.propertyFractionalisation.equity || 0)}</div>
                              </div>
                            </div>
                          </div>

                        </div>
                        <hr className=" border-gray-800 my-2" />
                        <div className="font-bold text-sm text-center ">Equity = {formatCurrency(propertyData?.propertyFractionalisation.equity|| 0)} &nbsp;
                          <Tooltip arrow placement="top" title={
                            <Typography className="text-sm md:text-base lg:text-lg leading-tight text-white">
                              The remaining value in the property, after Debt, which drives 'SPO' Valuation.
                            </Typography>
                          }>
                            <HelpOutlineIcon style={{ cursor: 'pointer', fontSize: 14 }} />
                          </Tooltip></div>
                        <hr className=" border-gray-800 my-2" />
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                          {/* DEBT */}
                          <div className="bg-gray-100 text-center p-4 rounded-md">
                            <div className="text-base uppercase">DEBT</div>
                            <div className="text-3xl items-center grid h-12" data-test-reference="capital-returns-value">{formatCurrency(propertyData?.propertyFractionalisation.equity || 0)}</div>
                            {/* <div className="text-base" data-test-reference="capital-returns-description">{formatDate(propertyData?.settlementDate)}</div> */}
                          </div>

                          {/* INITIAL BRICK PRICE */}
                          <div className="bg-gray-100 text-center p-4 rounded-md">
                            <div className="text-base uppercase">INITIAL BRICK PRICE</div>
                            <div className="text-3xl items-center grid h-12" data-test-reference="capital-returns-value">{formatCurrency(propertyData?.propertyFractionalisation.pricePerUnit || 0)}</div>
                            {/* <div className="text-base" data-test-reference="capital-returns-description">{formatDate(propertyData?.settlementDate)}</div> */}
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mt-4">
                          <small className="text-gray-500 block"><b>Next Valuation Date: {formatDate(propertyData?.propertyFractionalisation.propertyValutaionDate)}.</b></small>
                          <small className="text-gray-500 block mt-2">SPO conducts Independent Valuations on an annual or
                            semi-annual basis for all properties on the platform. To learn more, see our FAQs.</small>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <div className=" mx-auto bg-white rounded-md overflow-hidden shadow-md">
                  <div className="bg-gray-400 p-4 text-white font-bold">Investment Case</div>
                  <div className="p-4">
                    <span>
                      <h4 className="text-lg font-bold mb-2">
                        Please ensure you have accessed, read and understood the Product Disclosure Statement, Target Market Determination,
                        Financial Services Guide and Additional Disclosure Document - SPM01 ("ADD")
                        for details to consider if this investment is right for you.
                      </h4>
                      <h4 className="text-lg font-bold mb-2">KEY FEATURES</h4>
                      <ul className="list-disc pl-6">
                        <li className="mb-2">
                          The ADP Fund aims to acquire or develop SDA properties that meet the needs of NDIS participants. Generally,
                          these properties will be either units or villas/townhouses but may be stand-alone houses where the income return
                          profile meets the fund’s objectives. Where the fund adopts a Development Strategy, the development may include
                          construction of non-SDA residential properties which are to be sold prior to/or at the completion of each development.
                        </li>
                        <li className="mb-2">
                          The core objective of the ADP Fund is to curate a portfolio of quality Specialist Disability Accommodation properties
                          (SDA Portfolio), to generate SDA rental income, with an exit strategy to sell the SDA Portfolio to one or more
                          institutional investors at a premium to generate additional profits for the fund, once a sufficiently sized SDA property
                          portfolio has been established and tenanted.
                        </li>
                      </ul>
                    </span>
                  </div>
                </div>
                <div className="md:flex flex ">
                  <div className="md:w-1/2 mr-2 pt-4">
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="bg-gray-400 p-4 text-white font-bold">Property Features</div>
                      <div className="p-4 flex-1">
                        <ul className="list-disc pl-6">
                          <li className="mb-2"> Specialist Disability Accommodation</li>
                          <li className="mb-2"> Development</li>
                          <li className="mb-2"> Geographically Diversified Fund</li>
                          <li className="mb-2"> Long term SDA Housing accommodation leases</li>
                          <li className="mb-2"> Short/medium term prospects for residential housing development capital gain</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 ml-2 pt-4">
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="bg-gray-400 p-4 text-white font-bold">Investment Case Video</div>
                      <div className="p-4 flex-1">
                        <ReactPlayer url={require('../../assets/video/intro.mp4')} // Replace with the actual path to your video file
                          controls={true} width='100%' height='11rem' />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:flex mt-4 flex">
                  <div className="md:w-1/2 mr-2 pt-4">
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="bg-gray-400 p-4 text-white font-bold">Monthly Updates</div>
                      <div className="p-4 flex-1">
                        <ul className="pl-6">
                          <li className="mb-2"> Nov 2023 <br />The distribution for the month ending November 2023 was $0 per Brick which is equal to forecast</li>
                          <li className="mb-2"> Oct 2023 <br />  SPM01 SPO will cease trading via the BrickX Platform from Monday 16 October 2023 pending the release of the SPM01 - Tranche II release of SPO.
                            An Additional Disclosure Document outlining the terms of the SPM01 Tranche II equity raise (brick issuance) will be made available on or about 16 October 2023.</li>
                          <li className="mb-2">Sep 2023<br />The distribution for the month ending September 2023 was $0 per Brick which is equal to forecast</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 ml-2 flex pt-4">
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="bg-gray-400 p-4 text-white font-bold">Due Diligence & Key Documents</div>
                      <div className="p-4 flex-1">
                        <ul className="list-disc pl-6">
                          <li className="mb-2"> ADP Fund - ADP01 - September 2023 Quarter Update</li>
                          <li className="mb-2"> ADP Fund - ADP01 - Overview Oct 2023</li>
                          <li className="mb-2"> ADP Fund - ADP01 - Frankston 'Melva' Transaction Summary Oct 2023</li>
                          <li className="mb-2"> ADP Fund - ADP01 - Clayton Transaction Summary Oct 2023</li>
                          <li className="mb-2">Additional Disclosure Document - Tranche 3 (12 Dec 2023)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      </section>



    </section>
  );
};

export default DetailsPage;
