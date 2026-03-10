import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Laptop,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Upload,
  Search,
  Monitor,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import { useAuth } from "../../context/AuthContextHooks";
import { useData } from "../../context/DataContext";
import { useConfirm } from "../../context/ConfirmContext";
import RepairDetailModal from "../../components/RepairDetailModal";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

const ClientDashboard = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    repairs,
    repairMeta,
    fetchRepairs,
    brands,
    fetchBrands,
    users,
    fetchUsers,
    addRepair,
    updateRepair,
    deleteRepair,
  } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1");

  const setStep = (newStep) => {
    setSearchParams({ step: newStep.toString() });
  };

  const { confirm } = useConfirm();
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [editingRepair, setEditingRepair] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchRepairs({ page: currentPage, search: searchTerm, status: filterStatus });
    fetchUsers();
  }, [fetchRepairs, fetchUsers, currentPage, searchTerm, filterStatus]);

  const requests = repairs || [];

  const [bookingData, setBookingData] = useState({
    device: "",
    brand: "",
    model: "",
    issue: "",
    address: "",
    vendorId: "",
    price: 0,
    image: null,
    media: []
  });

  useEffect(() => {
    if (step > 1 && !bookingData.device) {
      setSearchParams({ step: "1" }, { replace: true });
    }
  }, [step, bookingData.device, setSearchParams]);

  const vendors = (users || []).filter(u => u.role === 'vendor');
  const availableBrands = (brands || []).filter(b => b.type === bookingData.device);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setBookingData(prev => ({
            ...prev,
            media: [...(prev.media || []), { url: data.url, type: data.type }]
          }));
        }
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REP-${Math.floor(Math.random() * 900) + 100}`,
      customer: user?.name,
      customerId: user?._id || user?.id,
      device: bookingData.device,
      brand: bookingData.brand,
      model: bookingData.model,
      issue: bookingData.issue,
      address: bookingData.address,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      vendorId: bookingData.vendorId || null,
      price: Number(bookingData.price) || 0,
      history: ["Pending"],
    };
    addRepair(newReq);
    setStep(1);
    setBookingData({
      device: "",
      brand: "",
      model: "",
      issue: "",
      address: "",
      vendorId: "",
      price: 0,
      image: null,
    });
  };

  const statusColors = {
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Accepted: "bg-navy-50 text-navy-700 border-navy-100",
    "On the Way": "bg-navy-50 text-navy-700 border-navy-100 shadow-sm",
    Ready: "bg-lime-50 text-lime-700 border-lime-100",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className="pb-20">
      {/* Booking Wizard */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-navy-100 overflow-hidden border border-gray-100 relative">
        <div className="bg-navy-900 px-10 py-12 text-center relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
              alt="Repair Background"
              className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
            />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-lime-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]"></div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Book Your Repair
            </h2>
            <p className="text-lg text-gray-400 font-medium">
              Fast, reliable service at your doorstep. Let's get your device
              running like new.
            </p>
          </div>
        </div>

        {/* Floating Steps */}
        <div className="relative -mt-8 px-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 max-w-3xl mx-auto border border-gray-100 flex items-center justify-between relative z-20">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 flex flex-col items-center relative"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 relative z-10 ${step >= s
                    ? "bg-lime-500 text-navy-900 shadow-lg shadow-lime-500/30 scale-110"
                    : "bg-gray-50 text-gray-300"
                    }`}
                >
                  {s}
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest mt-3 transition-colors duration-300 ${step >= s ? "text-navy-900" : "text-gray-300"
                    }`}
                >
                  {s === 1 ? "Device" : s === 2 ? "Details" : "Confirm"}
                </span>

                {/* Progress Bar Line */}
                {s < 3 && (
                  <div className="absolute top-7 left-1/2 w-full h-1 bg-gray-100 -z-0">
                    <div
                      className={`h-full bg-lime-500 transition-all duration-500 ${step > s ? "w-full" : "w-0"}`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-12 max-w-3xl mx-auto">
          <form onSubmit={handleBooking} className="animate-fade-in">
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-lime-500 font-extrabold text-xs uppercase tracking-widest">
                    Step 1
                  </span>
                  <h3 className="text-2xl font-black text-navy-900">
                    What needs fixing?
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {["Mobile", "Laptop", "Desktop"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={async () => {
                        setBookingData({ ...bookingData, device: type });
                        await fetchBrands({ search: type, limit: 100 });
                        setStep(2);
                      }}
                      className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-300 overflow-hidden text-left ${bookingData.device === type
                        ? "border-lime-500 bg-navy-900 shadow-2xl shadow-lime-500/10"
                        : "border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50"
                        }`}
                    >
                      <div
                        className={`absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110 ${bookingData.device === type ? "text-lime-500" : "text-navy-900"}`}
                      >
                        {type === "Mobile" ? (
                          <Smartphone className="w-40 h-40" />
                        ) : (
                          <Laptop className="w-40 h-40" />
                        )}
                      </div>

                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${bookingData.device === type
                          ? "bg-lime-500 text-navy-900"
                          : "bg-white text-navy-900 shadow-md group-hover:scale-110"
                          }`}
                      >
                        {type === "Mobile" ? (
                          <Smartphone className="w-8 h-8" />
                        ) : type === "Laptop" ? (
                          <Laptop className="w-8 h-8" />
                        ) : (
                          <Monitor className="w-8 h-8" />
                        )}
                      </div>

                      <span
                        className={`block font-black text-2xl mb-1 ${bookingData.device === type
                          ? "text-white"
                          : "text-navy-900"
                          }`}
                      >
                        {type}
                      </span>
                      <p
                        className={`text-sm font-medium ${bookingData.device === type
                          ? "text-gray-400"
                          : "text-gray-500"
                          }`}
                      >
                        {type === "Mobile"
                          ? "Screen, Battery, etc."
                          : type === "Laptop"
                            ? "Keyboard, Screen, etc."
                            : "Hardware, Software, etc."}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-lime-500 font-extrabold text-xs uppercase tracking-widest">
                    Step 2
                  </span>
                  <h3 className="text-2xl font-black text-navy-900">
                    Device Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Brand
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-lime-500 focus:shadow-xl focus:shadow-lime-500/10 transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                        value={bookingData.brand}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            brand: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Brand</option>
                        {availableBrands.map((b) => (
                          <option key={b._id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Model
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-lime-500 focus:shadow-xl focus:shadow-lime-500/10 transition-all font-bold text-navy-900 placeholder:text-gray-400"
                      placeholder={
                        bookingData.device === "Mobile"
                          ? "e.g. iPhone 14 Pro"
                          : bookingData.device === "Laptop"
                            ? "e.g. MacBook Pro"
                            : "e.g. Alienware Aurora"
                      }
                      value={bookingData.model}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          model: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-gray-900 hover:-translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    disabled={!bookingData.brand || !bookingData.model}
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-lime-500 font-extrabold text-xs uppercase tracking-widest">
                    Step 3
                  </span>
                  <h3 className="text-2xl font-black text-navy-900">
                    Problem & Contact
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Describe Issue
                    </label>
                    <textarea
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-lime-500 focus:shadow-xl focus:shadow-lime-500/10 transition-all font-bold text-navy-900 placeholder:text-gray-400 h-32 resize-none"
                      placeholder="Screen cracked, Battery draining fast..."
                      value={bookingData.issue}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          issue: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Pickup Address
                    </label>
                    <textarea
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-lime-500 focus:shadow-xl focus:shadow-lime-500/10 transition-all font-bold text-navy-900 placeholder:text-gray-400 h-24 resize-none"
                      placeholder="Complete address for pickup..."
                      value={bookingData.address}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          address: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Prefer Vendor (Optional)
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-lime-500 focus:shadow-xl focus:shadow-lime-500/10 transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                        value={bookingData.vendorId}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            vendorId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Upload Issues (Photos/Videos)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {bookingData.media?.map((m, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                          {m.type === 'video' ? (
                            <video
                              src={m.url.startsWith('http') ? m.url : `${new URL(import.meta.env.VITE_API_BASE_URL).origin}${m.url}`}
                              className="w-full h-full object-cover"
                              controls
                            />
                          ) : (
                            <img
                              src={m.url.startsWith('http') ? m.url : `${new URL(import.meta.env.VITE_API_BASE_URL).origin}${m.url}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const newMedia = bookingData.media.filter((_, idx) => idx !== i);
                              setBookingData({ ...bookingData, media: newMedia });
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <label className="border-2 border-dashed border-gray-200 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-lime-500 hover:bg-lime-50/10 transition-all">
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                        />
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-xs font-bold text-gray-400">Upload</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-gray-900 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                  >
                    Confirm Booking <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Tracking Section */}
      <div className="space-y-8 mt-12">
        <div className="space-y-4 px-4 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-navy-900">
                My Repairs
              </h2>
              <p className="text-gray-500 font-medium">
                Manage and track all your service requests
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, Device, Model..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-navy-900 placeholder:text-gray-400 focus:ring-2 focus:ring-lime-500 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {["All", "Pending", "On the Way", "Completed", "Rejected"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                    }}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all ${filterStatus === status
                      ? "bg-navy-900 text-white"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                      }`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <Table
          data={requests}
          pagination={{
            page: repairMeta.page,
            pages: repairMeta.pages,
            total: repairMeta.total,
            onPageChange: (newPage) => setCurrentPage(newPage)
          }}
          emptyState={
            <div className="text-center py-16 bg-gray-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                <Monitor className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-navy-900 mb-1">No Active Repairs</h3>
              <p className="text-gray-400 text-sm font-medium">Any new repair requests will appear here.</p>
            </div>
          }
          columns={[
            {
              header: "Device",
              render: (req) => {
                const deviceStyles = {
                  Mobile: "bg-rose-50 text-rose-600 border-rose-100",
                  Laptop: "bg-blue-50 text-blue-600 border-blue-100",
                  Desktop: "bg-indigo-50 text-indigo-600 border-indigo-100",
                };
                const style = deviceStyles[req.device] || "bg-gray-50 text-gray-600 border-gray-100";

                return (
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 ${style}`}>
                      {req.device === "Mobile" ? (
                        <Smartphone className="w-6 h-6" />
                      ) : req.device === "Laptop" ? (
                        <Laptop className="w-6 h-6" />
                      ) : (
                        <Monitor className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-navy-900">
                        {req.brand} {req.model}
                      </div>
                      <div className="text-xs text-gray-400 font-medium tracking-wide">
                        #{req.id}
                      </div>
                    </div>
                  </div>
                );
              },
            },
            {
              header: "Issue",
              render: (req) => (
                <div className="max-w-[200px] truncate font-medium text-gray-600" title={req.issue}>
                  {req.issue}
                </div>
              )
            },
            {
              header: "Price",
              render: (req) => (
                <div className="font-black text-navy-900">
                  {req.price || 0} PKR
                </div>
              )
            },
            {
              header: "Status",
              render: (req) => (
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusColors[req.status]}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {req.status}
                </span>
              )
            },
            {
              header: "Date",
              accessor: "date",
              className: "text-sm font-bold text-gray-600"
            },
            {
              header: "Actions",
              headerClassName: "text-right",
              className: "text-right",
              render: (req) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedRepair(req); }}
                    className="p-2 text-gray-300 hover:text-navy-900 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {req.status === 'Pending' && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingRepair(req); }}
                        className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (await confirm("Delete Repair?", "Are you sure you want to delete this repair request?")) {
                            deleteRepair(req.id);
                          }
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )
            }
          ]}
        />
      </div>

      {/* Repair Detail Modal */}
      <RepairDetailModal
        repair={selectedRepair}
        onClose={() => setSelectedRepair(null)}
      />

      {/* Edit Repair Modal */}
      {editingRepair && (
        <Modal
          isOpen={!!editingRepair}
          onClose={() => setEditingRepair(null)}
          title="Edit Repair Request"
          size="max-w-2xl"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const updateData = {
                issue: e.target.issue.value,
                address: e.target.address.value,
                model: e.target.model.value
              };
              const res = await updateRepair(editingRepair.id, updateData);
              // updateRepair provided by DataProvider usually returns {success: true} or updates list
              setEditingRepair(null);
            }}
            className="p-8 space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Device Model</label>
                <input name="model" defaultValue={editingRepair.model} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-navy-900" required />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Issue Description</label>
                <textarea name="issue" defaultValue={editingRepair.issue} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-navy-900 resize-none h-32" required />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pickup Address</label>
                <textarea name="address" defaultValue={editingRepair.address} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-navy-900 resize-none h-24" required />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-navy-900 text-white rounded-xl font-black shadow-xl shadow-navy-900/20 hover:bg-navy-800 transition-all uppercase tracking-widest text-xs"
            >
              Save Changes
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ClientDashboard;
