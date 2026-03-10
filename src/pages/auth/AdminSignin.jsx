import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContextHooks";
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";

const AdminSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate("/dashboard");
      } else {
        // Force logout if not admin
        logout();
        setError("Access Denied. Admin privileges required.");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-navy-900/50 border border-gray-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

        <div>
          <div className="flex justify-center">
            <div className="bg-indigo-100 p-4 rounded-3xl shadow-xl shadow-indigo-500/20">
              <ShieldCheck className="h-10 w-10 text-indigo-700" />
            </div>
          </div>
          <h2 className="mt-8 text-center text-4xl font-black text-gray-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400 font-bold uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center justify-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-12 px-4 py-4 border border-gray-200 placeholder-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl bg-gray-50/50 transition-all font-bold"
                  placeholder="admin@fixonic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full pl-12 pr-12 px-4 py-4 border border-gray-200 placeholder-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl bg-gray-50/50 transition-all font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm font-bold text-navy-600 hover:text-navy-900">
              Forgot Password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-600/30 uppercase tracking-[0.2em]"
            >
              Access Dashboard
            </button>
            <div className="text-center mt-6">
              <Link
                to="/"
                className="text-xs font-black text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                ← Return to Home
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;
