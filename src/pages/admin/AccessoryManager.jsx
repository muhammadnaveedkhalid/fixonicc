import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { useConfirm } from '../../context/ConfirmContext';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const AccessoryManager = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState(null);
  const [activeTab, setActiveTab] = useState('All'); // For filter in admin table if needed, though usually just listing all

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mobile',
    price: '',
    description: '',
    image: '',
    stock: ''
  });

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const fetchAccessories = async () => {
    setLoading(true);
    try {
      // Fetch all by not passing category or modify backend to support 'All'
      // For now, let's fetch individual and merge, or better yet update backend to allow empty category for all.
      // Assuming backend supports empty query param returns all
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/accessories`);
      const data = await res.json();
      if (res.ok) {
        setAccessories(data);
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to load accessories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result })); // Preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image; // Return existing image URL if no new file

    const data = new FormData();
    data.append('file', imageFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      return result.fileUrl || result.filePath; // Adjust based on upload response structure
    } catch (error) {
      console.error("Upload failed", error);
      throw new Error("Image upload failed");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const uploadedPath = await uploadImage();
        if (uploadedPath.startsWith('http')) {
          imageUrl = uploadedPath;
        } else {
          imageUrl = `${import.meta.env.VITE_API_BASE_URL}${uploadedPath}`;
        }
      }

      const payload = {
        ...formData,
        image: imageUrl,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      const url = currentAccessory
        ? `${import.meta.env.VITE_API_BASE_URL}/accessories/${currentAccessory._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/accessories`;

      const method = currentAccessory ? 'PUT' : 'POST';

      // Get token
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const token = user?.token;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`Accessory ${currentAccessory ? 'updated' : 'added'} successfully`, 'success');
        setIsModalOpen(false);
        fetchAccessories();
      } else {
        const err = await res.json();
        showToast(err.message || 'Operation failed', 'error');
      }

    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (await confirm('Are you sure you want to delete this accessory?')) {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const token = user?.token;
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/accessories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          showToast('Accessory deleted', 'success');
          fetchAccessories();
        }
      } catch (error) {
        showToast('Delete failed', 'error');
      }
    }
  };

  const openModal = (accessory = null) => {
    if (accessory) {
      setCurrentAccessory(accessory);
      setFormData({
        name: accessory.name,
        category: accessory.category,
        price: accessory.price,
        description: accessory.description || '',
        image: accessory.image || '',
        stock: accessory.stock
      });
    } else {
      setCurrentAccessory(null);
      setFormData({
        name: '',
        category: 'Mobile',
        price: '',
        description: '',
        image: '',
        stock: ''
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-xs">No Img</span>
            )}
          </div>
          <span className="font-bold text-navy-900">{item.name}</span>
        </div>
      )
    },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Price',
      accessor: 'price',
      render: (item) => <span className="font-bold text-lime-600">${item.price}</span>
    },
    { header: 'Stock', accessor: 'stock' },
    {
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <button onClick={() => openModal(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-navy-900">Accessories</h2>
          <p className="text-gray-400 text-sm">Manage products for the store.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20"
        >
          <Plus className="w-5 h-5" /> Add New
        </button>
      </div>

      <Table
        columns={columns}
        data={accessories}
        pagination={null}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAccessory ? "Edit Accessory" : "Add Accessory"}>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-black text-navy-900 uppercase tracking-wide">Product Image</label>
            <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-lime-500 hover:bg-lime-50/20 transition-all relative overflow-hidden group bg-gray-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-black text-sm bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-lime-600 transition-colors">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Click to upload</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-navy-900 uppercase tracking-wide">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Ultra Slim Case"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 focus:outline-none font-bold text-navy-900 placeholder:text-gray-300 transition-all"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-navy-900 uppercase tracking-wide">Category</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 focus:outline-none font-bold text-navy-900 appearance-none transition-all cursor-pointer"
                >
                  <option value="Mobile">Mobile Accessories</option>
                  <option value="Laptop">Laptop Accessories</option>
                  <option value="Tablet">Tablet Accessories</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-navy-900 uppercase tracking-wide">Price ($)</label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 focus:outline-none font-bold text-navy-900 placeholder:text-gray-300 transition-all"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-navy-900 uppercase tracking-wide">Stock Quantity</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 focus:outline-none font-bold text-navy-900 placeholder:text-gray-300 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-navy-900 uppercase tracking-wide">Description</label>
            <textarea
              placeholder="Enter product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 focus:outline-none font-bold text-navy-900 placeholder:text-gray-300 min-h-[120px] resize-none transition-all"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 hover:text-navy-900 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-4 bg-lime-500 text-navy-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {uploading ? 'Saving...' : (currentAccessory ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AccessoryManager;
