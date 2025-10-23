import React from 'react';

const DataTable = ({ data, columns, type }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-indigo-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-indigo-100">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={`table-row-hover transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              {type === 'users' && (
                <>
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.email}</td>
                  <td className="px-4 py-3 text-sm">{item.organization}</td>
                  <td className="px-4 py-3 text-sm">{item.role}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs status-badge">
                      {item.status}
                    </span>
                  </td>
                </>
              )}
              {type === 'documents' && (
                <>
                  <td className="px-4 py-3 text-sm">{item.title}</td>
                  <td className="px-4 py-3 text-sm">{item.uploader}</td>
                  <td className="px-4 py-3 text-sm">{item.organization}</td>
                  <td className="px-4 py-3 text-sm capitalize">{item.type}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs status-badge ${
                      item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </>
              )}
              {type === 'organizations' && (
                <>
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.head}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs status-badge">
                      {item.status}
                    </span>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;