import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Search, Filter } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location", error);
          showToast('Could not access location to sort by distance', 'info');
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_BASE_URL}/vendors`;
        const params = new URLSearchParams();

        if (location) {
          params.append('lat', location.lat);
          params.append('lng', location.lng);
        }

        if (search) {
          // Client side filtering for now or add search to backend
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          // Apply client side search if needed, though backend is better
          let filtered = data;
          if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            filtered = data.filter(v => v.name.toLowerCase().includes(lowerSearch) || v.email.toLowerCase().includes(lowerSearch));
          }
          setVendors(filtered);
        } else {
          showToast('Failed to fetch vendors', 'error');
        }
      } catch (error) {
        console.error("Error fetching vendors", error);
        showToast('Error loading vendors', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [location, search]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-navy-900">Find Repair Shops</h1>
            <p className="text-gray-500 mt-2 font-medium">
              Discover the best repair technicians near you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-navy-100 focus:border-navy-500 transition-all font-medium text-navy-900 placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-[2rem] h-80 shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vendors.map((vendor) => (
              <Link
                key={vendor._id}
                to={`/profile/${vendor._id}`}
                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Banner / Cover */}
                <div className="h-32 bg-navy-900 relative overflow-hidden">
                  {vendor.banner ? (
                    <img src={vendor.banner} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900" />
                  )}

                  {/* Distance Badge */}
                  {typeof vendor.distance === 'number' && vendor.distance !== Infinity && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-navy-900 shadow-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-lime-500" />
                      {vendor.distance.toFixed(1)} km
                    </div>
                  )}
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6 pt-12 relative flex-grow flex flex-col">
                  {/* Avatar */}
                  <div className="absolute -top-10 left-6">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                      <img
                        src={vendor.profileImage || `https://ui-avatars.com/api/?name=${vendor.name}&background=random`}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-xl font-black text-navy-900 group-hover:text-lime-600 transition-colors line-clamp-1">
                      {vendor.name}
                    </h3>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1 text-sm font-bold text-gray-500">
                      <span className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-navy-900">{vendor.rating ? vendor.rating.toFixed(1) : "New"}</span>
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{vendor.numReviews || 0} reviews</span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    {vendor.location?.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {vendor.location.city}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {vendor.specialties?.slice(0, 3).map((spec, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                          {spec}
                        </span>
                      ))}
                      {vendor.specialties?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-lg">
                          +{vendor.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-navy-900">No vendors found</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              We couldn't find any vendors matching your search criteria. Try adjusting your location or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
