import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContextHooks";
import { CheckCircle, Clock, Truck, Package, Download } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;

        const rawBase = (import.meta.env.VITE_API_BASE_URL ?? (typeof window !== "undefined" ? `${window.location.origin}/api` : "/api")).replace(/\/$/, "");
        const apiBase = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;
        const res = await fetch(`${apiBase}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          showToast("Failed to load order details", "error");
        }
      } catch (error) {
        console.error(error);
        showToast("Error loading order", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading...</div>;
  if (!order) return <div className="min-h-screen pt-32 text-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-navy-900">Order #{order._id.substring(0, 8)}</h1>
            <p className="text-gray-500 font-medium mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Payment Button Mock */}
          {!order.isPaid && (
            <button className="px-6 py-3 bg-navy-900 text-white font-black rounded-xl hover:bg-navy-800 transition-all uppercase tracking-widest text-xs shadow-lg">
              Pay Now
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Status Bar */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className={`flex items-center gap-4 ${order.isPaid ? 'text-lime-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${order.isPaid ? 'bg-lime-100' : 'bg-gray-100'}`}>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Payment</h3>
                    <p className="text-xs font-medium">{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Pending Payment"}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${order.status !== 'Processing' ? 'text-lime-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${order.status !== 'Processing' ? 'bg-lime-100' : 'bg-gray-100'}`}>
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Shipping</h3>
                    <p className="text-xs font-medium">{order.isDelivered ? "Delivered" : order.status}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${order.isDelivered ? 'text-lime-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${order.isDelivered ? 'bg-lime-100' : 'bg-gray-100'}`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Delivery</h3>
                    <p className="text-xs font-medium">{order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : "In Progress"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-navy-900 mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/accessory/${item.product}`} className="font-bold text-navy-900 hover:text-lime-600 transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.qty} x ${item.price} = <span className="font-black text-navy-900">${(item.qty * item.price).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Shipping Info */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-navy-900 mb-4">Shipping Info</h2>
              <div className="text-gray-500 space-y-1 text-sm font-medium">
                <p><strong className="text-navy-900">Name:</strong> {order.user.name}</p>
                <p><strong className="text-navy-900">Email:</strong> {order.user.email}</p>
                <p className="pt-2"><strong className="text-navy-900">Address:</strong><br />
                  {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Order Totals */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-navy-900 mb-4">Total Amount</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Subtotal</span>
                  <span className="text-navy-900 font-bold">${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Shipping</span>
                  <span className="text-navy-900 font-bold">${order.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Tax</span>
                  <span className="text-navy-900 font-bold">${order.taxPrice}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-black text-navy-900">
                  <span>Total</span>
                  <span>${order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
