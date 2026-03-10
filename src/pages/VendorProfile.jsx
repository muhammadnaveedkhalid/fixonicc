import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Star, MapPin, Mail, MessageCircle, Wrench } from 'lucide-react';

const VendorProfile = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/vendors/${id}`);
        // Fallback to auth/profile if vendor endpoint fails or returns 404 (though it shouldn't for vendors)
        if (!res.ok) {
          const resBackup = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile/${id}`);
          const dataBackup = await resBackup.json();
          if (resBackup.ok) setVendor(dataBackup);
        } else {
          const data = await res.json();
          setVendor(data);
        }
      } catch (error) {
        console.error("Error fetching vendor profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!vendor) return <div className="text-center py-20">Vendor not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Banner */}
      {/* Banner & Avatar Wrapper */}
      <div className="relative mb-20">
        {/* Banner Image Area */}
        <div className="w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden bg-navy-900 shadow-xl relative">
          {vendor.banner ? (
            <img src={vendor.banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-navy-900 to-navy-800">
              <span className="text-white/5 font-black text-6xl uppercase tracking-widest select-none">
                {vendor.name}'s Shop
              </span>
            </div>
          )}
        </div>

        {/* Avatar (Positioned absolutely relative to the wrapper, overlapping banner) */}
        <div className="absolute -bottom-16 left-10 md:left-20">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-2xl overflow-hidden">
            <img
              src={vendor.profileImage || `https://ui-avatars.com/api/?name=${vendor.name}&background=84cc16&color=fff&size=256`}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-navy-900">{vendor.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-500 font-medium">
              {vendor.role === 'vendor' && (
                <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-lg text-xs font-black uppercase tracking-wider">
                  Verified Vendor
                </span>
              )}
              {vendor.location?.city && (
                <span className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" /> {vendor.location.city}
                </span>
              )}
              <span>•</span>
              <span>Joined {new Date(vendor.createdAt).getFullYear()}</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-navy-900 mb-4">About</h3>
            <p className="text-gray-500 leading-relaxed">
              {vendor.bio || "No bio available."}
            </p>
          </div>

          {/* Specialties */}
          {vendor.specialties && vendor.specialties.length > 0 && (
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-navy-900 mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map((spec, index) => (
                  <span key={index} className="px-4 py-2 bg-navy-50 text-navy-700 rounded-xl font-bold text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-navy-100/20">
            <h3 className="text-lg font-black text-navy-900 mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                  <p className="text-navy-900 font-bold">{vendor.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                  <p className="text-navy-900 font-bold">
                    {vendor.rating ? `${vendor.rating.toFixed(1)}/5.0` : "No ratings yet"}
                  </p>
                  {vendor.numReviews > 0 && <p className="text-xs text-gray-400">({vendor.numReviews} reviews)</p>}
                </div>
              </div>

              {vendor.phoneNumber && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                    {/* Mask phone number partially for privacy if needed, or show full */}
                    <p className="text-navy-900 font-bold">{vendor.phoneNumber}</p>
                  </div>
                </div>
              )}

              {vendor.location?.address && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</p>
                    <p className="text-navy-900 font-bold">{vendor.location.address}</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
