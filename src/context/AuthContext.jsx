import { useState } from "react";
import { AuthContext } from "./AuthContextHooks";
import { useToast } from "./ToastContext";
export { useAuth } from "./AuthContextHooks";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });
  const [loading] = useState(false);
  const { showToast } = useToast();

  // API URL – base must end with /api (backend routes are /api/auth/...). Auto-append /api if missing.
  const rawBase = (import.meta.env.VITE_API_BASE_URL ?? (typeof window !== "undefined" ? `${window.location.origin}/api` : "/api")).replace(/\/$/, "");
  const API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;
  const API_URL = `${API_BASE}/auth`;

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        showToast(`Welcome back, ${data.name || 'User'}!`, 'success');
        return { success: true, user: data };
      } else {
        const errorMessage = data.message || "Login failed";
        showToast(errorMessage, 'error');
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Server error. Please try again later.";
      showToast(errorMessage, 'error');
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const verify = async (userId, otp) => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, emailOtp: otp }) // Using emailOtp mainly for now
      });
      const data = await response.json();

      if (response.ok && data.token) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return { success: true, status: data.status };
      } else if (response.ok) {
        return { success: true, status: 'pending' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message || 'Please check your email to verify your account.', 'success');
        return {
          success: true,
          message: data.message,
        };
      } else {
        const errorMessage = data.message || "Registration failed";
        showToast(errorMessage, 'error');
        return {
          success: false,
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Server error. Please try again later.";
      showToast(errorMessage, 'error');
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Preserver the token from the existing user object
        const updatedUser = { ...data, token: user.token };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, message: data.message || "Update failed" };
      }
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: error.message || "Server error" };
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        logout();
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, message: data.message || "Delete failed" };
      }
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, message: error.message || "Server error" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        verify, // New
        logout,
        loading,
        updateProfile,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
