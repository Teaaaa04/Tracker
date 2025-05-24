import { useState, useEffect } from "react";
import DeleteModal from "./DeleteModal";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-2xl font-bold mb-4">Detalles del entrenamiento</h1>

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
    </div>
  );
}
