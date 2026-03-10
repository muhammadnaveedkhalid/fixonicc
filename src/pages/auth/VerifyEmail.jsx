import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { ShieldCheck } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  const rawBase = (import.meta.env.VITE_API_BASE_URL ?? (typeof window !== "undefined" ? `${window.location.origin}/api` : "/api")).replace(/\/$/, "");
  const apiBase = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${apiBase}/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
          if (data.token) {
            const user = {
              _id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              status: data.status,
              token: data.token,
            };
            localStorage.setItem("user", JSON.stringify(user));
            showToast("Email verified! Welcome.", "success");
            window.location.href = "/dashboard";
            return;
          }
          if (data.status === "pending") {
            showToast("Email verified. Account pending admin approval.", "success");
          }
          setTimeout(() => navigate("/signin", { replace: true }), 2000);
        } else {
          setStatus("error");
          setMessage("Verification link is invalid or has expired. Please request a new one.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Unable to contact server. Please try again in a moment.");
      }
    };

    verify();
  }, [token, apiBase, navigate, showToast]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24 pb-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex justify-center mb-6">
            <div className="bg-lime-100 p-4 rounded-full text-lime-600 animate-pulse">
              <ShieldCheck className="w-12 h-12" />
            </div>
          </div>
          <p className="text-navy-900 font-bold">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24 pb-12 px-4">
        <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 text-center">
          <div className="bg-red-100 p-4 rounded-full inline-flex text-red-600">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-navy-900">Verification failed</h2>
          <p className="text-gray-600">{message}</p>
          <button
            onClick={() => navigate("/signin", { replace: true })}
            className="w-full py-4 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-navy-800"
          >
            Go to Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-24 pb-12 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 text-center">
        <div className="bg-lime-100 p-4 rounded-full inline-flex text-lime-600">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-navy-900">Email verified</h2>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-500">Redirecting you to sign in...</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
