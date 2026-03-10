import { useState, useEffect } from 'react';
import { Plus, Trash2, Smartphone, Laptop, Monitor, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import Modal from '../../components/Modal';
import Table from '../../components/Table';

const BrandManager = () => {
  const { brands, brandMeta, fetchBrands, addBrand, deleteBrand } = useData();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [showModal, setShowModal] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: '', type: 'Mobile' });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBrands({ page: currentPage, search: searchTerm });
  }, [fetchBrands, currentPage, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addBrand(newBrand);
    if (result.success) {
      showToast('Brand added successfully', 'success');
      setShowModal(false);
      setNewBrand({ name: '', type: 'Mobile' });
    } else {
      showToast(result.message || 'Failed to add brand', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (await confirm('Delete Brand', 'Delete this brand? This cannot be undone.')) {
      const result = await deleteBrand(id);
      if (result.success) {
        showToast('Brand deleted successfully', 'success');
      } else {
        showToast('Failed to delete brand', 'error');
      }
    }
  };

  const getTypeIcon = (type) => {
      switch(type) {
          case 'Mobile': return <Smartphone className="w-5 h-5" />;
          case 'Laptop': return <Laptop className="w-5 h-5" />;
          case 'Desktop': return <Monitor className="w-5 h-5" />;
          default: return <Smartphone className="w-5 h-5" />;
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Brand Manager</h2>
          <p className="text-gray-500">Manage supported device brands.</p>
        </div>
         <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-navy-900 text-white rounded-2xl font-black hover:bg-navy-800 transition-all uppercase tracking-widest text-xs shadow-lg shadow-navy-900/20"
          >
            <Plus className="w-5 h-5" /> Add Brand
          </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search brands..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-navy-500 focus:border-navy-500 transition-all font-bold text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <Table
        data={brands}
        pagination={{
          page: brandMeta.page,
          pages: brandMeta.pages,
          total: brandMeta.total,
          onPageChange: (newPage) => setCurrentPage(newPage)
        }}
        columns={[
          {
            header: "Brand Name",
            accessor: "name",
            className: "font-bold text-gray-900"
          },
          {
            header: "Device Type",
            render: (brand) => (
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                  brand.type === 'Mobile' ? 'bg-lime-50 text-lime-700' : 
                  brand.type === 'Laptop' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
              }`}>
                  {getTypeIcon(brand.type)}
                  {brand.type}
              </span>
            )
          },
          {
            header: "Action",
            headerClassName: "text-right",
            className: "text-right",
            render: (brand) => (
              <div className="flex justify-end">
                <button 
                  onClick={() => handleDelete(brand._id)}
                  className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )
          }
        ]}
        emptyState={
          <div className="text-center py-20 text-gray-400">No brands found.</div>
        }
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Brand"
        size="max-w-md"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Device Type</label>
            <div className="grid grid-cols-3 gap-2">
                {['Mobile', 'Laptop', 'Desktop'].map(type => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setNewBrand({...newBrand, type})}
                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${
                            newBrand.type === type 
                            ? 'border-navy-900 bg-navy-900 text-white' 
                            : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Brand Name</label>
            <input 
                required 
                value={newBrand.name} 
                onChange={e => setNewBrand({...newBrand, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all font-bold" 
                placeholder="e.g. Apple, Dell..." 
            />
          </div>
           <button type="submit" className="w-full py-5 bg-navy-900 text-white rounded-2xl font-black shadow-xl shadow-navy-900/20 hover:bg-navy-800 transition-all uppercase tracking-[0.2em] text-sm">
            Add Brand
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BrandManager;
