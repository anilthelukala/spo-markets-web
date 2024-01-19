import React, { useEffect } from 'react';
import ProfileDetails from './profile_details';
import Footer from '../../components/Footer';
import Navbar from 'components/Navbar';

const Profile: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Optional: Adds a smooth scrolling effect
    });
  }, []); 
    return (
      <div id="header" className=" text-center  lg:text-left xl:pt-16 ">
        <Navbar />
        <ProfileDetails />
        <Footer/>
      </div>
    );
  };
  
  export default Profile;