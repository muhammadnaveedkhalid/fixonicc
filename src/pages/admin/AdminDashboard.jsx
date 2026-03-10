import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  FileText,
  MessageSquare,
  LayoutDashboard,
  Inbox as InboxIcon,
  Monitor,
  Type,
  Wrench,
  Shield,
  ShoppingBag
} from 'lucide-react';
import Overview from './Overview';
import UserManagement from './UserManagement';
import VendorManagement from './VendorManagement';
import AdminList from './AdminList';
import BlogManager from './BlogManager';
import ReviewModeration from './ReviewModeration';
import ContentManager from './ContentManager';
import Inbox from './Inbox';
import BrandManager from './BrandManager';
import RepairManager from './RepairManager';
import AccessoryManager from './AccessoryManager';

const AdminDashboard = () => {
  const { fetchUsers, fetchContacts } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUsers();
    fetchContacts();
  }, [fetchUsers, fetchContacts]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'users', label: 'Clients', icon: <Users className="w-5 h-5" /> },
    { id: 'vendors', label: 'Vendors', icon: <Users className="w-5 h-5" /> },
    { id: 'admins', label: 'Admins', icon: <Shield className="w-5 h-5" /> },
    { id: 'blogs', label: 'Blogs', icon: <FileText className="w-5 h-5" /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <InboxIcon className="w-5 h-5" /> },
    { id: 'brands', label: 'Brands', icon: <Monitor className="w-5 h-5" /> },
    { id: 'repairs', label: 'Repairs', icon: <Wrench className="w-5 h-5" /> },
    { id: 'accessories', label: 'Accessories', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'content', label: 'Content', icon: <Type className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'admins':
        return <AdminList />;
      case 'blogs':
        return <BlogManager />;
      case 'reviews':
        return <ReviewModeration />;
      case 'inbox':
        return <Inbox />;
      case 'brands':
        return <BrandManager />;
      case 'content':
        return <ContentManager />;
      case 'repairs':
        return <RepairManager />;
      case 'accessories':
        return <AccessoryManager />;
      case 'analytics':
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar for Admin Features */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === item.id
                  ? 'bg-navy-500 text-white'
                  : 'text-navy-300 hover:bg-navy-50 hover:text-navy-900'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
