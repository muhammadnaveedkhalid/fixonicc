import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContextHooks";
import { useToast } from "../../context/ToastContext";
import { ShieldCheck, ArrowRight } from "lucide-react";

const _raw = (import.meta.env.VITE_API_BASE_URL ?? (typeof window !== "undefined" ? `${window.location.origin}/api` : "/api")).replace(/\/$/, "");
const API_BASE = _raw.endsWith("/api") ? _raw : `${_raw}/api`;
const API_URL = `${API_BASE}/auth`;

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { verify } = useAuth();

  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      showToast("Invalid verification session", "error");
      navigate('/signin');
    }
  }, [userId, navigate, showToast]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    const result = await verify(userId, otpValue);
    if (result.success) {
      if (result.status === 'pending') {
        showToast("Verification successful! Account pending admin approval.", "success");
        navigate('/signin'); // Or a dedicated pending page
      } else {
        showToast("Verification successful!", "success");
        navigate('/dashboard');
      }
    } else {
      showToast(result.message || "Verification failed", "error");
    }
  };

  const handleResend = async () => {
    if (!userId) return;
    setResending(true);
    try {
      const res = await fetch(`${API_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Verification code sent again.", "success");
      } else {
        showToast(data.message || "Could not resend code.", "error");
      }
    } catch (err) {
      showToast("Failed to resend. Try again later.", "error");
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-navy-900/10 border border-gray-50 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-lime-100 p-4 rounded-full text-lime-600">
            <ShieldCheck className="w-12 h-12" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-navy-900">Verify Email</h2>
        <p className="text-gray-500 font-medium">
          We sent a 6-digit code to your email. Please enter it below to verify your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 mt-8">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-center text-2xl font-black text-navy-900 border-2 border-gray-200 rounded-xl focus:border-lime-500 focus:outline-none transition-colors"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 flex items-center justify-center gap-2"
          >
            Verify Account <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-sm text-gray-400 font-medium">
            Didn't receive code?{" "}
            <button type="button" onClick={handleResend} disabled={resending} className="text-lime-600 hover:text-lime-700 font-bold disabled:opacity-50">
              {resending ? "Sending…" : "Resend"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
