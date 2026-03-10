import { useState, useCallback } from "react";
import {
  INITIAL_BLOGS,
  INITIAL_REVIEWS,
  DUMMY_REPAIRS,
} from "../data/mockData";
import { DataContext } from "./DataContext";

const _raw = (import.meta.env.VITE_API_BASE_URL ?? (typeof window !== "undefined" ? `${window.location.origin}/api` : "/api")).replace(/\/$/, "");
const API_URL = _raw.endsWith("/api") ? _raw : `${_raw}/api`;

const getToken = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).token : null;
};

export const DataProvider = ({ children }) => {
  // Blog CRUD
  const [blogs, setBlogs] = useState([]);
  const [blogMeta, setBlogMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const fetchBlogs = useCallback(async (params = {}) => {
    const { page = 1, limit = 5, search = "" } = params;
    setLoadingBlogs(true);
    try {
      const query = new URLSearchParams({ page, limit, search }).toString();
      const response = await fetch(`${API_URL}/blogs?${query}`);
      const data = await response.json();
      if (response.ok) {
        setBlogs(data.blogs);
        setBlogMeta({ page: data.page, pages: data.pages, total: data.total });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  }, []);

  const addBlog = async (blogData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();
      if (response.ok) {
        setBlogs([data, ...blogs]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      return { success: false, message: error.message };
    }
  };

  const updateBlogData = async (updatedBlog) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/blogs/${updatedBlog._id || updatedBlog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBlog),
      });

      const data = await response.json();
      if (response.ok) {
        setBlogs(blogs.map((b) => ((b._id || b.id) === (data._id || data.id) ? data : b)));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteBlog = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBlogs(blogs.filter((b) => (b._id || b.id) !== id));
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      return { success: false, message: error.message };
    }
  };

  // Review Moderation
  // Review Moderation
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loadingReviews, setLoadingReviews] = useState(true);

  const fetchReviews = useCallback(async (params = {}) => {
    const { page = 1, limit = 5, search = "" } = params;
    setLoadingReviews(true);
    try {
      const query = new URLSearchParams({ page, limit, search }).toString();
      const response = await fetch(`${API_URL}/reviews?${query}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews);
        setReviewMeta({ page: data.page, pages: data.pages, total: data.total });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  const addReview = async (reviewData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });
      const data = await response.json();
      if (response.ok) {
        setReviews([...reviews, data]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error adding review:", error);
      return { success: false, message: error.message };
    }
  };

  const updateReview = async (updatedReview) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/reviews/${updatedReview._id || updatedReview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReview),
      });
      const data = await response.json();
      if (response.ok) {
        setReviews(reviews.map((r) => ((r._id || r.id) === (data._id || data.id) ? data : r)));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating review:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteReview = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => (r._id || r.id) !== id));
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      return { success: false, message: error.message };
    }
  };

  // User Management
  const [users, setUsers] = useState([]);
  const [userMeta, setUserMeta] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = useCallback(async (params = {}) => {
    const { page = 1, limit = 5, search = "", role = "" } = params;
    try {
      const token = getToken();
      if (!token) return;

      const queryParams = { page, limit, search };
      if (role) queryParams.role = role;

      const query = new URLSearchParams(queryParams).toString();
      const response = await fetch(`${API_URL}/auth/users?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
        setUserMeta({ page: data.page, pages: data.pages, total: data.total });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const updateUser = async (updatedUser) => {
    try {
      const token = getToken();
      if (!token) return { success: false, message: 'Please sign in again.' };
      const response = await fetch(`${API_URL}/auth/users/${updatedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u._id === data._id ? { ...u, ...data } : u)));
        return { success: true };
      }
      return { success: false, message: data.message || `Update failed (${response.status})` };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, message: error.message || 'Network error' };
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((u) => u._id !== id));
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: error.message };
    }
  };

  const approveVendor = async (id) => {
    try {
      const token = getToken();
      if (!token) return { success: false, message: 'Please sign in again.' };
      const response = await fetch(`${API_URL}/auth/users/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u._id === data._id ? { ...u, ...data } : u)));
        return { success: true };
      }
      return { success: false, message: data.message || `Approve failed (${response.status})` };
    } catch (error) {
      console.error('Error approving vendor:', error);
      return { success: false, message: error.message || 'Network error' };
    }
  };

  const rejectVendor = async (id, rejectionReason) => {
    try {
      const token = getToken();
      if (!token) return { success: false, message: 'Please sign in again.' };
      const response = await fetch(`${API_URL}/auth/users/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason: rejectionReason || '' }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u._id === data._id ? { ...u, ...data } : u)));
        return { success: true };
      }
      return { success: false, message: data.message || `Reject failed (${response.status})` };
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      return { success: false, message: error.message || 'Network error' };
    }
  };

  // Contact Management
  const [contacts, setContacts] = useState([]);
  const [contactMeta, setContactMeta] = useState({ page: 1, pages: 1, total: 0 });

  const fetchContacts = useCallback(async (params = {}) => {
    const { page = 1, limit = 5, search = "" } = params;
    try {
      const token = getToken();
      if (!token) return;

      const query = new URLSearchParams({ page, limit, search }).toString();
      const response = await fetch(`${API_URL}/contact?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setContacts(data.contacts);
        setContactMeta({ page: data.page, pages: data.pages, total: data.total });
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, []);

  const submitContact = async (contactData) => {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteContactMessage = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setContacts(contacts.filter((c) => c._id !== id));
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      return { success: false, message: error.message };
    }
  };

  // Repair Management
  // Content Management
  const fetchContent = useCallback(async (pageName) => {
    try {
      const response = await fetch(`${API_URL}/content/${pageName}`);
      const data = await response.json();
      if (response.ok) {
        return data.sections || {};
      }
      return {};
    } catch (error) {
      console.error("Error fetching content:", error);
      return {};
    }
  }, []);

  const updateContent = async (pageName, sections) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/content/${pageName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sections }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating content:", error);
      return { success: false, message: error.message };
    }
  };

  // Repair Management
  const [repairs, setRepairs] = useState([]);
  const [repairMeta, setRepairMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loadingRepairs, setLoadingRepairs] = useState(true);

  const fetchRepairs = useCallback(async (params = {}) => {
    const { page = 1, limit = 5, search = "", status = "All" } = params;
    setLoadingRepairs(true);
    try {
      const token = getToken();
      if (!token) return;
      const query = new URLSearchParams({ page, limit, search, status }).toString();
      const response = await fetch(`${API_URL}/repairs?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRepairs(data.repairs);
        setRepairMeta({ page: data.page, pages: data.pages, total: data.total });
      }
    } catch (error) {
      console.error("Error fetching repairs:", error);
    } finally {
      setLoadingRepairs(false);
    }
  }, []);

  const addRepair = async (repairData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/repairs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(repairData),
      });

      const data = await response.json();
      if (response.ok) {
        setRepairs([data, ...repairs]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error adding repair:", error);
      return { success: false, message: error.message };
    }
  };

  const updateRepair = async (id, updates) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/repairs/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (response.ok) {
        setRepairs(
          repairs.map((r) => (r.id === id ? data : r))
        );
        return { success: true };
      }
    } catch (error) {
      console.error("Error updating repair:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteRepair = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/repairs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRepairs(repairs.filter((r) => r.id !== id));
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting repair:", error);
      return { success: false, message: error.message };
    }
  };

  // Stats Management
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulRepairs: 0,
    totalUsers: 0,
    totalVendors: 0,
    clientCount: 0,
    vendorCount: 0,
    adminCount: 0,
    monthlyData: []
  });

  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await fetch(`${API_URL}/repairs/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Brands Management
  const [brands, setBrands] = useState([]);
  const [brandMeta, setBrandMeta] = useState({ page: 1, pages: 1, total: 0 });

  const fetchBrands = useCallback(async (params = {}) => {
    const { page = 1, limit = 5, search = "" } = params;
    try {
      const query = new URLSearchParams({ page, limit, search }).toString();
      const response = await fetch(`${API_URL}/brands?${query}`);
      const data = await response.json();
      if (response.ok) {
        setBrands(data.brands);
        setBrandMeta({ page: data.page, pages: data.pages, total: data.total });
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  const addBrand = async (brandData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/brands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandData),
      });

      const data = await response.json();
      if (response.ok) {
        setBrands([...brands, data]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error adding brand:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteBrand = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBrands(brands.filter((b) => b._id !== id));
        return { success: true };
      } else {
        return { success: false, message: "Failed to delete" };
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <DataContext.Provider
      value={{
        blogs,
        blogMeta,
        loadingBlogs,
        fetchBlogs,
        addBlog,
        updateBlog: updateBlogData,
        deleteBlog,
        reviews,
        reviewMeta,
        loadingReviews,
        fetchReviews,
        addReview,
        updateReview,
        deleteReview,
        users,
        userMeta,
        updateUser,
        deleteUser,
        approveVendor,
        rejectVendor,
        fetchUsers,
        repairs,
        repairMeta,
        loadingRepairs,
        fetchRepairs,
        addRepair,
        updateRepair,
        deleteRepair,
        brands,
        brandMeta,
        fetchBrands,
        addBrand,
        deleteBrand,
        contacts,
        contactMeta,
        fetchContacts,
        submitContact,
        deleteContactMessage,
        fetchContent,
        updateContent2: updateContent,
        stats,
        fetchStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
