import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataProvider";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Signin from "./pages/auth/Signin";
import AdminSignin from "./pages/auth/AdminSignin";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import VerifyEmail from "./pages/auth/VerifyEmail";
import UserProfile from "./pages/UserProfile"; // New
import Dashboard from "./pages/Dashboard";
import Accessories from "./pages/Accessories";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import OrderDetails from "./pages/OrderDetails";
import MyOrders from "./pages/client/MyOrders";
import LandingPage from "./pages/landing/LandingPage";
import Vendors from "./pages/Vendors"; // Import
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Journals from "./pages/Journals";
import JournalDetail from "./pages/JournalDetail";
import Privacy from "./pages/Privacy";
import VendorHistory from "./pages/vendor/VendorHistory";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorProfile from "./pages/VendorProfile";

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <DataProvider>
          <CartProvider>
            <AuthProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/vendors" element={<Vendors />} />
                      <Route path="/accessories" element={<Accessories />} />
                      <Route path="/cart" element={<Cart />} /> {/* New */}
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/journals" element={<Journals />} />
                      <Route path="/journals/:id" element={<JournalDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy" element={<Privacy />} />

                      {/* Public Only Routes (Login/Register) */}
                      <Route element={<PublicRoute />}>
                        <Route path="/signin" element={<Signin />} />
                        <Route path="/admin/login" element={<AdminSignin />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                      </Route>

                      {/* Public Profile Route - works for vendors and users */}
                      <Route path="/profile/:id" element={<UserProfile />} />

                      {/* Client/Protected Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/shipping" element={<Shipping />} /> {/* New */}
                        <Route path="/order/:id" element={<OrderDetails />} /> {/* New */}
                        <Route path="/my-orders" element={<MyOrders />} /> {/* New */}
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
                        <Route path="/vendor/history" element={<VendorHistory />} />
                        <Route path="/vendor/analytics" element={<VendorAnalytics />} />
                      </Route>

                      {/* Unauthorized Page */}
                      <Route
                        path="/unauthorized"
                        element={
                          <div className="flex flex-col items-center justify-center min-h-[80vh]">
                            <h1 className="text-8xl font-black text-navy-500">
                              403
                            </h1>
                            <h2 className="text-3xl font-black text-navy-900 mt-4">
                              Access Denied
                            </h2>
                            <p className="text-navy-300 mt-2 font-medium">
                              You don't have permission to visit this page.
                            </p>
                            <button
                              onClick={() => (window.location.href = "/")}
                              className="mt-10 px-10 py-4 bg-navy-500 text-white font-black rounded-2xl shadow-2xl shadow-navy-900/10 hover:bg-navy-600 transition-all uppercase tracking-widest text-sm"
                            >
                              Back to Home
                            </button>
                          </div>
                        }
                      />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ChatWidget />
                </div>
              </Router>
            </AuthProvider>
          </CartProvider>
        </DataProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
