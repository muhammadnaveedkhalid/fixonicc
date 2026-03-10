import { Trash2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import Table from '../../components/Table';

const Inbox = () => {
  const { contacts, contactMeta, fetchContacts, deleteContactMessage } = useData();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchContacts({ page: currentPage, search: searchTerm });
  }, [fetchContacts, currentPage, searchTerm]);

  const handleDelete = async (id) => {
     if (await confirm('Delete Message', 'Are you sure you want to delete this message?')) {
         const result = await deleteContactMessage(id);
         if (result.success) {
             showToast('Message deleted successfully', 'success');
         } else {
             showToast(result.message || 'Failed to delete message', 'error');
         }
     }
  };

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-black text-gray-900">Inbox</h2>
        <p className="text-gray-500">Read messages from the contact form.</p>
      </div>
       <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search inbox..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-navy-500 focus:border-navy-500 transition-all font-bold text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

       <Table
         data={contacts}
         pagination={{
            page: contactMeta.page,
            pages: contactMeta.pages,
            total: contactMeta.total,
            onPageChange: (newPage) => setCurrentPage(newPage)
         }}
         columns={[
           {
             header: "Subject",
             render: (contact) => (
                <div>
                  <div className="font-bold text-navy-900">{contact.subject}</div>
                  <div className="text-xs text-gray-400 mt-1 max-w-sm truncate">{contact.message}</div>
                </div>
             )
           },
           {
             header: "Sender",
             render: (contact) => (
                <div>
                  <div className="font-bold text-gray-900 text-sm">{contact.name}</div>
                  <div className="text-xs text-gray-500">{contact.email}</div>
                </div>
             )
           },
           {
             header: "Date",
             render: (contact) => (
               <span className="text-sm text-gray-500 font-bold">{new Date(contact.createdAt).toLocaleDateString()}</span>
             )
           },
           {
             header: "Action",
             render: (contact) => (
               <button 
                 onClick={() => handleDelete(contact._id)}
                 className="p-2 text-gray-300 hover:text-red-600"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
             )
           }
         ]}
         emptyState={
           <div className="text-center py-20 text-gray-400">No messages found.</div>
         }
       />
    </div>
  );
};

export default Inbox;
