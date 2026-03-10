import { Monitor } from "lucide-react";

const Table = ({ 
  columns, 
  data, 
  emptyState, 
  onRowClick,
  pagination = null, // { page, pages, total, onPageChange }
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
         {emptyState || (
            <div className="text-center py-16 bg-gray-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                <Monitor className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-navy-900 mb-1">No Data Found</h3>
              <p className="text-gray-400 text-sm font-medium">No records available to display.</p>
            </div>
         )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, rowIdx) => (
              <tr 
                key={item.id || item._id || rowIdx} 
                className={`group hover:bg-gray-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-8 py-6 ${col.className || ''}`}>
                    {col.render ? col.render(item) : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400">
            Showing Page <span className="text-navy-900">{pagination.page}</span> of <span className="text-navy-900">{pagination.pages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-100 text-navy-900 hover:bg-gray-50"
            >
              Prev
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-navy-900 text-white hover:bg-navy-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
