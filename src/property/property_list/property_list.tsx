import React, { useState, useEffect } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from "axios";
import { apiURL } from "enviornment";
import axiosInstance from "utils/intercepter";
import { Property } from "utils/models/Property";
import default_property from '../../assets/images/smart_property.png'
import { FormControl, InputLabel, MenuItem, Pagination, PaginationItem, Select, SelectChangeEvent } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { formatCurrency } from "utils/utils";
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
const PAGE_SIZE = 12;
const PropertyList: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { propertyId } = useParams();
  const [propertyData, setProperty] = useState<Property[] | null>(null)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [location, setLocation] = useState<string[]>([]);;
  const [postalCode, setPostalCode] = useState<string[]>([]);;
  const [hsg, setHSG] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPostalCode, setSelectedPostalCode] = useState<number>(0);
  const [selectedHsg, setSelectedHsg] = useState<number>(0);
  const [listType, setListType] = useState<'grid' | 'list'>('grid');
  const handleChange = (selectedLocation: string) => {
    setSelectedLocation(selectedLocation);
   // filterProperties(selectedLocation, selectedPostalCode, selectedHsg);

  };
  const postalCodeChange = (selectedPostalCode: number) => {
    setSelectedPostalCode(selectedPostalCode);
   // filterProperties(selectedLocation, selectedPostalCode, selectedHsg);

  };
  const hsgChange = (selectedHsg: number) => {
    setSelectedHsg(selectedHsg);
   // filterProperties(selectedLocation, selectedPostalCode, selectedHsg);

  };
  // const filterProperties = (location: string, postalCode: number, hsg: number | '') => {
  //   let filtered: Property[] | null = null;
  //   if (propertyData) {
  //     filtered = [...propertyData]; // Create a shallow copy to avoid modifying the original array

  //     if (location) {
  //       filtered = filtered.filter(property => property.addressLine2 === location);
  //     }

  //     if (postalCode !== '') {
  //       filtered = filtered.filter(property => property.postalCode === postalCode);
  //     }

  //     if (hsg !== '') {
  //       filtered = filtered.filter(property => property.historicalSuburbGrowthRate === hsg);
  //     }
  //   }
  //   setFilteredProperties(filtered || []);
  // };
  const moveToInvestment = () => {
    navigate("/investment");
  };
  const handleClick = (propertyId: any) => {
    ;
    navigate(`/DetailsPage/${propertyId}`);
  };
  const getPropertyList = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.get(apiURL + '/property/getAllProperty');
      const { errorMsg, successMsgList, data } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        setProperty(data.PropertyList);
        setFilteredProperties(data.PropertyList);
        const uniqueLocations = Array.from(new Set(data.PropertyList.map(property => property.addressLine2)));
        const uniquePostalCodes = Array.from(new Set(data.PropertyList.map(property => property.postalCode)));
        const uniqueHSG = Array.from(new Set(data.PropertyList.map(property => property.historicalSuburbGrowthRate)));
        setLocation(uniqueLocations);
       // setPostalCode(uniquePostalCodes);
        //setHSG(uniqueHSG);
      } else { }


      console.log(response);
    } catch (error) {
      console.error('Error fetching property data:', error);

    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    console.log('Component mounted');

    getPropertyList();
  }, []);
  const handleListClick = (listType: 'grid' | 'list') => {
    setListType(listType);

  };
  const getFeatureColorClass = (propertyType: string) => {
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
    <section className="md:p-16 pt-16" >
      {/* <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
              <InputLabel id="location">Locations</InputLabel>
              <Select
                labelId="location"
                id="location"
                value={selectedLocation}
                label="locations"
                onChange={(e) => handleChange(e.target.value as string)}
                endAdornment={
                  <InputAdornment position="end" style={{ marginRight: '12px' }}>
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {location.map((location, index) => (
                  <MenuItem key={index} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex flex-col">
            <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
              <InputLabel id="postalCode">Postal Code</InputLabel>
              <Select
                labelId="postalCode"
                id="postalCode"
                value={selectedPostalCode}
                label="Postal Code"
                onChange={(e) => postalCodeChange(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {postalCode.map((pc, index) => (
                  <MenuItem key={index} value={pc}>
                    {pc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex flex-col">
            <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
              <InputLabel id="hsg">Historical Suburb Growth</InputLabel>
              <Select
                labelId="hsg"
                id="hsg"
                value={selectedHsg}
                label="Historical Suburb Growth"
                onChange={(e) => hsgChange(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {hsg.map((hs, index) => (
                  <MenuItem key={index} value={hs}>
                    {hs}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex flex-col">
            <div className="flex mt-2" >
              <button className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 ${listType === 'grid' ? 'text-blue-400 active' : ''}`}
                onClick={() => handleListClick('grid')} id="grid">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="fill-current w-8 h-8 mr-2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                <span className="text-xl">Grid</span>
              </button>
              <button className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 ${listType === 'list' ? 'text-blue-400 active active' : ''}`}
                onClick={() => handleListClick('list')} id="list">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="fill-current w-8 h-8 mr-2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                <span className="text-xl">List</span>
              </button>
            </div>

          </div>
        </div>
      </div> */}
      <div className="mx-auto p-4">

        {listType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-3 w-full">
            {filteredProperties?.map(property => (
              <div key={property.id} onClick={() => handleClick(property?.id)} className="relative mx-auto w-full h-full cursor-pointer">
                <div className="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full h-full">
                  <div className="shadow p-4 rounded-lg bg-white h-full">
                    <div className="flex justify-center relative rounded-lg overflow-hidden h-52">
                      <div className="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
                        <img className="h-48 w-full ml-0 mr-0 object-cover absolute inset-0 md:h-full" src={default_property} />

                      </div>

                      <div className="absolute flex justify-center bottom-0 mb-3">
                        <div className="flex bg-white px-4 py-1 space-x-5 rounded-lg overflow-hidden shadow">
                          <p className="flex items-center font-medium text-gray-800">
                            <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480,226.15V80a48,48,0,0,0-48-48H80A48,48,0,0,0,32,80V226.15C13.74,231,0,246.89,0,266.67V472a8,8,0,0,0,8,8H24a8,8,0,0,0,8-8V416H480v56a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V266.67C512,246.89,498.26,231,480,226.15ZM64,192a32,32,0,0,1,32-32H208a32,32,0,0,1,32,32v32H64Zm384,32H272V192a32,32,0,0,1,32-32H416a32,32,0,0,1,32,32ZM80,64H432a16,16,0,0,1,16,16v56.9a63.27,63.27,0,0,0-32-8.9H304a63.9,63.9,0,0,0-48,21.71A63.9,63.9,0,0,0,208,128H96a63.27,63.27,0,0,0-32,8.9V80A16,16,0,0,1,80,64ZM32,384V266.67A10.69,10.69,0,0,1,42.67,256H469.33A10.69,10.69,0,0,1,480,266.67V384Z"></path></svg>
                            {property.bedType}
                          </p>
                          <p className="flex items-center font-medium text-gray-800">
                            <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504,256H64V61.25a29.26,29.26,0,0,1,49.94-20.69L139.18,65.8A71.49,71.49,0,0,0,128,104c0,20.3,8.8,38.21,22.34,51.26L138.58,167a8,8,0,0,0,0,11.31l11.31,11.32a8,8,0,0,0,11.32,0L285.66,65.21a8,8,0,0,0,0-11.32L274.34,42.58a8,8,0,0,0-11.31,0L251.26,54.34C238.21,40.8,220.3,32,200,32a71.44,71.44,0,0,0-38.2,11.18L136.56,18A61.24,61.24,0,0,0,32,61.25V256H8a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8H32v96c0,41.74,26.8,76.9,64,90.12V504a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V480H384v24a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V474.12c37.2-13.22,64-48.38,64-90.12V288h24a8,8,0,0,0,8-8V264A8,8,0,0,0,504,256ZM228.71,76.9,172.9,132.71A38.67,38.67,0,0,1,160,104a40,40,0,0,1,40-40A38.67,38.67,0,0,1,228.71,76.9ZM448,384a64.07,64.07,0,0,1-64,64H128a64.07,64.07,0,0,1-64-64V288H448Z"></path></svg>
                            {property.bathType}
                          </p>
                          <p className="flex items-center font-medium text-gray-800">
                            <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512"><path d="M423.18 195.81l-24.94-76.58C387.51 86.29 356.81 64 322.17 64H157.83c-34.64 0-65.34 22.29-76.07 55.22L56.82 195.8C24.02 205.79 0 235.92 0 271.99V400c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48v-16h256v16c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48V271.99c0-36.07-24.02-66.2-56.82-76.18zm-310.99-66.67c6.46-19.82 24.8-33.14 45.64-33.14h164.34c20.84 0 39.18 13.32 45.64 33.13l20.47 62.85H91.72l20.47-62.84zM80 400c0 8.83-7.19 16-16 16H48c-8.81 0-16-7.17-16-16v-16h48v16zm368 0c0 8.83-7.19 16-16 16h-16c-8.81 0-16-7.17-16-16v-16h48v16zm0-80.01v32H32v-80c0-26.47 21.53-48 48-48h320c26.47 0 48 21.53 48 48v48zM104.8 248C78.84 248 60 264.8 60 287.95c0 23.15 18.84 39.95 44.8 39.95l10.14.1c39.21 0 45.06-20.1 45.06-32.08 0-24.68-31.1-47.92-55.2-47.92zm10.14 56c-3.51 0-7.02-.1-10.14-.1-12.48 0-20.8-6.38-20.8-15.95S92.32 272 104.8 272s31.2 14.36 31.2 23.93c0 7.17-10.53 8.07-21.06 8.07zm260.26-56c-24.1 0-55.2 23.24-55.2 47.93 0 11.98 5.85 32.08 45.06 32.08l10.14-.1c25.96 0 44.8-16.8 44.8-39.95 0-23.16-18.84-39.96-44.8-39.96zm0 55.9c-3.12 0-6.63.1-10.14.1-10.53 0-21.06-.9-21.06-8.07 0-9.57 18.72-23.93 31.2-23.93s20.8 6.38 20.8 15.95-8.32 15.95-20.8 15.95z"></path></svg>
                            {property.parkingType}
                          </p>


                        </div>
                      </div>


                      <span className={`absolute top-0 left-0 inline-flex mt-3 ml-3 px-3 py-2 rounded-lg z-10 ${getFeatureColorClass(property.propertyType)} text-sm font-medium text-white select-none`}>
                        {property.propertyType}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h2 className="font-medium text-base md:text-lg text-gray-800 line-clamp-1" title="New York">
                        <div> {property.propertyName}</div>

                      </h2>
                      <p className="mt-2 text-sm text-gray-800 line-clamp-2 min-h-4" title="New York, NY 10004, United States">
                        {property.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 grid-rows-2 gap-4  mt-8">
                      <p className="inline-flex flex-col  xl:items-center ">
                        <span className="   text-sm h-8 text-gray-400">
                          Project Value
                        </span>
                        <span className="font-medium text-base text-2xl text-gray-800 ">
                          {formatCurrency(property.baseRate)}
                        </span>
                      </p>
                      <p className="inline-flex flex-col  xl:items-center">
                        <span className=" h-8  text-sm xl:items-center  text-gray-400">
                          Block Price
                        </span>
                        <span className=" font-medium text-base text-2xl text-gray-800 ">
                          {formatCurrency(property.latestRate)}
                        </span>
                      </p>
                      <p className="inline-flex flex-col w xl:items-center ">
                        <span className=" text-sm h-8 text-gray-400">
                          Target Completion
                        </span>
                        <span className="font-medium text-base text-2xl text-gray-800 ">
                          {formatCurrency(property.latestBlockValuation)}
                        </span>
                      </p>
                      <p className="inline-flex flex-col xl:items-center ">
                        <span className=" text-sm h-8  text-gray-400">
                          Project Growth Rate
                        </span>
                        <span className=" font-medium text-base text-2xl text-gray-800 ">

                          {property.historicalSuburbGrowthRate} %

                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 md:gap-6 gap-3 w-full">
            {filteredProperties?.map(property => (
              <div className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden w-full">
                <div className="md:flex">
                  <div className="md:shrink-0">
                    <img className="h-48 w-full ml-0 mr-0 object-cover md:h-full" src={default_property} />

                  </div>
                  <div className="md:p-8 p-4 w-full">
                    <div className=" flex justify-end right-0 mr-3">
                      <div className="flex bg-white px-4 py-1 space-x-5 rounded-lg overflow-hidden shadow">
                        <p className="flex items-center font-medium text-gray-800">
                          <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480,226.15V80a48,48,0,0,0-48-48H80A48,48,0,0,0,32,80V226.15C13.74,231,0,246.89,0,266.67V472a8,8,0,0,0,8,8H24a8,8,0,0,0,8-8V416H480v56a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V266.67C512,246.89,498.26,231,480,226.15ZM64,192a32,32,0,0,1,32-32H208a32,32,0,0,1,32,32v32H64Zm384,32H272V192a32,32,0,0,1,32-32H416a32,32,0,0,1,32,32ZM80,64H432a16,16,0,0,1,16,16v56.9a63.27,63.27,0,0,0-32-8.9H304a63.9,63.9,0,0,0-48,21.71A63.9,63.9,0,0,0,208,128H96a63.27,63.27,0,0,0-32,8.9V80A16,16,0,0,1,80,64ZM32,384V266.67A10.69,10.69,0,0,1,42.67,256H469.33A10.69,10.69,0,0,1,480,266.67V384Z"></path></svg>
                          {property.bedType}
                        </p>
                        <p className="flex items-center font-medium text-gray-800">
                          <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504,256H64V61.25a29.26,29.26,0,0,1,49.94-20.69L139.18,65.8A71.49,71.49,0,0,0,128,104c0,20.3,8.8,38.21,22.34,51.26L138.58,167a8,8,0,0,0,0,11.31l11.31,11.32a8,8,0,0,0,11.32,0L285.66,65.21a8,8,0,0,0,0-11.32L274.34,42.58a8,8,0,0,0-11.31,0L251.26,54.34C238.21,40.8,220.3,32,200,32a71.44,71.44,0,0,0-38.2,11.18L136.56,18A61.24,61.24,0,0,0,32,61.25V256H8a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8H32v96c0,41.74,26.8,76.9,64,90.12V504a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V480H384v24a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V474.12c37.2-13.22,64-48.38,64-90.12V288h24a8,8,0,0,0,8-8V264A8,8,0,0,0,504,256ZM228.71,76.9,172.9,132.71A38.67,38.67,0,0,1,160,104a40,40,0,0,1,40-40A38.67,38.67,0,0,1,228.71,76.9ZM448,384a64.07,64.07,0,0,1-64,64H128a64.07,64.07,0,0,1-64-64V288H448Z"></path></svg>
                          {property.bathType}
                        </p>
                        <p className="flex items-center font-medium text-gray-800">
                          <svg className="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512"><path d="M423.18 195.81l-24.94-76.58C387.51 86.29 356.81 64 322.17 64H157.83c-34.64 0-65.34 22.29-76.07 55.22L56.82 195.8C24.02 205.79 0 235.92 0 271.99V400c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48v-16h256v16c0 26.47 21.53 48 48 48h16c26.47 0 48-21.53 48-48V271.99c0-36.07-24.02-66.2-56.82-76.18zm-310.99-66.67c6.46-19.82 24.8-33.14 45.64-33.14h164.34c20.84 0 39.18 13.32 45.64 33.13l20.47 62.85H91.72l20.47-62.84zM80 400c0 8.83-7.19 16-16 16H48c-8.81 0-16-7.17-16-16v-16h48v16zm368 0c0 8.83-7.19 16-16 16h-16c-8.81 0-16-7.17-16-16v-16h48v16zm0-80.01v32H32v-80c0-26.47 21.53-48 48-48h320c26.47 0 48 21.53 48 48v48zM104.8 248C78.84 248 60 264.8 60 287.95c0 23.15 18.84 39.95 44.8 39.95l10.14.1c39.21 0 45.06-20.1 45.06-32.08 0-24.68-31.1-47.92-55.2-47.92zm10.14 56c-3.51 0-7.02-.1-10.14-.1-12.48 0-20.8-6.38-20.8-15.95S92.32 272 104.8 272s31.2 14.36 31.2 23.93c0 7.17-10.53 8.07-21.06 8.07zm260.26-56c-24.1 0-55.2 23.24-55.2 47.93 0 11.98 5.85 32.08 45.06 32.08l10.14-.1c25.96 0 44.8-16.8 44.8-39.95 0-23.16-18.84-39.96-44.8-39.96zm0 55.9c-3.12 0-6.63.1-10.14.1-10.53 0-21.06-.9-21.06-8.07 0-9.57 18.72-23.93 31.2-23.93s20.8 6.38 20.8 15.95-8.32 15.95-20.8 15.95z"></path></svg>
                          {property.parkingType}
                        </p>
                      </div>
                    </div>
                    <a className="block mt-1 text-lg leading-tight font-medium text-black hover:underline text-left">{property.propertyName} </a>
                    <p className="mt-2 text-slate-500 text-left"> {property.description}</p>
                    <div className="md:flex grid grid-cols-2 md:flex-row gap-4 mt-8">
                      <p className="inline-flex flex-col  xl:items-center ">
                        <span className="   text-sm h-8 text-gray-400">
                          Base Rate
                        </span>
                        <span className="font-medium text-base text-2xl text-gray-800 ">
                          {formatCurrency(property.baseRate)}
                        </span>
                      </p>
                      <p className="inline-flex flex-col  xl:items-center">
                        <span className=" h-8  text-sm xl:items-center  text-gray-400">
                          Latest Rate
                        </span>
                        <span className=" font-medium text-base text-2xl text-gray-800 ">
                          {formatCurrency(property.latestRate)}
                        </span>
                      </p>
                      <p className="inline-flex flex-col w xl:items-center ">
                        <span className=" text-sm h-8 text-gray-400">
                          Latest SPO Valuation
                        </span>
                        <span className="font-medium text-base text-2xl text-gray-800 ">
                          {formatCurrency(property.latestBlockValuation)}
                        </span>
                      </p>
                      <p className="inline-flex flex-col xl:items-center ">
                        <span className=" text-sm h-8  text-gray-400">
                          Historical Rate
                        </span>
                        <span className=" font-medium text-base text-2xl text-gray-800 ">

                          {property.historicalSuburbGrowthRate} %

                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

        )}

        {/* {propertyData && propertyData.length > 0 && (
        <Pagination
          count={Math.ceil(propertyData.length / PAGE_SIZE)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          className="mt-4"
          renderItem={(item) => (
            <PaginationItem
              {...item}
              className={`${item.type === 'page' ? 'hover:bg-blue-200' : ''} border border-blue-500 mx-1`}
            />
          )}
        />
      )} */}
      </div>


    </section>
  );
};

export default PropertyList;
