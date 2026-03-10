import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContextHooks";
import { Wrench, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await signup(formData);
    if (result.success) {
      // After signup, user must verify via email link
      navigate("/signin");
      return;
    }
    setError(result.message || "Failed to sign up");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-navy-900/10 border border-gray-50">
        <div>
          <div className="flex justify-center">
            <div className="bg-lime-500 p-4 rounded-3xl shadow-xl shadow-lime-500/20">
              <Wrench className="h-10 w-10 text-navy-900" />
            </div>
          </div>
          <h2 className="mt-8 text-center text-4xl font-black text-navy-900 tracking-tight">
            Join the Club
          </h2>
          <p className="mt-3 text-center text-sm text-navy-300 font-bold uppercase tracking-widest">
            Elite Repair Marketplace
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-4 py-4 border border-navy-100 placeholder-navy-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded-2xl bg-navy-50/50 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="block w-full px-4 py-4 border border-navy-100 text-navy-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy-500 bg-navy-50/50 transition-all cursor-pointer"
              >
                <option value="client">Client (Need a Repair)</option>
                <option value="vendor">Vendor (I am a Technician)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 px-4 py-4 border border-navy-100 placeholder-navy-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded-2xl bg-navy-50/50 transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full pl-10 pr-12 px-4 py-4 border border-navy-100 placeholder-navy-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded-2xl bg-navy-50/50 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-navy-900 cursor-pointer transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-navy-900 cursor-pointer transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-navy-900 hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900 transition-all duration-300 shadow-xl shadow-navy-900/20 uppercase tracking-[0.2em]"
            >
              Create Account
            </button>
            <div className="text-center mt-6">
              <Link
                to="/signin"
                className="text-sm font-bold text-navy-300 hover:text-navy-900 transition-colors"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
