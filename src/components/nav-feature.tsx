import React from 'react';
import Navbar from '../components/Navbar';
import Feature from '../landing-page/Feature';
const NavFeature: React.FC = () => {
    return (
      <div id="header" className="header text-center  lg:text-left xl:pt-16 ">
        <Navbar />
        <Feature />
       
      </div>
    );
  };
  
  export default NavFeature;