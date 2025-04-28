import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DeleteModal from "./DeleteModal";

const formatDate = (date) => {
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("es-AR", options);

  return formatted;
};

export default function Workout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  // Función para agregar un nuevo ejercicio
  const [exerciseName, setExerciseName] = useState("");

  // Cargar los ejercicios cuando el componente se monta
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`http://localhost:3000/ejercicios/${id}`);
        const data = await response.json();

        const exercisesWithIsClosed = data.map((exercise) => ({
          ...exercise,
          isClosed: true, // agregamos isClosed en todos
        }));

        setExercises(exercisesWithIsClosed);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, [id]); // Cambiar el efecto para que dependa de `id`

  const handleDeleteExercise = (exercise) => {
    setExerciseToDelete(exercise);
    setShowDeleteModal(true);
  };

  const handleCloseExercise = async (exercise) => {
    try {
      const response = await fetch(`http://localhost:3000/ejercicios/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: exercise.nombre,
          series: exercise.series,
        }), // Cambiamos el estado a cerrado
      });
      console.log("Respuesta del servidor:", response);

      const exercisesWithIsClosed = exercises.map((ex) =>
        ex.ejercicioId === exercise.ejercicioId ? { ...ex, isClosed: true } : ex
      );

      setExercises(exercisesWithIsClosed);
    } catch (error) {
      console.error("Error closing exercise:", error);
    }
  };

  const addExercise = () => {
    if (exerciseName.trim() === "") return;

    const newExercise = {
      ejercicioid: Date.now(), // Generamos un ID único para el nuevo ejercicio
      nombre: exerciseName,
      series: [],
      isClosed: false,
    };

    setExercises([...exercises, newExercise]); // Añadimos el nuevo ejercicio al estado
    setExerciseName(""); // Limpiamos el campo de entrada
  };

  const confirmDelete = async (exercise) => {
    try {
      if (exercise.isClosed) {
        const response = await fetch(
          `http://localhost:3000/ejercicios/${exercise.ejercicioId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: exercise.nombre,
              series: exercise.series,
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to delete exercise");
        }
      }

      setExercises(
        exercises.filter((ex) => ex.ejercicioId !== exercise.ejercicioId)
      );
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }

    setShowDeleteModal(false); // Cerrar el modal después de eliminar
  };

  // Función para agregar un set a un ejercicio
  const [repsInput, setRepsInput] = useState({});
  const [weightInput, setWeightInput] = useState({});

  const addSet = (exercise) => {
    const repeticiones = repsInput[exercise.ejercicioId];
    const peso = weightInput[exercise.ejercicioId];
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
      ex.ejercicioId === exercise.ejercicioId
        ? {
            ...ex,
            series: [
              ...ex.series,
              {
                serieId: Date.now(),
                repeticiones: Number(repeticiones),
                peso: Number(peso),
              },
            ],
          }
        : ex
    );

    setExercises(updatedExercises); // Actualizamos el estado con el nuevo set
    setRepsInput({ ...repsInput, [exercise.ejercicioId]: "" });
    setWeightInput({ ...weightInput, [exercise.ejercicioId]: "" });
  };

  // Función para eliminar un set de un ejercicio
  const deleteSet = (exerciseId, setId) => {
    console.log("Ejercicio ID:", exerciseId, "Set ID:", setId);
    const updatedExercises = exercises.map((exercise) =>
      exercise.ejercicioId === exerciseId
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
      <h1 className="text-2xl font-bold mb-4">Workout Details</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="mb-2">
          <strong>Date:</strong> {formatDate(new Date())}{" "}
          {/* Aquí ajustamos para que use la fecha actual */}
        </p>
      </div>

      {/* Add Exercise */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Add Exercise</h2>
        <div className="flex">
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Exercise Name"
            className="border p-2 rounded-l w-full"
          />
          <button
            onClick={addExercise}
            className="bg-blue-500 text-white px-4 rounded-r"
          >
            Add
          </button>
        </div>
      </div>

      {/* Exercises List */}
      {exercises.length > 0 ? (
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
                onClick={() => handleDeleteExercise(exercise)} // Cambiamos aquí
                className="text-red-500 text-sm"
              >
                Delete Exercise
              </button>
            </div>

            {/* Sets */}
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
                        onClick={() => deleteSet(exercise.ejercicioId, set.id)}
                        className="text-red-400 text-xs"
                      >
                        Delete Set
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-2">No sets yet</p>
            )}
            {showDeleteModal && (
              <DeleteModal
                exercise={exerciseToDelete}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
              />
            )}

            {/* Add Set */}
            {!exercise.isClosed && (
              <>
                <div className="flex my-4">
                  <input
                    type="number"
                    min="1"
                    value={repsInput[exercise.ejercicioId] || ""}
                    onChange={(e) =>
                      setRepsInput({
                        ...repsInput,
                        [exercise.ejercicioId]: e.target.value,
                      })
                    }
                    placeholder="Reps"
                    className="border p-2 rounded-l w-full"
                  />
                  <input
                    type="number"
                    min="1"
                    value={weightInput[exercise.ejercicioId] || ""}
                    onChange={(e) =>
                      setWeightInput({
                        ...weightInput,
                        [exercise.ejercicioId]: e.target.value,
                      })
                    }
                    placeholder="Weight (kg)"
                    className="border p-2 rounded-l w-full"
                  />
                  <button
                    onClick={() => addSet(exercise)}
                    className="bg-green-500 text-white px-4 rounded-r"
                  >
                    Add
                  </button>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      handleCloseExercise(exercise);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Save Exercise
                  </button>
                </div>
              </>
            )}
            <p className="mt-2 text-xl font-semibold">
              Volume: {calculateExerciseVolume(exercise)} kg
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No exercises yet</p>
      )}

      {/* Total Volume */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-2xl font-semibold">Total Volume for Today</h3>
        <p className="text-xl">{calculateTotalVolume()} kg</p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 block w-full bg-blue-500 text-white py-2 rounded"
      >
        Back to Home
      </button>
    </div>
  );
}
