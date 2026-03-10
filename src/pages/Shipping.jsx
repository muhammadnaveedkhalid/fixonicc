import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContextHooks';
import { useToast } from '../context/ToastContext';
import { Check, Truck, CreditCard } from 'lucide-react';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1e293b',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#dc2626' },
  },
};

const ShippingContent = ({ stripe = null, elements = null }) => {
  const { cartItems, shippingAddress, saveShippingAddress, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [processing, setProcessing] = useState(false);

  const itemsPrice = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    if (!user) navigate('/signin');
    if (cartItems.length === 0) navigate('/cart');
  }, [user, cartItems, navigate]);

  const placeOrderHandler = async () => {
    if (!address || !city || !postalCode || !country) {
      showToast('Please fill in all shipping details', 'error');
      return;
    }
    saveShippingAddress({ address, city, postalCode, country });
    setProcessing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };
      if (paymentMethod === 'Stripe' && stripe && elements && stripePublishableKey) {
        const cardEl = elements.getElement(CardElement);
        if (cardEl) {
          const { error, paymentMethod: pm } = await stripe.createPaymentMethod({ type: 'card', card: cardEl });
          if (error) {
            showToast(error.message || 'Card error', 'error');
            setProcessing(false);
            return;
          }
          if (pm) orderData.paymentMethodId = pm.id;
        }
      }
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const order = await res.json();
        clearCart();
        showToast('Order placed successfully!', 'success');
        navigate(`/order/${order._id}`);
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to place order', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-8">

            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-navy-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 font-bold text-navy-900"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 font-bold text-navy-900"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 font-bold text-navy-900"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Country</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 font-bold text-navy-900"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-navy-900">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border border-lime-500 bg-lime-50 rounded-2xl cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-lime-600 focus:ring-lime-500"
                  />
                  <span className="font-bold text-navy-900">Credit / Debit Card (Stripe)</span>
                </label>
                {elements && stripePublishableKey && paymentMethod === 'Stripe' && (
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Card details</p>
                    <CardElement options={CARD_ELEMENT_OPTIONS} className="p-3 border border-gray-200 rounded-xl bg-white" />
                  </div>
                )}
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl cursor-pointer opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="PayPal"
                    disabled
                    className="w-5 h-5 text-gray-400"
                  />
                  <span className="font-bold text-gray-400">PayPal (Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl sticky top-28">
              <h2 className="text-xl font-black text-navy-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Items</span>
                  <span className="text-navy-900 font-bold">${itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-navy-900 font-bold">${shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Tax</span>
                  <span className="text-navy-900 font-bold">${taxPrice}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-black text-navy-900">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item.product} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg p-1">
                      <img src={item.image} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-gray-600 line-clamp-1 flex-grow">{item.name}</span>
                    <span className="font-bold text-navy-900">x{item.qty}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={placeOrderHandler}
                disabled={processing}
                className="w-full mt-8 py-4 bg-lime-500 text-navy-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-lime-400 transition-all shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" /> {processing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShippingWithStripe = () => {
  const stripe = useStripe();
  const elements = useElements();
  return <ShippingContent stripe={stripe} elements={elements} />;
};

const Shipping = () => {
  if (stripePromise) {
    return (
      <Elements stripe={stripePromise}>
        <ShippingWithStripe />
      </Elements>
    );
  }
  return <ShippingContent />;
};

export default Shipping;
