import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContextHooks";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Table from "../../components/Table";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = user?.token;
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const columns = [
    { header: "Order ID", accessor: "_id", render: (item) => <span className="font-mono text-xs">{item._id}</span> },
    { header: "Date", accessor: "createdAt", render: (item) => new Date(item.createdAt).toLocaleDateString() },
    { header: "Total", accessor: "totalPrice", render: (item) => <span className="font-bold">${item.totalPrice}</span> },
    {
      header: "Paid",
      accessor: "isPaid",
      render: (item) => item.isPaid ?
        <span className="px-2 py-1 bg-lime-100 text-lime-700 rounded-md text-xs font-black uppercase">Paid</span> :
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-black uppercase">Not Paid</span>
    },
    {
      header: "Delivered",
      accessor: "isDelivered",
      render: (item) => item.isDelivered ?
        <span className="px-2 py-1 bg-lime-100 text-lime-700 rounded-md text-xs font-black uppercase">Delivered</span> :
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-black uppercase">{item.status}</span>
    },
    {
      header: "Action",
      render: (item) => (
        <Link to={`/order/${item._id}`} className="text-lime-600 hover:underline font-bold text-xs uppercase tracking-wide">
          Details
        </Link>
      )
    }
  ];

  if (!user) return <div className="text-center pt-32">Please log in</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-navy-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-navy-900">No orders yet</h3>
            <p className="text-gray-500 mt-2 mb-8">You haven't placed any orders yet.</p>
            <Link to="/accessories" className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-navy-800 transition-all shadow-lg">
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <Table columns={columns} data={orders} />
        )}
      </div>
    </div>
  );
};

export default MyOrders;
