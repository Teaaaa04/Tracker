import { useEffect, useState } from "react";
import { getCategories, addCategory } from "../services/categorias.js";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  localStorage.removeItem("categoryId");
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  const handleCategorySelect = (categoryId, categoryName) => {
    localStorage.setItem("categoryId", categoryId);
    localStorage.setItem("categoryName", categoryName); // Cambia esto si necesitas otro valor
    navigate("/workouts");
  };

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);

      const data = await getCategories(userId);
      setCategories(data);

      setIsLoading(false);
    }

    fetchCategories();
  }, [userId]);

  const handleAddCategory = async () => {
    setIsLoading(true);
    if (!newCategoryName.trim()) return;

    const newCategory = await addCategory(newCategoryName, userId);
    setCategories((prev) => [...prev, newCategory[0]]);
    setNewCategoryName("");
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Categorías</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nueva categoría"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Agregar
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-2">
          {categories.map((cat) => (
            <button
              onClick={() => handleCategorySelect(cat.categoriaid, cat.nombre)}
              key={cat.categoriaid}
              className="p-4 bg-gray-100 rounded shadow-sm text-center"
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-6 block w-full bg-blue-500 text-white py-2 rounded"
      >
        Volver a la lista de selección de usuario
      </button>
    </div>
  );
};

export default Categories;
