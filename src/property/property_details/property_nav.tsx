import React, { useEffect } from 'react';
import DetailsPage from './DetailsPage';
import Footer from '../../components/Footer';
import Navbar from 'components/Navbar';

const PropertyDetails: React.FC = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100); // Adjust the delay as needed
  }, []);
    return (
      <div id="header" className="text-center  lg:text-left xl:pt-16 ">
        <Navbar />
        <DetailsPage />
        <Footer/>
      </div>
    );
  };
  
  export default PropertyDetails;