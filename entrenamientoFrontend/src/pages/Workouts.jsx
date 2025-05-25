import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

import {
  getWorkouts,
  addWorkout,
  deleteWorkout,
} from "../services/entrenamientos.js";

const formatDate = (date) => {
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("es-AR", options);
  return formatted;
};

export default function Home() {
  const navigate = useNavigate();
  const categoriaId = localStorage.getItem("categoryId");
  const categoriaName = localStorage.getItem("categoryName");
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [newWorkoutDate, setNewWorkoutDate] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("No se pudo obtener el usuario:", error?.message);
        navigate("/");
        return;
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);

      try {
        const fetchedWorkouts = await getWorkouts(categoriaId);
        setWorkouts(fetchedWorkouts);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
      setIsLoading(false);
    };

    fetchWorkouts();
  }, [categoriaId]);

  const handleAddWorkout = async () => {
    setIsLoading(true);
    try {
      const newWorkout = await addWorkout(
        newWorkoutName,
        newWorkoutDate,
        categoriaId
      );
      setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout[0]]);
    } catch (error) {
      console.error("Error adding workout:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteWorkout = async () => {
    setIsLoading(true);
    try {
      if (workoutToDelete) {
        await deleteWorkout(workoutToDelete); // Llamar a la función para eliminar un entrenamiento
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter(
            (workout) => workout.entrenamientoid !== workoutToDelete
          )
        ); // Actualizar el estado eliminando el entrenamiento
        setModalOpen(false); // Cerrar el modal después de eliminar
      }
    } catch (error) {
      console.error("Error deleting workout:", error); // Manejar errores al eliminar un entrenamiento
    }
    setIsLoading(false);
  };

  const handleSelectWorkout = (id) => {
    localStorage.setItem("workoutId", id);
    navigate("/exercises"); // Navegar a la página de ejercicios
  };

  const handleModalClose = () => {
    setModalOpen(false); // Cerrar el modal sin eliminar
    setWorkoutToDelete(null); // Limpiar el entrenamiento seleccionado
  };

  const handleModalOpen = (id) => {
    setWorkoutToDelete(id); // Establecer el entrenamiento a eliminar
    setModalOpen(true); // Abrir el modal
  };

  return (
    <div className="container mx-auto flex flex-col justify-between min-h-[100dvh] px-4 py-6 max-w-md">
      <div>
        <h1 className="text-2xl font-bold mb-4">{categoriaName}</h1>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Agregar entrenamiento</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              placeholder="Nuevo entrenamiento"
              className="flex-1 p-2 border rounded"
            />
            <input
              type="date"
              value={newWorkoutDate}
              onChange={(e) => setNewWorkoutDate(e.target.value)}
              className="hide-date-text p-2  cursor-pointer border rounded"
            />
            <button
              onClick={handleAddWorkout}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Agregar
            </button>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-2">Entrenamientos</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => (
            <div
              key={workout.entrenamientoid}
              onClick={() => handleSelectWorkout(workout.entrenamientoid)}
              className="block bg-white w-full rounded-lg shadow-sm mb-4 p-4 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-start gap-2">
                  <h2 className="text-lg font-semibold">{workout.nombre}</h2>
                  <h2>{formatDate(new Date(workout.fecha))}</h2>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // <- stop click from bubbling up
                    handleModalOpen(workout.entrenamientoid);
                  }}
                  className="text-red-500 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-lg">No registraste entrenamientos</p>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">
                Estas seguro que deseas eliminar este entrenamiento?
              </h2>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleModalClose}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteWorkout}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => navigate("/categories")}
        className="mt-6 block w-full bg-blue-500 text-white py-2 rounded"
      >
        Volver a la lista de categorías
      </button>
    </div>
  );
}
