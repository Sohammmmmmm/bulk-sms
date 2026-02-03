import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Download } from 'lucide-react';

export default function Table({ 
  columns, 
  data, 
  onRowClick,
  showSearch = true,
  showFilter = false,
  showExport = false,
  emptyMessage = "No data available",
  className = ""
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Search functionality
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return columns.some(column => {
      const value = row[column.key];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort functionality
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    // Convert data to CSV
    const headers = columns.map(col => col.header).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header with Actions */}
      {(showSearch || showFilter || showExport) && (
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            {/* Search */}
            {showSearch && (
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all duration-200"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {showFilter && (
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              )}
              
              {showExport && (
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  className={`px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortConfig.key === column.key && (
                      <span className="text-indigo-600">
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">{emptyMessage}</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-3.5 text-sm ${column.className || ''}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {sortedData.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing <span className="font-medium text-gray-900">{sortedData.length}</span> of{' '}
            <span className="font-medium text-gray-900">{data.length}</span> results
          </span>
          {searchTerm && (
            <span className="text-indigo-600">
              Filtered by: "{searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Example usage:
// <Table
//   columns={[
//     { key: 'id', header: 'ID', sortable: true },
//     { key: 'name', header: 'Name', sortable: true },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       render: (value) => (
//         <span className={`px-2 py-1 rounded-full text-xs ${
//           value === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
//         }`}>
//           {value}
//         </span>
//       )
//     },
//   ]}
//   data={[
//     { id: 1, name: 'John', status: 'active' },
//     { id: 2, name: 'Jane', status: 'inactive' }
//   ]}
//   showSearch={true}
//   showExport={true}
//   onRowClick={(row) => console.log('Clicked:', row)}
// />