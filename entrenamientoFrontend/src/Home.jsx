import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWorkouts,
  addWorkout,
  deleteWorkout,
} from "./Services/entrenamientos";

const formatDate = (date) => {
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("es-AR", options);
  return formatted;
};

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // Estado para abrir y cerrar el modal
  const [workoutToDelete, setWorkoutToDelete] = useState(null); // Estado para almacenar el entrenamiento a eliminar

  useEffect(() => {
    // Llamar a la API para obtener los entrenamientos
    const fetchWorkouts = async () => {
      try {
        const fetchedWorkouts = await getWorkouts(); // Esperar los datos de
        console.log(fetchedWorkouts); // Imprimir los datos obtenidos en la consola
        setWorkouts(fetchedWorkouts); // Actualizar el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts(); // Ejecutar la función asincrónica
  }, []); // Este efecto solo se ejecutará una vez cuando el componente se monte

  const handleAddWorkout = async () => {
    try {
      const newWorkout = await addWorkout(); // Llamar a la función para agregar un nuevo entrenamiento
      setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]); // Actualizar el estado con el nuevo entrenamiento
    } catch (error) {
      console.error("Error adding workout:", error); // Manejar errores al agregar un entrenamiento
    }
  };

  const handleDeleteWorkout = async () => {
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
  };

  const handleModalClose = () => {
    setModalOpen(false); // Cerrar el modal sin eliminar
    setWorkoutToDelete(null); // Limpiar el entrenamiento seleccionado
  };

  const handleModalOpen = (id) => {
    setWorkoutToDelete(id); // Establecer el entrenamiento a eliminar
    setModalOpen(true); // Abrir el modal
  };

  const todaysWorkouts = workouts.filter((workout) => {
    if (workout && workout.fecha) {
      // Verificar que workout y workout.fecha existan
      const workoutDate = new Date(workout.fecha).toDateString();
      const today = new Date().toDateString();
      return workoutDate === today;
    }
    console.log("Workout or fecha not found:", workout); // Imprimir en consola si no se encuentra workout o fecha
    return false; // Si workout o workout.fecha no existen, no lo filtramos
  });

  const pastWorkouts = workouts.filter((workout) => {
    if (workout && workout.fecha) {
      // Verificar que workout y workout.fecha existan
      const workoutDate = new Date(workout.fecha).toDateString();
      const today = new Date().toDateString();
      return workoutDate !== today;
    }
    return false; // Si workout o workout.fecha no existen, no lo filtramos
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Today's Workouts */}
      <h2 className="text-lg font-semibold mb-2">Today's Workouts</h2>
      {todaysWorkouts.length > 0 ? (
        todaysWorkouts.map((workout) => (
          <Link
            key={workout.entrenamientoid} // Asegurando que workout.id sea único
            to={`/workout/${workout.entrenamientoid}`}
            className="block bg-white rounded-lg shadow-sm mb-4 p-4 hover:bg-gray-100"
          >
            <div className="flex justify-between items-center">
              <h2>{formatDate(new Date(workout.fecha))}</h2>{" "}
              {/* Usar new Date para convertir la fecha */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevenir la navegación al hacer clic en el botón
                  handleModalOpen(workout.entrenamientoid); // Abrir el modal
                }}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </Link>
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
          <p className="text-lg">No workouts for today yet</p>
          <p className="text-sm">Tap the + button to add one!</p>
        </div>
      )}

      {/* Past Workouts */}
      {pastWorkouts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-8 mb-2">Previous Workouts</h2>
          {pastWorkouts.map((workout) => (
            <Link
              key={workout.entrenamientoid} // Asegurando que workout.id sea único
              to={`/workout/${workout.entrenamientoid}`}
              className="block bg-white rounded-lg shadow-sm mb-4 p-4 hover:bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <h2>{formatDate(new Date(workout.fecha))}</h2>{" "}
                {/* Usar new Date para convertir la fecha */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen(workout.entrenamientoid); // Abrir el modal
                  }}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </Link>
          ))}
        </>
      )}

      {/* Add Workout Button */}
      <button
        onClick={handleAddWorkout}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
      >
        +
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this workout?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleModalClose}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkout}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
