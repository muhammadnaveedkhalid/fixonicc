import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Mail, MessageCircle, User, Calendar, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContextHooks';

const UserProfile = () => {
  // Can be current user or viewed user
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const targetId = id || currentUser?._id;
        if (!targetId) return;

        // Determine endpoint based on if viewing self or other
        let url = `${import.meta.env.VITE_API_BASE_URL}/auth/profile/${targetId}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  if (loading) return <div className="text-center py-32 text-gray-500 font-medium">Loading profile...</div>;
  if (!profile) return <div className="text-center py-32 text-gray-500 font-medium">Profile not found</div>;

  const isVendor = profile.role === 'vendor';
  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Banner Area */}
      <div className="relative mb-24">
        <div className="w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden bg-navy-900 shadow-xl relative">
          {profile.banner ? (
            <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
              <div className="text-white/5 font-black text-9xl uppercase tracking-tighter select-none rotate-12 transform scale-150">
                {profile.role}
              </div>
            </div>
          )}
          {/* Edit Button for own profile */}
          {isOwnProfile && (
            <Link to="/dashboard" className="absolute top-6 right-6 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Edit Profile
            </Link>
          )}
        </div>

        {/* Profile Image - Overlapping Banner */}
        <div className="absolute -bottom-16 left-8 md:left-16">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] border-4 border-white bg-white shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-4xl font-black ${isVendor ? 'bg-lime-500 text-navy-900' : 'bg-navy-100 text-navy-900'}`}>
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight mb-2">{profile.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium text-sm">
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${isVendor ? 'bg-lime-100 text-lime-700' : 'bg-blue-100 text-blue-700'}`}>
                {isVendor ? 'Tech Expert' : 'Client'}
              </span>
              {profile.location?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {profile.location.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Joined {new Date(profile.createdAt).getFullYear()}
              </span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-xl font-black text-navy-900 mb-6 relative z-10">About</h3>
            <p className="text-gray-500 leading-relaxed relative z-10 text-lg">
              {profile.bio || "No bio yet."}
            </p>
          </div>

          {/* User Stats / Badges (Gamification placeholder) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-navy-900 p-6 rounded-[2rem] text-white">
              <User className="w-6 h-6 text-lime-400 mb-4" />
              <p className="text-3xl font-black">{isVendor ? profile.numReviews || 0 : '0'}</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{isVendor ? 'Reviews' : 'Orders'}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <Star className="w-6 h-6 text-yellow-500 mb-4" />
              <p className="text-3xl font-black text-navy-900">{profile.rating ? profile.rating.toFixed(1) : 'NR'}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</p>
            </div>
            {/* Add more stats as needed */}
          </div>
        </div>

        {/* Right Column: Contact & Details */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-navy-100/20">
            <h3 className="text-lg font-black text-navy-900 mb-8">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-lime-100 group-hover:text-lime-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-navy-900 font-bold break-all">{profile.email}</p>
                </div>
              </div>

              {(profile.phoneNumber || isOwnProfile) && (
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-lime-100 group-hover:text-lime-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-navy-900 font-bold">{profile.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              )}

              {profile.location?.address && (
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-lime-100 group-hover:text-lime-600 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-navy-900 font-bold">{profile.location.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isVendor && profile.specialties && (
            <div className="bg-navy-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Award className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-black mb-6 relative z-10">Expertise</h3>
              <div className="flex flex-wrap gap-2 relative z-10">
                {profile.specialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-xl text-xs font-bold hover:bg-lime-500 hover:text-navy-900 hover:border-lime-500 transition-all cursor-default">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
