import React, { useEffect } from 'react';
import PropertyList from './property_list';
import Footer from '../../components/Footer';
import Navbar from 'components/Navbar';

const PropertyListPage: React.FC = (props) => {
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
        <PropertyList />
        <Footer/>
      </div>
    );
  };
  
  export default PropertyListPage;