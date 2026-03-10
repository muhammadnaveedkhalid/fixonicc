import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContextHooks";
import { useData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import {
  Wrench,
  LogOut,
  LayoutDashboard,
  BarChart,
  Bell,
  Menu as MenuIcon,
  X as CloseIcon,
  ShoppingCart,
  ChevronDown,
  User,
} from "lucide-react";

const NavLinks = ({ setIsMobileMenuOpen, user }) => {
  const location = useLocation();

  const getLinkClasses = (path, showBorder = true) => {
    const isActive = location.pathname === path;
    const borderClasses = showBorder
      ? `border-b-2 pb-1 ${isActive ? "border-lime-500" : "border-transparent"}`
      : "";
    return `text-sm font-bold transition-colors ${borderClasses} ${isActive
      ? "text-white"
      : "text-white/70 hover:text-white"
      }`;
  };

  const isRestricted = user?.role === 'admin' || user?.role === 'vendor';

  return (
    <>
      <Link
        to="/"
        onClick={() => setIsMobileMenuOpen(false)}
        className={getLinkClasses("/")}
      >
        Home
      </Link>
      {!isRestricted && (
        <>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClasses("/about")}
          >
            About
          </Link>
          <Link
            to="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClasses("/services")}
          >
            Services
          </Link>
          <Link
            to="/journals"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClasses("/journals")}
          >
            Journals
          </Link>
          <Link
            to="/accessories"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClasses("/accessories")}
          >
            Accessories
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClasses("/contact")}
          >
            Contact
          </Link>
        </>
      )}
      {user?.role === "client" && (
        <div className="relative group h-full flex items-center">
          <button className="flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors">
            Dashboard <ChevronDown className="w-4 h-4" />
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 hidden group-hover:block">
            <div className="bg-navy-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col p-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <Wrench className="w-4 h-4 text-lime-500" /> Book Repair
              </Link>
              <Link
                to="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-lime-500" /> My Orders
              </Link>
              <Link
                to={`/profile/${user._id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <User className="w-4 h-4 text-lime-500" /> My Profile
              </Link>
            </div>
          </div>
        </div>
      )}
      {user?.role === "vendor" && user?.status !== "pending" && user?.status !== "rejected" && (
        <Link
          to="/dashboard"
          onClick={() => setIsMobileMenuOpen(false)}
          className={getLinkClasses("/dashboard", false) + " flex items-center gap-2"}
        >
          <LayoutDashboard className="w-4 h-4 text-lime-500" /> Dashboard
        </Link>
      )}
      {user?.role === "admin" && (
        <Link
          to="/dashboard"
          onClick={() => setIsMobileMenuOpen(false)}
          className={getLinkClasses("/dashboard", false) + " flex items-center gap-2"}
        >
          <BarChart className="w-4 h-4 text-lime-500" /> Admin
        </Link>
      )}
      {user && user.role !== "client" && (
        <Link
          to={`/profile/${user._id}`}
          onClick={() => setIsMobileMenuOpen(false)}
          className={getLinkClasses(`/profile/${user._id}`)}
        >
          My Profile
        </Link>
      )}
    </>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { fetchContent } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationTab, setNotificationTab] = useState("All");
  const [siteName, setSiteName] = useState('Fixonic');

  useEffect(() => {
    const loadSiteName = async () => {
      const data = await fetchContent('settings');
      if (data && data['settings-site-name']) {
        setSiteName(data['settings-site-name']);
      }
    };
    loadSiteName();
  }, [fetchContent]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="bg-navy-900/80 backdrop-blur-xl border-b border-white/5 fixed w-full z-50 top-0 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-2xl font-black tracking-tighter"
            >
              <div className="bg-gradient-to-br from-lime-400 to-lime-600 p-1.5 rounded-xl mr-2.5 shadow-lg shadow-lime-500/20">
                <Wrench className="w-6 h-6 text-navy-900" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                {siteName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center space-x-8 border-r pr-8 border-white/10">
              <NavLinks setIsMobileMenuOpen={setIsMobileMenuOpen} user={user} />
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="bg-white/5 p-2 rounded-xl text-white/50 hover:text-lime-500 cursor-pointer transition-colors relative group"
                  >
                    <Bell className="w-5 h-5" />
                    {/* <span className="absolute top-2 right-2 w-2 h-2 bg-lime-500 rounded-full border-2 border-navy-900"></span> */}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-14 right-0 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-slide-up origin-top-right">
                      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-navy-900">
                        <h3 className="font-black text-white text-lg">
                          Notifications
                        </h3>
                        <div className="bg-lime-500 text-navy-900 text-[10px] font-black px-2 py-1 rounded-lg">
                          0 NEW
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="flex p-1 bg-gray-50 m-4 rounded-xl">
                        {["All", "Read", "Unread"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setNotificationTab(tab)}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${notificationTab === tab
                              ? "bg-white shadow-sm text-navy-900"
                              : "text-gray-400 hover:text-gray-600"
                              }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                          <Bell className="w-8 h-8" />
                        </div>
                        <h4 className="text-navy-900 font-bold mb-1">
                          No notifications
                        </h4>
                        <p className="text-gray-400 text-sm">
                          You're all caught up! Check back later for updates.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 bg-white/5 pl-4 pr-1.5 py-1.5 rounded-2xl border border-white/10 group hover:border-lime-500/30 transition-all">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest leading-none mb-1">
                      {user.role}
                    </span>
                    <span className="text-sm font-bold text-white leading-none">
                      {user.name}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-lime-600 text-navy-900 flex items-center justify-center font-black text-sm shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-1 p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/signin"
                  className="px-6 py-3 text-sm font-bold text-white border border-white/20 rounded-2xl hover:bg-white/5 hover:border-lime-500 hover:text-lime-500 transition-all uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 text-sm font-extrabold text-navy-900 bg-lime-500 rounded-2xl hover:bg-lime-400 transition-all shadow-lg shadow-lime-500/20 uppercase tracking-wider"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <div className="bg-white/5 p-2 rounded-xl text-white/50 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-lime-500 rounded-full border-2 border-navy-900"></span>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 text-white/70 hover:text-lime-500 hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`
        md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out
        ${isMobileMenuOpen
            ? "max-h-[500px] border-b border-white/10"
            : "max-h-0"
          }
      `}
      >
        <div className="bg-navy-900/95 backdrop-blur-2xl px-6 py-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col gap-5">
            <NavLinks setIsMobileMenuOpen={setIsMobileMenuOpen} user={user} />
            {!user && (
              <div className="pt-4 flex flex-col gap-4 border-t border-white/5">
                <Link
                  to="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold text-white/70 hover:text-white py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center text-sm font-extrabold text-navy-900 bg-lime-500 rounded-2xl hover:bg-lime-400 transition-all uppercase tracking-wider"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {user && (
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-500 text-navy-900 flex items-center justify-center font-black">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">
                    {user.name}
                  </p>
                  <p className="text-lime-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
