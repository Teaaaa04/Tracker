const users = [
  { id: 1, name: "Tomi" },
  { id: 2, name: "Juan" },
  { id: 3, name: "Anita" },
];
import { useNavigate } from "react-router-dom";

const UserSelect = () => {
  const navigate = useNavigate();
  localStorage.clear(); // Limpiar localStorage al cargar el componente

  const handleUserClick = (id) => {
    localStorage.setItem("userId", id);
    navigate("/categories");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h2 className="text-2xl font-bold mb-2">Selecciona un usuario</h2>
      <div className="flex flex-col space-y-4 mt-8">
        {users.map((user) => (
          <button
            className="bg-blue-500 text-white rounded-lg shadow-sm p-4"
            key={user.id}
            value={user.id}
            onClick={() => handleUserClick(user.id)}
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserSelect;
