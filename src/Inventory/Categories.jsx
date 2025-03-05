// import React, { useState, useEffect } from "react";
// import { getCategories, createCategory } from "../Services/api";
// import { PlusCircle, Loader2, Search } from "lucide-react";

// const CategoryInventory = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState({ name: "", description: "" });
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const data = await getCategories();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
//       await createCategory(newCategory);
//       setNewCategory({ name: "", description: "" });
//       fetchCategories();
//     } catch (error) {
//       console.error("Error creating category:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const filteredCategories = categories.filter(
//     (category) =>
//       category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <div className="max-w-6xl mx-auto p-6">
//         <header className="mb-8">
//           <h2 className="text-3xl font-bold text-indigo-800">Category Inventory</h2>
//           <p className="text-gray-600">Manage and organize your product categories</p>
//         </header>

//         {/* Add Category Form */}
//         <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
//           <div className="bg-indigo-500 px-6 py-4">
//             <h3 className="font-medium text-lg text-white">Add New Category</h3>
//           </div>
//           <form onSubmit={handleSubmit} className="p-6 flex items-end gap-4">
//             <div className="flex-1">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                 Category Name
//               </label>
//               <input
//                 id="name"
//                 type="text"
//                 name="name"
//                 placeholder="Enter category name"
//                 value={newCategory.name}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 required
//               />
//             </div>
//             <div className="flex-1">
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <input
//                 id="description"
//                 type="text"
//                 name="description"
//                 placeholder="Enter category description"
//                 value={newCategory.description}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={submitting}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
//             >
//               {submitting ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   <PlusCircle className="h-4 w-4" />
//                   Add Category
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Categories Table */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="bg-indigo-500 px-6 py-4 flex justify-between items-center">
//             <h3 className="font-medium text-lg text-white">Categories</h3>
//             <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1 w-64">
//               <Search className="h-4 w-4 text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Search categories..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="border-none focus:ring-0 focus:outline-none text-sm w-full"
//               />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       ID
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Description
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredCategories.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                         {searchTerm 
//                           ? "No categories match your search. Try a different term." 
//                           : "No categories found. Add your first category using the form above."}
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredCategories.map((category, index) => (
//                       <tr key={category.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {category.id || index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-500">{category.description}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Active
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
          
//           <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
//             Showing {filteredCategories.length} of {categories.length} categories
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryInventory;


import React, { useState, useEffect } from "react";
import { getCategories, createCategory } from "../Services/api";
import { PlusCircle, Loader2, Search } from "lucide-react";

const CategoryInventory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createCategory(newCategory);
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error al crear categoría:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-800">Inventario de Categorías</h2>
          <p className="text-gray-600">Administra y organiza tus categorías de productos</p>
        </header>

        {/* Formulario para agregar categoría */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="bg-indigo-500 px-6 py-4">
            <h3 className="font-medium text-lg text-white">Agregar Nueva Categoría</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Categoría
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ingrese el nombre de la categoría"
                value={newCategory.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                id="description"
                type="text"
                name="description"
                placeholder="Ingrese la descripción de la categoría"
                value={newCategory.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Agregar Categoría
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tabla de Categorías */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-500 px-6 py-4 flex justify-between items-center">
            <h3 className="font-medium text-lg text-white">Categorías</h3>
            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1 w-64">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none focus:ring-0 focus:outline-none text-sm w-full"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm
                          ? "No hay categorías que coincidan con su búsqueda. Intente con otro término."
                          : "No se encontraron categorías. Agregue su primera categoría con el formulario de arriba."}
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category, index) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id || index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold bg-green-100 text-green-800 rounded-full">Activo</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryInventory;
