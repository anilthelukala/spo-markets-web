import React, { useEffect } from 'react';
import Footer from '../../components/Footer';
import InvestmentCalculator from './investment_calculator';
import Navbar from 'components/Navbar';

const InvestmentCalculatorDetails: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Optional: Adds a smooth scrolling effect
    });
  }, []); 

  
    return (
      <div id="header" className="text-center  lg:text-left xl:pt-16 ">
        <Navbar />
        <InvestmentCalculator />
        <Footer/>
      </div>
    );
  };
  
  export default InvestmentCalculatorDetails;