import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle2, Smartphone, Laptop, Monitor, MapPin, Search, Eye, Edit, Trash2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContextHooks';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import RepairDetailModal from '../../components/RepairDetailModal';

const VendorDashboard = () => {
    const { repairs, repairMeta, fetchRepairs, updateRepair, deleteRepair, loadingRepairs } = useData();
    const { user } = useAuth();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPrice, setEditingPrice] = useState("");
    const [editingProof, setEditingProof] = useState("");

    useEffect(() => {
        fetchRepairs({ page: currentPage, search: searchTerm, status: filterStatus });
    }, [fetchRepairs, currentPage, searchTerm, filterStatus]);

    const handleUpdate = async (id, status, price, proofImage) => {
        const updateData = { status, price: Number(price) };
        if (proofImage) updateData.proofImage = proofImage;

        const res = await updateRepair(id, updateData); // Ensure updateRepair handles extra fields or just arg object
        // Wait, context updateRepair might be (id, data) or (id, status, price). Check Context.
        // Assuming (id, data) based on context usage in other files or standard practice.
        // Checking existing handleUpdate: handleUpdate(id, status, price) -> updateRepair(id, {status, price})

        if (res.success) {
            showToast('Repair updated successfully!', 'success');
            setShowEditModal(false);
            setSelectedRepair(null);
            setEditingProof("");
        } else {
            showToast(res.message || 'Failed to update repair', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (await confirm('Delete Repair', 'Are you sure you want to delete this repair permanent?')) {
            const res = await deleteRepair(id);
            if (res.success) {
                showToast('Repair deleted successfully!', 'success');
                fetchRepairs({ page: currentPage, search: searchTerm, status: filterStatus });
            } else {
                showToast(res.message || 'Failed to delete repair', 'error');
            }
        }
    };

    const stats = [
        { label: 'Pending Requests', value: repairMeta.total && filterStatus === 'Pending' ? repairMeta.total : '...', icon: <Briefcase className="w-8 h-8" />, color: 'bg-lime-500', text: 'text-navy-900' },
        { label: 'Active Repairs', value: repairMeta.total && filterStatus === 'On the Way' ? repairMeta.total : '...', icon: <Clock className="w-8 h-8" />, color: 'bg-navy-900', text: 'text-lime-400' },
        { label: 'Completed Jobs', value: repairMeta.total && filterStatus === 'Completed' ? repairMeta.total : '...', icon: <CheckCircle2 className="w-8 h-8" />, color: 'bg-white', text: 'text-navy-900' },
    ];

    const statusColors = {
        Pending: "bg-amber-50 text-amber-700 border-amber-100",
        Accepted: "bg-navy-50 text-navy-700 border-navy-100",
        "On the Way": "bg-navy-50 text-navy-700 border-navy-100 shadow-sm",
        Ready: "bg-lime-50 text-lime-700 border-lime-100",
        Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
        Rejected: "bg-red-50 text-red-700 border-red-100",
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Premium Header */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-navy-100 overflow-hidden border border-gray-100 relative">
                <div className="bg-navy-900 px-10 py-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-lime-500/20 rounded-full blur-[100px] animate-pulse"></div>
                    </div>

                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">Vendor Portal</h2>
                        <p className="text-gray-400 font-medium text-lg mb-6">Manage your repair queue and track performance.</p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Link to="/vendor/history" className="px-6 py-3 bg-white/10 text-white hover:bg-white hover:text-navy-900 rounded-xl font-bold transition-all text-sm uppercase tracking-widest backdrop-blur-sm">
                                View History
                            </Link>
                            <Link to="/vendor/analytics" className="px-6 py-3 bg-lime-500 text-navy-900 hover:bg-lime-400 rounded-xl font-bold transition-all text-sm uppercase tracking-widest shadow-lg shadow-lime-500/20">
                                Analytics
                            </Link>
                            {user && (
                                <Link to={`/profile/${user._id}`} className="px-6 py-3 bg-white/10 text-white hover:bg-white hover:text-navy-900 rounded-xl font-bold transition-all text-sm uppercase tracking-widest backdrop-blur-sm">
                                    View Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Customer, Device..."
                            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-all font-bold text-navy-900"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex items-center bg-white p-2 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-x-auto">
                        {['All', 'Pending', 'On the Way', 'Completed', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilterStatus(status);
                                    setCurrentPage(1);
                                }}
                                className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status ? 'bg-navy-900 text-white shadow-lg' : 'text-gray-400 hover:text-navy-900 hover:bg-gray-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {!loadingRepairs && repairs.length === 0 && (
                    <div className="rounded-2xl border border-gray-100 bg-amber-50/50 p-6 text-center text-sm text-amber-800 font-medium">
                        No repair requests yet. When the backend API is connected, repairs assigned to you will appear here.
                    </div>
                )}
                <Table
                    data={repairs}
                    pagination={{
                        page: repairMeta.page,
                        pages: repairMeta.pages,
                        total: repairMeta.total,
                        onPageChange: (newPage) => setCurrentPage(newPage)
                    }}
                    columns={[
                        {
                            header: "Job Detail",
                            render: (req) => (
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-navy-50 text-navy-900 flex items-center justify-center font-black text-xl border border-navy-100">
                                        {req.customer.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-navy-900 text-lg">{req.customer}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">#{req.id}</div>
                                    </div>
                                </div>
                            )
                        },
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
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl border shadow-sm ${style}`}>
                                            {req.device === 'Mobile' ? <Smartphone className="w-5 h-5" /> :
                                                req.device === 'Laptop' ? <Laptop className="w-5 h-5" /> :
                                                    <Monitor className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-navy-900 leading-none mb-1">{req.brand}</div>
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{req.model}</div>
                                        </div>
                                    </div>
                                );
                            }
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
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[req.status]}`}>
                                    {req.status}
                                </span>
                            )
                        },
                        {
                            header: "Action",
                            render: (req) => (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedRepair(req);
                                            setShowViewModal(true);
                                        }}
                                        className="p-2.5 bg-navy-50 text-navy-900 rounded-xl hover:bg-navy-900 hover:text-white transition-all border border-navy-100 shadow-sm"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedRepair(req);
                                            setEditingPrice(req.price || 0);
                                            setShowEditModal(true);
                                        }}
                                        className="p-2.5 bg-lime-50 text-lime-700 rounded-xl hover:bg-lime-500 hover:text-navy-900 transition-all border border-lime-100 shadow-sm"
                                        title="Edit Status/Price"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(req.id)}
                                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
                                        title="Delete Repair"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )
                        }
                    ]}
                />
            </div>

            {/* Repair Management (Edit) Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedRepair(null);
                }}
                size="max-w-2xl"
            >
                {selectedRepair && (
                    <div className="p-10 space-y-8 relative">
                        <button
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedRepair(null);
                            }}
                            className="absolute top-8 right-8 p-2 bg-gray-100/50 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Edit Repair</div>
                                <h2 className="text-3xl font-black text-navy-900">#{selectedRepair.id}</h2>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${statusColors[selectedRepair.status]}`}>
                                {selectedRepair.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Status</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-navy-900 transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                                    value={selectedRepair.status}
                                    onChange={(e) => {
                                        setSelectedRepair({ ...selectedRepair, status: e.target.value });
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="On the Way">On the Way</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Final Price (PKR)</label>
                                <input
                                    type="number"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-navy-900 transition-all font-bold text-navy-900"
                                    value={editingPrice}
                                    onChange={(e) => setEditingPrice(e.target.value)}
                                />
                            </div>

                            {selectedRepair.status === 'Completed' && (
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Proof of Completion (URL)</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-navy-900 transition-all font-bold text-navy-900"
                                        value={editingProof}
                                        onChange={(e) => setEditingProof(e.target.value)}
                                    />
                                    <p className="text-[10px] font-bold text-red-400 ml-1">Required*</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 rounded-3xl bg-navy-50 border border-navy-100">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-navy-900 mt-1" />
                                <div>
                                    <div className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-1">Customer Address</div>
                                    <div className="font-bold text-navy-900">{selectedRepair.address}</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (selectedRepair.status === 'Completed' && !editingProof.trim()) {
                                    showToast('Proof of completion is required.', 'error');
                                    return;
                                }
                                handleUpdate(selectedRepair.id, selectedRepair.status, editingPrice, editingProof);
                            }}
                            className="w-full py-5 bg-navy-900 text-white font-black rounded-2xl shadow-xl shadow-navy-900/20 hover:-translate-y-1 transition-all uppercase tracking-widest text-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </Modal>

            {/* View Repair Detail Modal */}
            <RepairDetailModal
                repair={showViewModal ? selectedRepair : null}
                onClose={() => {
                    setShowViewModal(false);
                    setSelectedRepair(null);
                }}
            />
        </div>
    );
};

export default VendorDashboard;
