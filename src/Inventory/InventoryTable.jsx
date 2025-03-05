// import React from 'react';

// const InventoryTable = ({ data, columns, onEdit, onDelete }) => {
//   return (
//     <div className="overflow-x-auto border rounded shadow-sm">
//       <table className="min-w-full bg-white">
//         <thead className="bg-gray-50">
//           <tr>
//             {columns.map((column) => (
//               <th 
//                 key={column.key} 
//                 className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
//               >
//                 {column.label}
//               </th>
//             ))}
//             {(onEdit || onDelete) && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>}
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {data.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-4 text-center text-gray-500">
//                 No items found
//               </td>
//             </tr>
//           ) : (
//             data.map((item, index) => (
//               <tr key={item.id || index} className="hover:bg-gray-50">
//                 {columns.map((column) => (
//                   <td key={column.key} className="px-4 py-2 whitespace-nowrap">
//                     {item[column.key]}
//                   </td>
//                 ))}
//                 {(onEdit || onDelete) && (
//                   <td className="px-4 py-2 whitespace-nowrap space-x-2">
//                     {onEdit && (
//                       <button 
//                         onClick={() => onEdit(item)} 
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         Edit
//                       </button>
//                     )}
//                     {onDelete && (
//                       <button 
//                         onClick={() => onDelete(item.id || index)} 
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         Delete
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InventoryTable;





import React from 'react';

const InventoryTable = ({ data, columns, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto border rounded shadow-sm">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-4 text-center text-gray-500">
                No se encontraron elementos
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2 whitespace-nowrap">
                    {item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-2 whitespace-nowrap space-x-2">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(item)} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(item.id || index)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
