// Cart.tsx
import React, { useState, useEffect } from 'react';
import './cart.css'; // Import your CSS file for styling
import smart_property from '../../assets/images/smart_property.png';
import axios, { AxiosResponse } from 'axios';
import { apiURL } from '../../enviornment';
import axiosInstance from 'utils/intercepter';
import { CartModel } from '../../utils/models/cart';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { formatCurrency } from 'utils/utils';
interface Message {
  messageType: string;
  message: string;
}
interface CartResponse {
  data: {
    CartSummary: CartModel[];
  };
  errorMsg: Message[];
  successMsgList: Message[];
}
interface ApiResponse {
  data: {
  };
  errorMsg: Message[];
  successMsgList: Message[];
}
interface CartItem {
  propertyId: string;
  noOfUnitsToPurchase: number;
  pricePerUnit: number;
  platformCharge: number;
  totalPrice: number;
}


const Cart: React.FC = () => {
  // const [cart, setCart] = useState<CartItem[]>(cartItems);
  const cartArray: CartItem[] = [];
  const [cart, setCart] = useState<CartModel[] | []>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartBlocks, setCartBlock] = useState(0);
  const [plateformCharges, setPlateformCharges] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const removeFromCart = async (id: string) => {
    try {
      const token = localStorage.getItem('token');

      const response: AxiosResponse<CartResponse> = await axiosInstance.delete(apiURL + '/userCart/removeCart/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { successMsgList } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        //setProperty(data.property);
        getCartSummary();
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
        //dispatch({ type: 'REMOVE_FROM_CART', payload: id });

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


  const editCart = async (cartId: any, propertyId: any) => {
    navigate(`/investment/${propertyId}/${cartId}`);
  }

  const getCartSummary = async () => {
    try {
      setCart([]);
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem("username");
      const response: AxiosResponse<CartResponse> = await axiosInstance.get(apiURL + '/userCart/summary/' + userName, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { successMsgList } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        //setProperty(data.property);
        setCart(response.data.data.CartSummary);
        //dispatch({ type: 'REMOVE_FROM_CART', payload: cart});

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


    getCartSummary();
  }, []);

  useEffect(() => {
    var carTot = 0;
    var NoOfBlock = 0;
    if (null !== cart && undefined !== cart && cart.length > 0) {

      cart.forEach(item => {
        carTot = carTot + (item.propertyFractionalisation.pricePerUnit * item.noOfSelectedUnits);
        NoOfBlock = NoOfBlock + (item.noOfSelectedUnits / item.propertyFractionalisation.blockSize);

        const customCartItem = {
          propertyId: item.propertyFractionalisation.propertyId,
          propertyName: item.property.propertyName,
          noOfUnitsToPurchase: item.noOfSelectedUnits,
          pricePerUnit: item.propertyFractionalisation.pricePerUnit,
          platformCharge: parseFloat(((0.50 / 100) * carTot).toFixed(3)),
          totalPrice: parseFloat((carTot + (0.50 / 100) * carTot).toFixed(3))
        };

        cartArray.push(customCartItem);
      });

      const charges = (0.50 / 100) * carTot
      setPlateformCharges(parseFloat(charges.toFixed(3)));

    }
    setCartBlock(NoOfBlock);
    setCartTotal(carTot);

  }, [cart, cartArray]);
  const checkout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(cartArray);
      console.log(apiURL + 'payments/initiatePayment', cartArray);
      const response = await axios.post(apiURL + '/payments/initiatePayment', cartArray, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { successMsgList } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
        const stripeRedirectUrl = response.data.data.stripeRedirectUrl;
        console.log("Payment Initiated. Redirecting to Stripe...");
        window.location.href = stripeRedirectUrl;


      } else {


      }

      console.log(response.data);


      console.log(response);
    } catch (error) {
      console.error('Error fetching property data:', error);

    }
  }

  return (
    <div className="cart-container1">
      {cart.length > 0 ? (
        <div className="cart-container">
          <ul className="cart-list">
            {cart.map((item: CartModel, index: number) => (
              <li key={index} className="cart-item">
                <div className="product-details">
                  <div className="product-image">
                    <img src={`${smart_property}`} alt={item.propertyId} className="item-image" />
                  </div>
                  <div className="product-info">
                    <p className="item-name">Property Name:{item?.property?.propertyName}</p>
                    <p className="item-quantity">Blocks: {item.noOfSelectedUnits}</p>
                    <p className="item-price">Price: {formatCurrency(item.propertyFractionalisation.pricePerUnit * item.propertyFractionalisation.blockSize)}</p>
                    <p className="item-price">Amount: {formatCurrency(item.propertyFractionalisation.pricePerUnit * item.propertyFractionalisation.blockSize * item.noOfSelectedUnits)}</p>
                  </div>
                  <div className="cart-actions">
                    <button onClick={() => removeFromCart(item.id)} className="remove-button">
                      Remove
                    </button>
                    <button onClick={() => editCart(item.id, item.propertyId)} className="remove-button">
                      Edit Cart
                    </button>
                  </div>
                </div>


              </li>
            ))}
          </ul>


        </div>
      ) : <div className="cart-container"><h1 style={{ marginTop: 20, marginLeft: 230 }}>Cart is empty</h1></div>}
      {cart.length > 0 ? (
        <div className="total-container">
          <span className="total-label">Properties:</span>
          <span className="property-count">
            {cart.length}
          </span>
          <br />
          <span className="total-label"  >Blocks:</span>
          <span className="blocks-charges">
            {cartBlocks}
          </span>
          <br />
          <span className="total-label"  >Plat Form Charges:</span>
          <span className="platform-charges">
            {formatCurrency(plateformCharges)}
          </span>
          <br />
          <span className="total-label">Amount:</span>
          <span className="amount">
            {formatCurrency(cartTotal)}
          </span>
          <br />
          <span className="total-label">Total Amount:</span>
          <span className="total-amount">
            {formatCurrency(cartTotal + plateformCharges)}
          </span>

          <br />
          <div className='w-full' style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => checkout()} className='btn-solid-lg' style={{ marginTop: 20, padding: 20 }} >
              <span className="hidden md:flex">PLACE ORDER</span>
              <span className="md:hidden">PLACE ORDER</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>

  );
};

export default Cart;
