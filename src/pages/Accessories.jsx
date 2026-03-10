import { useState, useEffect } from 'react';
import { Smartphone, Laptop, Tablet, ShoppingCart, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { MOCK_ACCESSORIES } from '../data/mockData';

const Accessories = () => {
  const [activeTab, setActiveTab] = useState('Mobile');
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [usingMock, setUsingMock] = useState(false);
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const tabs = [
    { id: 'Mobile', label: 'Mobile Accessories', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'Laptop', label: 'Laptop Accessories', icon: <Laptop className="w-5 h-5" /> },
    { id: 'Tablet', label: 'Tablet Accessories', icon: <Tablet className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchAccessories = async () => {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      try {
        if (apiUrl) {
          const res = await fetch(`${apiUrl}/accessories?category=${activeTab}`);
          const data = await res.json();
          if (res.ok && Array.isArray(data)) {
            setAccessories(data);
            setUsingMock(false);
          } else {
            setAccessories(MOCK_ACCESSORIES[activeTab] || []);
            setUsingMock(true);
          }
        } else {
          setAccessories(MOCK_ACCESSORIES[activeTab] || []);
          setUsingMock(true);
        }
      } catch (error) {
        console.error("Error fetching accessories", error);
        setAccessories(MOCK_ACCESSORIES[activeTab] || []);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, [activeTab]);

  const filteredAccessories = accessories.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-navy-900">Accessories Store</h1>
            <p className="text-gray-500 mt-2 font-medium">Find the best accessories for your devices.</p>
          </div>
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search accessories..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-navy-100 focus:border-navy-500 transition-all font-medium text-navy-900 placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 rounded-t-2xl font-black text-sm uppercase tracking-wide transition-all ${activeTab === tab.id
                ? 'bg-white text-navy-900 border-b-2 border-lime-500 shadow-sm'
                : 'text-gray-400 hover:text-navy-700 hover:bg-gray-100'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : filteredAccessories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAccessories.map((item) => (
              <div key={item._id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <ShoppingCart className="w-16 h-16 text-gray-200" />
                  )}
                  {(item.stock <= 5 && item.stock > 0) && (
                    <span className="absolute top-4 left-4 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Low Stock
                    </span>
                  )}
                  {item.stock === 0 && (
                    <span className="absolute top-4 left-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="text-lg font-black text-navy-900 mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-4">
                    <span className="text-xl font-black text-lime-600">${item.price}</span>
                    <button
                      onClick={() => {
                        addToCart(item);
                        showToast(`${item.name} added to cart`, 'success');
                      }}
                      className="p-2 bg-navy-900 text-white rounded-xl hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/20"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-navy-900">No accessories found</h3>
            <p className="text-gray-500 mt-2">Check back later for new items in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accessories;
