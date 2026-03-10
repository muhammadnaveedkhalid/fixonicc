import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Table from '../../components/Table';

const AdminList = () => {
  const { users, userMeta, fetchUsers } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers({ page: currentPage, search: searchTerm, role: 'admin' });
  }, [fetchUsers, currentPage, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Admin List</h2>
        <p className="text-gray-500">View registered administrators.</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search admins..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-navy-500 focus:border-navy-500 transition-all font-bold text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <Table
        data={users}
        pagination={{
          page: userMeta.page,
          pages: userMeta.pages,
          total: userMeta.total,
          onPageChange: (newPage) => setCurrentPage(newPage)
        }}
        columns={[
          {
            header: "Admin Name",
            accessor: "name",
            className: "font-bold text-gray-900"
          },
          {
            header: "Role",
            render: (user) => (
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-600">
                {user.role}
              </span>
            )
          },
          {
            header: "Email",
            accessor: "email",
            className: "text-sm text-gray-500"
          },
          {
            header: "Joined Date",
            render: (user) => (
              <span className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            )
          }
        ]}
        emptyState={
          <div className="text-center py-20 text-gray-400">No admins found.</div>
        }
      />
    </div>
  );
};

export default AdminList;
