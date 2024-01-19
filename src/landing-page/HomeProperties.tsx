import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import smart_property from '../assets/images/smart_property.png';
import axiosInstance from '../utils/intercepter';
import { Property } from 'utils/models/Property';
import { AxiosResponse } from 'axios';
import { apiURL } from 'enviornment';
import { formatCurrency, formatDate } from 'utils/utils';
interface SuccessMessage {
  messageType: string;
  message: string;
}
interface ApiResponse {
  data: {
    PropertyList: Property[];
  };
  errorMsg: any[]; // Change this to a more specific type if needed
  successMsgList: SuccessMessage[];
}
const Homeproperties: React.FC = () => {
  const HowWorksBackgroundColor = '#f1f9fc';
  const [propertyData, setProperty] = useState<Property[] | null>(null)
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const getProperty = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(apiURL + '/property/getAllProperty');
      const { errorMsg, successMsgList, data } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        console.log('Setting propertyData:', data.PropertyList);
        setProperty(data.PropertyList);
        console.log('Updated propertyData:', propertyData);
      } else {
        // Handle error or empty successMsgList
      }

      // Additional actions or logic based on the response data can be added here

      console.log(response);
    } catch (error) {
      console.error('Error fetching property data:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };
  useEffect(() => {
    console.log('Component mounted');
    getProperty();
  }, []);

  const handleClick = (propertyId: any) => {
    navigate(`/DetailsPage/${propertyId}`);
  };
  const moveToProperty = () => {
    navigate(`/propertyList`);
  }
  const getFeatureColorClass = (propertyType:string) => {
    switch (propertyType) {
      case 'DEVELOPMENT':
        return 'bg-blue-500';
      case 'RENTAL':
        return 'bg-green-500';
      case 'COMMERCIAL':
        return 'bg-yellow-500';
      // Add more cases as needed for different features and colors
      default:
        return 'bg-gray-500'; // Default color if feature doesn't match any case
    }
  };
  return (
    <section id='Homeproperties' style={{ backgroundColor: HowWorksBackgroundColor }}>
      {/* Container to heading and testm blocks */}
      <div className='container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-8 md:space-y-0 md:flex-row'>
        <div className='flex flex-col space-y-6 mt-8 md:mt-0 md:w-full md:max-w-md lg:w-3/4 lg:max-w-3xl'>
          <h2 className='text-3xl font-bold text-center md:text-4xl md:text-left'>
            SPO Properties
          </h2>
          <p className='text-center md:text-left text-darkGrayishBlue'>
            Choose which property to buy Bricks in (or use Smart Invest). Our range of properties is carefully selected by our specialist Property Team based on growth potential.
          </p>
          <div className='flex flex-col space-y-6 md:flex-row md:space-y-0'>
            <div className='md:w-1/2'>
              <p className='text-darkGrayishBlue flex items-center'>
                <FaCheck className='mt-1 pr-2' color="#47B7F1" size={15} />Historical suburb growth
              </p>
            </div>
            <div className='md:w-1/2'>
              <p className='text-darkGrayishBlue flex items-center'>
                <FaCheck className='mt-1 pr-2' color="#47B7F1" size={15} />Independent Property Valuations
              </p>
            </div>
          </div>
          <div className='flex flex-col space-y-6 md:flex-row md:space-y-0'>
            <div className='md:w-1/2'>
              <p className='text-darkGrayishBlue flex items-center'>
                <FaCheck className='mt-1 pr-2' color="#47B7F1" size={15} />Forecasted cash flows
              </p>
            </div>
            <div className='md:w-1/2'>
              <p className='text-darkGrayishBlue flex items-center'>
                <FaCheck className='mt-1 pr-2' color="#47B7F1" size={15} />Estimated rental income and yield
              </p>
            </div>
          </div>
          <div className='flex justify-center md:justify-start'>
            <button onClick={() => moveToProperty()} className='btn-solid-lg hidden'>
              <span className='hidden md:flex' > View Properties</span>
              <span className='md:hidden'> View Properties</span>
            </button>
            {/* <Link
              to='#'
              className='btn-solid-lg secondary'>
              <span className='hidden md:flex'> Meet the SPO Team</span>
              <span className='md:hidden'> SPO Team</span>
            </Link> */}

          </div>
        </div>
        <div className='md:w-1/2 '>
          <div className='max-w-sm rounded float-right w-full md:mt-4 md:mb-4 overflow-hidden shadow-lg border'>
            <div className="relative mx-auto w-full cursor-pointer " onClick={() => propertyData && handleClick(propertyData[0]?.id)}>
              <div className="relative inline-block duration-300 ease-in-out transition-transform transform  w-full">
                <div className="shadow p-4 rounded-lg bg-white">
                  <div className="flex justify-center relative rounded-lg overflow-hidden h-52">
                    <div className="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
                        <img className="h-48 w-full ml-0 mr-0 object-cover absolute inset-0 md:h-full" src={smart_property} />
                     
                    </div>

                    <div className="absolute flex justify-center bottom-0 mb-3">
                      <div className="flex bg-white px-4 py-1 space-x-5 rounded-lg overflow-hidden shadow">
                        <p className="flex items-center font-medium text-gray-800">
                          <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480,226.15V80a48,48,0,0,0-48-48H80A48,48,0,0,0,32,80V226.15C13.74,231,0,246.89,0,266.67V472a8,8,0,0,0,8,8H24a8,8,0,0,0,8-8V416H480v56a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V266.67C512,246.89,498.26,231,480,226.15ZM64,192a32,32,0,0,1,32-32H208a32,32,0,0,1,32,32v32H64Zm384,32H272V192a32,32,0,0,1,32-32H416a32,32,0,0,1,32,32ZM80,64H432a16,16,0,0,1,16,16v56.9a63.27,63.27,0,0,0-32-8.9H304a63.9,63.9,0,0,0-48,21.71A63.9,63.9,0,0,0,208,128H96a63.27,63.27,0,0,0-32,8.9V80A16,16,0,0,1,80,64ZM32,384V266.67A10.69,10.69,0,0,1,42.67,256H469.33A10.69,10.69,0,0,1,480,266.67V384Z"></path></svg>
                          {propertyData && propertyData.length > 0 && (
                            <div>
                              {propertyData[0].bedType}
                            </div>
                          )}
                        </p>
                        <p className="flex items-center font-medium text-gray-800">
                          <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504,256H64V61.25a29.26,29.26,0,0,1,49.94-20.69L139.18,65.8A71.49,71.49,0,0,0,128,104c0,20.3,8.8,38.21,22.34,51.26L138.58,167a8,8,0,0,0,0,11.31l11.31,11.32a8,8,0,0,0,11.32,0L285.66,65.21a8,8,0,0,0,0-11.32L274.34,42.58a8,8,0,0,0-11.31,0L251.26,54.34C238.21,40.8,220.3,32,200,32a71.44,71.44,0,0,0-38.2,11.18L136.56,18A61.24,61.24,0,0,0,32,61.25V256H8a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8H32v96c0,41.74,26.8,76.9,64,90.12V504a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V480H384v24a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V474.12c37.2-13.22,64-48.38,64-90.12V288h24a8,8,0,0,0,8-8V264A8,8,0,0,0,504,256ZM228.71,76.9,172.9,132.71A38.67,38.67,0,0,1,160,104a40,40,0,0,1,40-40A38.67,38.67,0,0,1,228.71,76.9ZM448,384a64.07,64.07,0,0,1-64,64H128a64.07,64.07,0,0,1-64-64V288H448Z"></path></svg>
                          {propertyData && propertyData.length > 0 && (
                            <div>
                              {propertyData[0].bathType}
                            </div>
                          )}
                        </p>
                        <p className="flex items-center font-medium text-gray-800">
                          <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512"><path d="M423.18 195.81l-24.94-76.58C387.51 86.29 356.81 64 322.17 64H157.83c-34.64 0-65.34 22.29-76.07 55.22L56.82 195.8C24.02 205.79 0 235.92 0 271.99V400c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48v-16h256v16c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48V271.99c0-36.07-24.02-66.2-56.82-76.18zm-310.99-66.67c6.46-19.82 24.8-33.14 45.64-33.14h164.34c20.84 0 39.18 13.32 45.64 33.13l20.47 62.85H91.72l20.47-62.84zM80 400c0 8.83-7.19 16-16 16H48c-8.81 0-16-7.17-16-16v-16h48v16zm368 0c0 8.83-7.19 16-16 16h-16c-8.81 0-16-7.17-16-16v-16h48v16zm0-80.01v32H32v-80c0-26.47 21.53-48 48-48h320c26.47 0 48 21.53 48 48v48zM104.8 248C78.84 248 60 264.8 60 287.95c0 23.15 18.84 39.95 44.8 39.95l10.14.1c39.21 0 45.06-20.1 45.06-32.08 0-24.68-31.1-47.92-55.2-47.92zm10.14 56c-3.51 0-7.02-.1-10.14-.1-12.48 0-20.8-6.38-20.8-15.95S92.32 272 104.8 272s31.2 14.36 31.2 23.93c0 7.17-10.53 8.07-21.06 8.07zm260.26-56c-24.1 0-55.2 23.24-55.2 47.93 0 11.98 5.85 32.08 45.06 32.08l10.14-.1c25.96 0 44.8-16.8 44.8-39.95 0-23.16-18.84-39.96-44.8-39.96zm0 55.9c-3.12 0-6.63.1-10.14.1-10.53 0-21.06-.9-21.06-8.07 0-9.57 18.72-23.93 31.2-23.93s20.8 6.38 20.8 15.95-8.32 15.95-20.8 15.95z"></path></svg>
                          {propertyData && propertyData.length > 0 && (
                            <div>
                              {propertyData[0].parkingType}
                            </div>
                          )}
                        </p>


                      </div>
                    </div>
                    {propertyData && propertyData.length > 0 && (
                      <span className={`absolute top-0 left-0 inline-flex mt-3 ml-3 px-3 py-2 rounded-lg z-10 ${getFeatureColorClass(propertyData[0].propertyType)} text-sm font-medium text-white select-none`}>
                      {propertyData[0].propertyType}
                    </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <h2 className="font-medium text-base md:text-lg text-gray-800 line-clamp-1" title="New York">
                      {propertyData && propertyData.length > 0 && (
                        <div>
                          {propertyData[0].propertyName}
                        </div>
                      )}
                    </h2>
                    <p className="mt-2 text-sm text-gray-800 line-clamp-2" title="New York, NY 10004, United States">
                      {propertyData && propertyData.length > 0 && (
                        <div>
                          {propertyData[0].description}
                        </div>
                      )}

                    </p>
                  </div>

                  <div className="grid grid-cols-2 grid-rows-2 gap-4  mt-8">
                    <p className="inline-flex flex-col  xl:items-center ">
                      <span className="   text-sm h-8 text-gray-400">
                        Project Value
                      </span>
                      <span className="font-medium text-base text-2xl text-gray-800 ">
                        {propertyData && propertyData.length > 0 && (
                          <div>
                            {propertyData[0].baseRate !== undefined
                              ? formatCurrency(propertyData[0]?.propertyFractionalisation?.totalCostOfProperty)
                              : 'N/A'}
                          </div>
                        )}
                      </span>
                    </p>
                    <p className="inline-flex flex-col  xl:items-center">
                      <span className=" h-8  text-sm xl:items-center  text-gray-400">
                        Block Price
                      </span>
                      <span className=" font-medium text-base text-2xl text-gray-800 ">
                      {propertyData && propertyData.length > 0 && (
                          <div>
                            {propertyData[0].propertyFractionalisation?.pricePerUnit !== undefined
                              ? formatCurrency(propertyData[0]?.propertyFractionalisation?.pricePerUnit)
                              : 'N/A'}
                          </div>
                        )}
                        
                      </span>
                    </p>
                    <p className="inline-flex flex-col w xl:items-center ">
                      <span className=" text-sm h-8 text-gray-400">
                        Target Completion
                      </span>
                      <span className="font-medium text-base text-2xl text-gray-800 ">
                      {propertyData && propertyData.length > 0 && (
                          <div>
                            {propertyData[0].targetCompletionDate !== undefined
                              ? formatDate(propertyData[0].targetCompletionDate)
                              : 'N/A'}
                          </div>
                        )}
                      </span>
                    </p>
                    <p className="inline-flex flex-col xl:items-center ">
                      <span className=" text-sm h-8  text-gray-400">
                        Project Growth Rate
                      </span>
                      <span className=" font-medium text-base text-2xl text-gray-800 ">
                        {propertyData && propertyData.length > 0 && (
                          <div>
                            {propertyData[0].capitalGrowthRate} %
                          </div>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homeproperties;