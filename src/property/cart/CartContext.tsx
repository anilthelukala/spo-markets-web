import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartModel } from 'utils/models/cart';



interface CartState {
  cart: CartModel[];
  totalItems: number;
}

interface CartContextProps {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartModel }
  | { type: 'REMOVE_FROM_CART'; payload: string };

const CartContext = createContext<CartContextProps | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const updatedCartAdd = [...state.cart, action.payload];
      return { ...state, cart: updatedCartAdd, totalItems: state.totalItems + 1 };
    case 'REMOVE_FROM_CART':
      const itemIdToRemove = action.payload;
      const updatedCartRemove = state.cart.filter(item => item.id !== itemIdToRemove);
      return { ...state, cart: updatedCartRemove, totalItems: state.totalItems - 1 };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [], totalItems: 0 });

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
