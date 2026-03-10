import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContextHooks';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (!user) {
      navigate('/signin?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md w-full">
          <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6 text-lime-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-navy-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/accessories" className="block w-full py-4 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-navy-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white p-4 md:p-6 rounded-[2rem] border border-gray-100 flex gap-6 items-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-grow">
                  <Link to={`/accessory/${item.product}`} className="text-lg font-black text-navy-900 line-clamp-1 hover:text-lime-600 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-lime-600 font-bold mb-2">${item.price}</p>

                  <div className="flex items-center gap-4">
                    <select
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 font-bold text-navy-900 focus:outline-none focus:border-lime-500"
                      value={item.qty}
                      onChange={(e) => addToCart({ ...item, _id: item.product, stock: item.countInStock }, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl sticky top-28">
              <h2 className="text-xl font-black text-navy-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <span className="text-navy-900 font-bold">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-black text-navy-900">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full py-4 bg-lime-500 text-navy-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-lime-400 transition-all shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link to="/accessories" className="block text-center mt-4 text-gray-400 font-bold text-sm hover:text-navy-900 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
