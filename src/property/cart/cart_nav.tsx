import Navbar from 'components/Navbar';
import React, { useEffect } from 'react';
import Footer from '../../components/Footer';
import Cart from './cart';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartDetails: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Optional: Adds a smooth scrolling effect
    });
  }, []); 


  
  return (
    <div id="header" className="text-center  lg:text-left xl:pt-16 ">
      <Navbar />
      <Cart  />
      <Footer />
    </div>
  );
};

export default CartDetails;
