import { useState } from "react";
import { useAuth } from "../context/AuthContextHooks";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { Settings, User, Trash2, X, AlertTriangle } from "lucide-react";
import Modal from "../components/Modal";
import ClientDashboard from "./client/ClientDashboard";
import VendorDashboard from "./vendor/VendorDashboard";
import AdminDashboard from "./admin/AdminDashboard";

const Dashboard = () => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const renderDashboard = () => {
    if (user?.role === "vendor" && (user?.status === "pending" || user?.status === "rejected")) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-navy-900/10 text-center max-w-md w-full border border-gray-100 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${user?.status === "rejected" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-amber-500 to-yellow-500"}`}></div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 ${user?.status === "rejected" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-navy-900 mb-3 tracking-tight">
              {user?.status === "rejected" ? "Vendor Request Rejected" : "Pending Approval"}
            </h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              {user?.status === "rejected"
                ? (user?.rejectionReason || "Your vendor application was not approved. Please contact support for details.")
                : "Your vendor account is under review. An admin will approve you soon. You will get access to the dashboard after approval."}
            </p>
            <button
              onClick={() => (window.location.href = "/contact")}
              className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 uppercase tracking-widest text-xs"
            >
              Contact Support
            </button>
          </div>
        </div>
      );
    }
    switch (user?.role) {
      case "client":
        return <ClientDashboard />;
      case "vendor":
        return <VendorDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-navy-900/10 text-center max-w-md w-full border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 relative z-10 transition-transform hover:scale-110 duration-300">
                <AlertTriangle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-navy-900 mb-3 tracking-tight">
                Access Error
              </h2>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                We couldn't detect your account role. This typically happens
                with incomplete profiles.
              </p>
              <button
                onClick={() => (window.location.href = "/contact")}
                className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 uppercase tracking-widest text-xs"
              >
                Contact Support
              </button>
            </div>
          </div>
        );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
    };

    if (user?.role === 'vendor') {
      userData.bio = formData.get("bio");
      userData.banner = formData.get("banner");
      userData.profileImage = formData.get("profileImage");
      const specs = formData.get("specialties");
      if (specs) {
        userData.specialties = specs.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const password = formData.get("password");
    if (password) userData.password = password;

    const result = await updateProfile(userData);
    if (result.success) {
      showToast("Profile updated successfully", "success");
      setShowProfileModal(false);
    } else {
      showToast(result.message || "Failed to update profile", "error");
    }
  };

  const handleDelete = async () => {
    if (
      await confirm(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      const result = await deleteAccount();
      if (result.success) {
        showToast("Account deleted successfully", "success");
      } else {
        showToast(result.message || "Failed to delete account", "error");
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-3">
            Welcome Back, {user?.name}
          </h2>
          <p className="text-gray-500 font-medium">
            Have a productive day at Fixonic.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm hidden md:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2 bg-white text-navy-900 rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all"
            title="Profile Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-navy-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-navy-900/10 hover:bg-navy-800 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {renderDashboard()}

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Profile Settings"
        size="max-w-2xl"
      >
        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  required
                  defaultValue={user?.name}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold text-navy-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                defaultValue={user?.email}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold text-navy-900"
              />
            </div>

            {user?.role === 'vendor' && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Shop Bio
                  </label>
                  <textarea
                    name="bio"
                    defaultValue={user?.bio}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold text-navy-900 resize-none h-24"
                    placeholder="Tell customers about your shop..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Banner Image URL
                  </label>
                  <div className="relative">
                    <input
                      name="banner"
                      defaultValue={user?.banner}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold text-navy-900"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <input
                      name="profileImage"
                      defaultValue={user?.profileImage}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold text-navy-900"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Specialties (comma separated)
                  </label>
                  <input
                    name="specialties"
                    defaultValue={user?.specialties?.join(', ')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold text-navy-900"
                    placeholder="Screen Repair, Battery Application, etc."
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                New Password (Optional)
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold text-navy-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-4 bg-navy-900 text-white rounded-xl font-black shadow-xl shadow-navy-900/20 hover:bg-navy-800 transition-all uppercase tracking-widest text-xs"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-black hover:bg-red-100 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
