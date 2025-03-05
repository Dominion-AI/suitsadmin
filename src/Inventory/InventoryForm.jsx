// import React, { useState } from "react";

// const InventoryForm = ({ onSubmit, fields, submitLabel = "Submit", isLoading = false }) => {
//   const [formData, setFormData] = useState({});
//   const [formErrors, setFormErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // Clear error for this field when user types
//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: "" });
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     let isValid = true;

//     fields.forEach(field => {
//       if (field.required && !formData[field.name]) {
//         errors[field.name] = `${field.label} is required`;
//         isValid = false;
//       }
//     });

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     const success = await onSubmit(formData);
    
//     // Reset form if submission was successful
//     if (success) {
//       setFormData({});
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 border rounded shadow-sm">
//       {fields.map((field) => (
//         <div key={field.name}>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {field.label} {field.required && <span className="text-red-500">*</span>}
//           </label>
//           {field.type === "textarea" ? (
//             <textarea
//               name={field.name}
//               value={formData[field.name] || ''}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               rows={4}
//             />
//           ) : (
//             <input
//               type={field.type || 'text'}
//               name={field.name}
//               value={formData[field.name] || ''}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           )}
//           {formErrors[field.name] && (
//             <p className="mt-1 text-sm text-red-600">{formErrors[field.name]}</p>
//           )}
//         </div>
//       ))}
//       <button
//         type="submit"
//         disabled={isLoading}
//         className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//       >
//         {isLoading ? 'Processing...' : submitLabel}
//       </button>
//     </form>
//   );
// };

// export default InventoryForm;




import React, { useState } from "react";

const InventoryForm = ({ onSubmit, fields, submitLabel = "Enviar", isLoading = false }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar el error de este campo cuando el usuario escriba
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} es obligatorio`;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await onSubmit(formData);
    
    // Restablecer el formulario si el envío fue exitoso
    if (success) {
      setFormData({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 border rounded shadow-sm">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          )}
          {formErrors[field.name] && (
            <p className="mt-1 text-sm text-red-600">{formErrors[field.name]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Procesando...' : submitLabel}
      </button>
    </form>
  );
};

export default InventoryForm;
