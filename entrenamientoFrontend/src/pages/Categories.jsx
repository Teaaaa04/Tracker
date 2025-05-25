import { useEffect, useState } from "react";
import { getCategories, addCategory } from "../services/categorias.js";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

const Categories = () => {
  const navigate = useNavigate();
  localStorage.removeItem("categoryId");
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleCategorySelect = (categoryId, categoryName) => {
    localStorage.setItem("categoryId", categoryId);
    localStorage.setItem("categoryName", categoryName); // Cambia esto si necesitas otro valor
    navigate("/workouts");
  };

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("No se pudo obtener el usuario:", error?.message);
        navigate("/");
        return;
      }

      setUserId(user.id);
      const data = await getCategories(user.id);

      if (!data || data.length === 0) {
        setCategories([]);
        setIsLoading(false);
        return;
      }
      setCategories(data);

      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    setIsLoading(true);
    if (!newCategoryName.trim()) return;

    const newCategory = await addCategory(newCategoryName, userId);
    setCategories((prev) => [...prev, newCategory[0]]);
    setNewCategoryName("");
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto flex flex-col justify-between min-h-[100dvh] px-4 py-6 max-w-md">
      <div>
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold mb-4">Categorías</h1>
          <div className="relative mb-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className=" hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Opciones de rutina"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute top-8 right-3 bg-white rounded-lg shadow-lg border z-10 min-w-48">
                <div className="py-1 ">
                  <button
                    onClick={() => {
                      supabase.auth.signOut();
                      navigate("/");
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      id="_24x24_On_Light_Session-Join"
                      data-name="24x24/On Light/Session-Join"
                    >
                      <rect id="view-box" width="8" height="8" fill="none" />
                      <path
                        id="Shape"
                        d="M5.75,17.5a.75.75,0,0,1,0-1.5h8.8A1.363,1.363,0,0,0,16,14.75v-12A1.363,1.363,0,0,0,14.55,1.5H5.75a.75.75,0,0,1,0-1.5h8.8A2.853,2.853,0,0,1,17.5,2.75v12A2.853,2.853,0,0,1,14.55,17.5ZM7.22,13.28a.75.75,0,0,1,0-1.061L9.939,9.5H.75A.75.75,0,0,1,.75,8H9.94L7.22,5.28A.75.75,0,0,1,8.28,4.22l4,4,.013.013.005.006.007.008.007.008,0,.005.008.009,0,0,.008.01,0,0,.008.011,0,0,.008.011,0,0,.008.011,0,0,.007.011,0,.005.006.01,0,.007,0,.008,0,.009,0,.006.006.011,0,0,.008.015h0a.751.751,0,0,1-.157.878L8.28,13.28a.75.75,0,0,1-1.06,0Z"
                        transform="translate(3.25 3.25)"
                        fill="#141124"
                      />
                    </svg>
                    <p>Cerrar sesión</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {showMenu && (
            <div
              className="fixed inset-0 z-5"
              onClick={() => setShowMenu(false)}
            />
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Agregar categoria</h2>

          <div className="flex gap-2 ">
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
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-2">
            {categories.map((cat) => (
              <button
                onClick={() =>
                  handleCategorySelect(cat.categoriaid, cat.nombre)
                }
                key={cat.categoriaid}
                className="p-4 bg-gray-100 rounded shadow-sm text-center"
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
