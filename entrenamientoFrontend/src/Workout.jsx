import { useState, useEffect } from "react";
import DeleteModal from "./DeleteModal";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import {
  closeExercise,
  deleteExercise,
  getExercises,
} from "./services/ejercicios.js";

export default function Workout() {
  const workoutId = localStorage.getItem("workoutId");
  const [isLoading, setIsLoading] = useState(true);

  const [exercises, setExercises] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  // Función para agregar un nuevo ejercicio
  const [exerciseName, setExerciseName] = useState("");

  // Cargar los ejercicios cuando el componente se monta
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const data = await getExercises(workoutId);

        const exercisesWithIsClosed = data.map((exercise) => ({
          ...exercise,
          isClosed: true,
        }));

        setExercises(exercisesWithIsClosed);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
      setIsLoading(false);
    };

    fetchExercises();
  }, [workoutId]); // Cambiar el efecto para que dependa de `id`

  const handleDeleteExercise = (exercise) => {
    setExerciseToDelete(exercise);
    setShowDeleteModal(true);
  };

  const handleCloseExercise = async (exercise) => {
    setIsLoading(true);
    try {
      const ejercicioCreado = await closeExercise(exercise, workoutId);

      const exercisesWithIsClosed = exercises.map((ex) =>
        ex.ejercicioid === exercise.ejercicioid
          ? {
              ejercicioid: ejercicioCreado.ejercicioid,
              nombre: ejercicioCreado.nombre,
              series: exercise.series,
              isClosed: true,
            }
          : ex
      );

      setExercises(exercisesWithIsClosed);
    } catch (error) {
      console.error("Error closing exercise:", error);
    }
    setIsLoading(false);
  };

  const addExercise = () => {
    if (exerciseName.trim() === "") return;

    const newExercise = {
      ejercicioid: Date.now(),
      nombre: exerciseName,
      series: [],
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

  const [repsInput, setRepsInput] = useState({});
  const [weightInput, setWeightInput] = useState({});

  const addSet = (exercise) => {
    const repeticiones = repsInput[exercise.ejercicioid];
    const peso = weightInput[exercise.ejercicioid];
    if (
      !repeticiones ||
      isNaN(repeticiones) ||
      repeticiones <= 0 ||
      !peso ||
      isNaN(peso) ||
      peso <= 0
    )
      return;

    const updatedExercises = exercises.map((ex) =>
      ex.ejercicioid === exercise.ejercicioid
        ? {
            ...ex,
            series: [
              ...ex.series,
              {
                id: Date.now(),
                repeticiones: Number(repeticiones),
                peso: Number(peso),
              },
            ],
          }
        : ex
    );

    setExercises(updatedExercises); // Actualizamos el estado con el nuevo set
    setRepsInput({ ...repsInput, [exercise.ejercicioid]: "" });
    setWeightInput({ ...weightInput, [exercise.ejercicioid]: "" });
  };

  // Función para eliminar un set de un ejercicio
  const deleteSet = (exerciseId, setId) => {
    const updatedExercises = exercises.map((exercise) =>
      exercise.ejercicioid === exerciseId
        ? {
            ...exercise,
            series: exercise.series.filter((set) => set.id !== setId),
          }
        : exercise
    );

    setExercises(updatedExercises); // Actualizamos el estado con el set eliminado
  };

  // Función para calcular el volumen de un ejercicio
  const calculateExerciseVolume = (exercise) => {
    if (!exercise.series || exercise.series.length === 0) return 0;
    return exercise.series.reduce(
      (total, set) => total + set.repeticiones * set.peso,
      0
    );
  };

  // Función para calcular el volumen total de todos los ejercicios
  const calculateTotalVolume = () => {
    if (exercises.length === 0) return 0;
    return exercises.reduce(
      (total, exercise) => total + calculateExerciseVolume(exercise),
      0
    );
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

      {/* Exercises List */}
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
              <button
                onClick={() => handleDeleteExercise(exercise)}
                className="text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>

            {exercise.series.length > 0 ? (
              <ul className="my-4">
                {exercise.series.map((set) => (
                  <li
                    key={set.id}
                    className="flex justify-between mb-4 items-center border-b py-1"
                  >
                    <span className="text-xl">
                      {set.repeticiones} x {set.peso}kg
                    </span>
                    {!exercise.isClosed && (
                      <button
                        onClick={() => deleteSet(exercise.ejercicioid, set.id)}
                        className="text-red-400 text-xs"
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
            {showDeleteModal && (
              <DeleteModal
                exercise={exerciseToDelete}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
              />
            )}

            {!exercise.isClosed && (
              <>
                <div className="flex my-4">
                  <input
                    type="number"
                    min="1"
                    value={repsInput[exercise.ejercicioid] || ""}
                    onChange={(e) =>
                      setRepsInput({
                        ...repsInput,
                        [exercise.ejercicioid]: e.target.value,
                      })
                    }
                    placeholder="Repeticiones"
                    className="border p-2 rounded-l w-full"
                  />
                  <input
                    type="number"
                    min="1"
                    value={weightInput[exercise.ejercicioid] || ""}
                    onChange={(e) =>
                      setWeightInput({
                        ...weightInput,
                        [exercise.ejercicioid]: e.target.value,
                      })
                    }
                    placeholder="Peso (kg)"
                    className="border p-2 rounded-l w-full"
                  />
                  <button
                    onClick={() => addSet(exercise)}
                    className="bg-green-500 text-white px-4 rounded-r"
                  >
                    Agregar
                  </button>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      handleCloseExercise(exercise);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Guardar y cerrar ejercicio
                  </button>
                </div>
              </>
            )}
            <p className="mt-2 text-xl font-semibold">
              Volumen: {calculateExerciseVolume(exercise)} kg
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No registraste ejercicios todavía
        </p>
      )}

      {/* Total Volume */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-2xl font-semibold">Volumen total</h3>
        <p className="text-xl">{calculateTotalVolume()} kg</p>
      </div>

      <button
        onClick={() => (window.location.href = "/home")}
        className="mt-6 block w-full bg-blue-500 text-white py-2 rounded"
      >
        Volver a la lista de entrenamientos
      </button>
    </div>
  );
}
