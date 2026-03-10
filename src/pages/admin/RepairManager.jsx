import { useState, useEffect } from 'react';
import { Search, Smartphone, Laptop, Monitor, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Table from '../../components/Table';
import RepairDetailModal from '../../components/RepairDetailModal';

const RepairManager = () => {
  const { repairs, repairMeta, fetchRepairs } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRepair, setSelectedRepair] = useState(null);

  useEffect(() => {
    fetchRepairs({ page: currentPage, search: searchTerm, status: filterStatus });
  }, [fetchRepairs, currentPage, searchTerm, filterStatus]);

  const statusColors = {
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Accepted: "bg-navy-50 text-navy-700 border-navy-100",
    "On the Way": "bg-navy-50 text-navy-700 border-navy-100 shadow-sm",
    Ready: "bg-lime-50 text-lime-700 border-lime-100",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search repairs by ID, brand, model..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-all font-bold text-navy-900"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto whitespace-nowrap">
          {['All', 'Pending', 'On the Way', 'Completed', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' : 'text-gray-400 hover:text-navy-900'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <Table
          data={repairs}
          meta={repairMeta}
          onPageChange={setCurrentPage}
          columns={[
            {
              header: "Repair ID",
              render: (req) => (
                <div className="flex flex-col">
                  <span className="font-black text-navy-900">#{req.id}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{req.date}</span>
                </div>
              )
            },
            {
              header: "Customer",
              render: (req) => (
                <div className="font-bold text-navy-900">
                  {req.customerId?.name || req.customer || 'Unknown'}
                </div>
              )
            },
            {
              header: "Device",
              render: (req) => (
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border shadow-sm ${req.device === 'Mobile' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    req.device === 'Laptop' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                    {req.device === 'Mobile' ? <Smartphone className="w-4 h-4" /> :
                      req.device === 'Laptop' ? <Laptop className="w-4 h-4" /> :
                        <Monitor className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-navy-900 leading-none mb-1 text-sm">{req.brand}</div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{req.model}</div>
                  </div>
                </div>
              )
            },
            {
              header: "Vendor",
              render: (req) => (
                <div className="font-bold text-navy-900">
                  {req.vendorId?.name || 'Not Assigned'}
                </div>
              )
            },
            {
              header: "Status",
              render: (req) => (
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[req.status]}`}>
                  {req.status}
                </span>
              )
            },
            {
              header: "Price",
              render: (req) => (
                <div className="font-black text-navy-900 text-sm">
                  {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(req.price || 0)}
                </div>
              )
            },
            {
              header: "Action",
              render: (req) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRepair(req)}
                    className="p-2 bg-navy-50 text-navy-900 rounded-lg hover:bg-navy-900 hover:text-white transition-all border border-navy-100"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>

      <RepairDetailModal
        repair={selectedRepair}
        onClose={() => setSelectedRepair(null)}
      />
    </div>
  );
};

export default RepairManager;
