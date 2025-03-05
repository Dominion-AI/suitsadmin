import React, { useEffect, useState } from "react";
import { getUsers } from "../Services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setError(
          error.response?.data?.detail ||
          (error.response?.status === 403
            ? "¡No autorizado! Se requiere acceso de administrador."
            : "No se pudieron obtener los usuarios. Por favor, inténtalo de nuevo.")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>

      {loading && <p className="text-gray-600">Cargando usuarios...</p>}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Nombre de Usuario</th>
              <th className="text-left p-2">Correo Electrónico</th>
              <th className="text-left p-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-2 px-2">{user.id}</td>
                <td className="py-2 px-2">{user.username}</td>
                <td className="py-2 px-2">{user.email}</td>
                <td className="py-2 px-2">{user.role || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
