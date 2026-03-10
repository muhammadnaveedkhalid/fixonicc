import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Table from '../../components/Table';
import { CheckCircle2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorHistory = () => {
  const { repairs, fetchRepairs, repairMeta } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRepairs({ page: currentPage, search: searchTerm, status: 'Completed' });
  }, [fetchRepairs, currentPage, searchTerm]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-navy-100/50 p-10 border border-gray-100 flex items-center justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-navy-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-navy-900">Order History</h1>
          <p className="text-gray-500 font-medium mt-2">View all your completed jobs.</p>
        </div>
        <div className="p-4 bg-lime-50 rounded-2xl">
          <CheckCircle2 className="w-8 h-8 text-lime-600" />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search history by Customer, Device..."
          className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-lg shadow-gray-200/50 focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-all font-bold text-navy-900"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <Table
          data={repairs}
          pagination={{
            page: repairMeta.page,
            pages: repairMeta.pages,
            total: repairMeta.total,
            onPageChange: setCurrentPage
          }}
          columns={[
            {
              header: "Job ID",
              render: (req) => <span className="font-black text-navy-900">#{req.id}</span>
            },
            {
              header: "Date",
              render: (req) => <span className="text-sm font-bold text-gray-500">{req.date}</span>
            },
            {
              header: "Customer",
              render: (req) => (
                <div>
                  <div className="font-bold text-navy-900">{req.customer}</div>
                  <div className="text-xs text-gray-400">{req.address}</div>
                </div>
              )
            },
            {
              header: "Device",
              render: (req) => (
                <div className="font-medium text-navy-700">
                  {req.brand} {req.model}
                </div>
              )
            },
            {
              header: "Earnings",
              render: (req) => <span className="font-black text-navy-900">{req.price} PKR</span>
            },
            {
              header: "Status",
              render: () => (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-black uppercase tracking-wider">
                  Completed
                </span>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default VendorHistory;
