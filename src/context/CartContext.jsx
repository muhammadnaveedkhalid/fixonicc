import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    case 'CART_CLEAR_ITEMS':
      return {
        ...state,
        cartItems: []
      };
    case 'CART_SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case 'CART_SAVE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {},
    paymentMethod: 'Stripe'
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
  }, [state.shippingAddress]);

  const addToCart = (product, qty = 1) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.stock,
        qty
      }
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  };

  const saveShippingAddress = (data) => {
    dispatch({ type: 'CART_SAVE_SHIPPING_ADDRESS', payload: data });
  };

  const savePaymentMethod = (data) => {
    dispatch({ type: 'CART_SAVE_PAYMENT_METHOD', payload: data });
  };

  const clearCart = () => {
    dispatch({ type: 'CART_CLEAR_ITEMS' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
