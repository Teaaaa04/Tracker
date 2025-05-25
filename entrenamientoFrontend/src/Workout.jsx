import { useState, useEffect } from "react";
import DeleteModal from "./DeleteModal";
import { useNavigate } from "react-router-dom";
import Notificacion from "./Notificacion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import {
  closeExercise,
  deleteExercise,
  getExercises,
  updateExercise,
} from "./services/ejercicios.js";

export default function Workout() {
  const navigate = useNavigate();
  const workoutId = localStorage.getItem("workoutId");
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [exerciseName, setExerciseName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const data = await getExercises(workoutId);
        const exercisesWithIsClosed = data.map((exercise) => ({
          ...exercise,
          isClosed: true,
          // Asegurar que los sets tengan la estructura correcta
          series: exercise.series.map((set) => ({
            ...set,
            repeticiones: set.repeticiones || "",
            peso: set.peso || "",
          })),
        }));
        setExercises(exercisesWithIsClosed);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
      setIsLoading(false);
    };

    fetchExercises();
  }, [workoutId]);

  // Función para copiar la rutina actual
  const copiarRutina = async () => {
    try {
      // Crear el objeto a copiar con metadatos
      const rutinaData = {
        ejercicios: exercises.map((ejercicio) => ({
          nombre: ejercicio.nombre,
          series: ejercicio.series
            .filter((serie) => serie.repeticiones && serie.peso)
            .map((serie) => ({
              repeticiones: Number(serie.repeticiones),
              peso: Number(serie.peso),
            })),
        })),
      };

      // Convertir a JSON y copiar al portapapeles
      const jsonString = JSON.stringify(rutinaData, null, 2);
      await navigator.clipboard.writeText(jsonString);

      setNotification("Rutina copiada");

      localStorage.setItem("copiedWorkout", jsonString);
    } catch (error) {
      console.error("Error al copiar rutina:", error);
    }
  };

  // Función para pegar una rutina
  const pegarRutina = async () => {
    try {
      // Obtener la rutina copiada del localStorage

      if (!localStorage.getItem("copiedWorkout")) {
        setNotification("No hay rutina copiada");
        return;
      }

      const copiedWorkoutData = localStorage.getItem("copiedWorkout");

      // Parsear los datos JSON
      const rutinaData = JSON.parse(copiedWorkoutData);

      // Convertir los ejercicios copiados al formato interno de la app
      const nuevosEjercicios = rutinaData.ejercicios.map(
        (ejercicio, index) => ({
          ejercicioid: Date.now() + index, // ID único basado en timestamp
          nombre: ejercicio.nombre,
          series: ejercicio.series.map((serie, serieIndex) => ({
            id: Date.now() + index * 1000 + serieIndex, // ID único para cada serie
            repeticiones: serie.repeticiones.toString(),
            peso: serie.peso.toString(),
          })),
          isClosed: false, // Los ejercicios pegados empiezan abiertos para edición
        })
      );

      setExercises([...exercises, ...nuevosEjercicios]);

      // Limpiar el localStorage después de pegar
      localStorage.removeItem("copiedWorkout");
    } catch (error) {
      console.error("Error al pegar rutina:", error);
    }
  };

  const handleDeleteExercise = (exercise) => {
    setExerciseToDelete(exercise);
    setShowDeleteModal(true);
  };

  const handleCloseExercise = async (exercise) => {
    // Validar que todos los sets tengan valores válidos
    const invalidSet = exercise.series.find(
      (set) =>
        !set.repeticiones ||
        isNaN(set.repeticiones) ||
        set.repeticiones <= 0 ||
        !set.peso ||
        isNaN(set.peso) ||
        set.peso <= 0
    );

    if (invalidSet) {
      // Eliminar ese set del ejercicio y guardar en el mismo array
      exercise.series = exercise.series.filter(
        (set) =>
          set.repeticiones &&
          !isNaN(set.repeticiones) &&
          set.repeticiones > 0 &&
          set.peso &&
          !isNaN(set.peso) &&
          set.peso > 0
      );
    }

    setIsLoading(true);
    try {
      let ejercicioCreado;
      const isNew =
        typeof exercise.ejercicioid === "number" &&
        exercise.ejercicioid.toString().length >= 13;

      // Convertir los valores a números antes de enviar
      const exerciseToSave = {
        ...exercise,
        series: exercise.series.map((set) => ({
          ...set,
          repeticiones: Number(set.repeticiones),
          peso: Number(set.peso),
        })),
      };

      if (isNew) {
        ejercicioCreado = await closeExercise(exerciseToSave, workoutId);
      } else {
        ejercicioCreado = await updateExercise(exerciseToSave, workoutId);
      }

      const updated = exercises.map((ex) =>
        ex.ejercicioid === exercise.ejercicioid
          ? {
              ejercicioid: ejercicioCreado.ejercicioid,
              nombre: ejercicioCreado.nombre,
              series: exerciseToSave.series,
              isClosed: true,
            }
          : ex
      );
      setExercises(updated);
    } catch (error) {
      console.error("Error closing/updating exercise:", error);
    }
    setIsLoading(false);
  };

  const addExercise = () => {
    if (exerciseName.trim() === "") return;
    const newExercise = {
      ejercicioid: Date.now(),
      nombre: exerciseName,
      series: [
        {
          id: Date.now(),
          repeticiones: "",
          peso: "",
        },
      ],
      isClosed: false,
    };
    setExercises([...exercises, newExercise]);
    setExerciseName("");
  };

  const confirmDelete = async (exercise) => {
    setIsLoading(true);
    try {
      await deleteExercise(exercise);
      setExercises(
        exercises.filter((ex) => ex.ejercicioid !== exercise.ejercicioid)
      );
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
    setIsLoading(false);
    setShowDeleteModal(false);
  };

  const addNewSet = (exercise) => {
    const updatedExercises = exercises.map((ex) =>
      ex.ejercicioid === exercise.ejercicioid
        ? {
            ...ex,
            series: [
              ...ex.series,
              {
                id: Date.now(),
                repeticiones: "",
                peso: "",
              },
            ],
          }
        : ex
    );
    setExercises(updatedExercises);
  };

  const deleteSet = (exerciseId, setId) => {
    const updatedExercises = exercises.map((exercise) =>
      exercise.ejercicioid === exerciseId
        ? {
            ...exercise,
            series: exercise.series.filter((set) => set.id !== setId),
          }
        : exercise
    );
    setExercises(updatedExercises);
  };

  const updateSetValue = (exerciseId, setId, field, value) => {
    const updatedExercises = exercises.map((exercise) =>
      exercise.ejercicioid === exerciseId
        ? {
            ...exercise,
            series: exercise.series.map((set) =>
              set.id === setId
                ? {
                    ...set,
                    [field]: value,
                  }
                : set
            ),
          }
        : exercise
    );
    setExercises(updatedExercises);
  };

  const calculateExerciseVolume = (exercise) => {
    if (!exercise.series || exercise.series.length === 0) return 0;
    return exercise.series.reduce((total, set) => {
      const reps = Number(set.repeticiones) || 0;
      const weight = Number(set.peso) || 0;
      return total + reps * weight;
    }, 0);
  };

  const calculateTotalVolume = () => {
    if (exercises.length === 0) return 0;
    return exercises.reduce(
      (total, exercise) => total + calculateExerciseVolume(exercise),
      0
    );
  };

  const editWorkout = (exercise) => {
    const updatedExercises = exercises.map((ex) =>
      ex.ejercicioid === exercise.ejercicioid ? { ...ex, isClosed: false } : ex
    );
    setExercises(updatedExercises);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Detalles del entrenamiento</h1>

        <div className="relative mb-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              <div className="py-1">
                <button
                  onClick={() => {
                    copiarRutina();
                    setShowMenu(false);
                  }}
                  disabled={exercises.length === 0}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 ${
                    exercises.length === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copiar Rutina
                </button>

                <button
                  onClick={() => {
                    pegarRutina();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Pegar Rutina
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
        <h2 className="text-lg font-semibold mb-2">Agregar ejercicio</h2>
        <div className="flex">
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Nombre del ejercicio"
            className="border p-2 rounded-l w-full"
          />
          <button
            onClick={addExercise}
            className="bg-blue-500 text-white px-4 rounded-r"
          >
            Agregar
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : exercises.length > 0 ? (
        exercises.map((exercise) => (
          <div
            key={exercise.ejercicioid}
            className={`bg-white rounded-lg shadow p-4 mb-6 ${
              exercise.isClosed ? "bg-gray-200" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-semibold">{exercise.nombre}</h3>
              <div className="flex space-x-2">
                {exercise.isClosed && (
                  <button
                    onClick={() => editWorkout(exercise)}
                    className="px-4 py-1 bg-green-500 text-white text-sm rounded-md shadow transition duration-200"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => handleDeleteExercise(exercise)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-md shadow transition duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {exercise.series.length > 0 ? (
              <ul className="my-4">
                {exercise.series.map((set, index) => (
                  <li
                    key={set.id}
                    className="flex justify-between mb-4 items-center border-b py-2"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {exercise.isClosed ? (
                        <span className="text-xl">
                          {set.repeticiones} x {set.peso}kg
                        </span>
                      ) : (
                        <>
                          <input
                            type="number"
                            min="1"
                            placeholder="Reps"
                            value={set.repeticiones}
                            onChange={(e) =>
                              updateSetValue(
                                exercise.ejercicioid,
                                set.id,
                                "repeticiones",
                                e.target.value
                              )
                            }
                            className="border p-2 rounded w-1/3 text-center"
                          />
                          <span className="text-sm">x</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="Peso"
                            value={set.peso}
                            onChange={(e) =>
                              updateSetValue(
                                exercise.ejercicioid,
                                set.id,
                                "peso",
                                e.target.value
                              )
                            }
                            className="border p-2 rounded w-1/3 text-center"
                          />
                          <span>kg</span>
                        </>
                      )}
                    </div>
                    {!exercise.isClosed && (
                      <button
                        onClick={() => deleteSet(exercise.ejercicioid, set.id)}
                        className="text-red-400 text-xs ml-4"
                      >
                        Eliminar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-2">
                No registraste series todavía
              </p>
            )}

            {!exercise.isClosed && (
              <>
                <div className="flex  mb-4">
                  <button
                    onClick={() => addNewSet(exercise)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Agregar serie
                  </button>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => handleCloseExercise(exercise)}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Guardar y cerrar ejercicio
                  </button>
                </div>
              </>
            )}

            <div className="flex justify-between items-center mt-4">
              <p className="mt-2 text-xl font-semibold">
                Volumen: {calculateExerciseVolume(exercise)} kg
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No registraste ejercicios todavía
        </p>
      )}
      {showDeleteModal && (
        <DeleteModal
          exercise={exerciseToDelete}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-2xl font-semibold">Volumen total</h3>
        <p className="text-xl">{calculateTotalVolume()} kg</p>
      </div>
      <button
        onClick={() => navigate("/home")}
        className="mt-6 block w-full bg-blue-500 text-white py-2 rounded"
      >
        Volver a la lista de entrenamientos
      </button>
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <Notificacion
            notification={notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
