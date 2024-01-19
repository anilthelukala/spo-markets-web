import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import FeatureBack from '../assets/images/feature_back.jpg';

const Feature: React.FC = () => {
  const token = localStorage.getItem('token');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const containerStyle: React.CSSProperties = {
    backgroundImage: `url(${FeatureBack})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    // Add other background-related styles if needed, such as backgroundSize, backgroundPosition, etc.
  };
  useEffect(() => {
    setIsLoggedIn(!!token);
  },[isLoggedIn]);




  return (
    <section id='Feature' >
      <div className='container mb-16 md:mb-2 px-4 md:mt-12 pt-32 md:pt-0 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8'>
       
          {/* Left Item */}
          <div className="md:mb-16 mb-8 lg:mt-12 xl:mt-12 xl:mr-12">
            <h1 className="h1-large mb-5"> Want an easier way to invest in property?</h1>
            <p className="p-large mb-8">Spo Marktes is an award-winning platform that provides a simple and low-cost way to access the property market.</p>
            {!isLoggedIn && (
              <Link to='/signup' className='btn-solid-lg hidden'>
                <span className='hidden md:flex'>Invest Now</span>
                <span className='md:hidden'>Invest Now</span>
              </Link>
            )}
            {isLoggedIn && (
              <Link to='/propertyList' className='btn-solid-lg hidden'>
                <span className='hidden md:flex'>Invest Now</span>
                <span className='md:hidden'>Invest Now</span>
              </Link>
            )}
            
              {/* <Link
                to='#'
                className='btn-solid-lg secondary'>
                <span className='hidden md:flex'>Learn How it Works</span>
                <span className='md:hidden'>How it Works</span>
              </Link> */}
          </div>
          {/* Image */}
          <div className='hidden md:flex xl:text-right mb-2 lg:mt-12 xl:mt-12 xl:mr-12'>
            <ReactPlayer  url={require('../assets/video/intro.mp4')} // Replace with the actual path to your video file
        controls={true} width='100%' height='20rem'/>
          </div>
          <div className='md:hidden  xl:text-right mb-2 lg:mt-12 xl:mt-12 xl:mr-12'>
            <ReactPlayer  url={require('../assets/video/intro.mp4')} // Replace with the actual path to your video file
        controls={true} width='100%' height='12rem'/>
          </div>
        </div>
     
    </section>

  );
};

export default Feature;