import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to reset password page with email in state
        navigate("/reset-password", { state: { email } });
      } else {
        setError(data.message || "Failed to verify email");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Enter your email to verify your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-center text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

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
                className="appearance-none block w-full pl-10 px-4 py-4 border border-navy-100 placeholder-navy-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded-2xl bg-navy-50/50 transition-all font-bold"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-navy-900 bg-lime-500 hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 shadow-xl shadow-lime-500/20 transition-all uppercase tracking-widest disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <div className="text-center">
            <Link to="/signin" className="font-bold text-navy-900 hover:text-lime-600 transition-colors text-sm">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
