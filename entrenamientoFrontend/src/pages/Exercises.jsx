import { useState, useEffect } from "react";
import DeleteModal from "../components/DeleteModal.jsx";
import { useNavigate } from "react-router-dom";
import Notificacion from "../components/Notificacion.jsx";
import ExerciseCard from "../components/ExerciseCard.jsx";

import {
  closeExercise,
  deleteExercise,
  getExercises,
  updateExercise,
} from "../services/ejercicios.js";
import WorkoutHeader from "../components/WorkoutHeader.jsx";
import AddExerciseForm from "../components/AddExerciseForm.jsx";
import LoadingAnimation from "../components/LoadingAnimation.jsx";

export default function Workout() {
  const navigate = useNavigate();
  const workoutId = localStorage.getItem("workoutId");
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const data = await getExercises(workoutId);
        const exercisesWithIsClosed = data.map((exercise) => ({
          ...exercise,
          isClosed: true,
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

  const confirmDelete = async (exercise) => {
    setIsLoading(true);

    await deleteExercise(exercise);
    setExercises(
      exercises.filter((ex) => ex.ejercicioid !== exercise.ejercicioid)
    );

    setIsLoading(false);
    setNotification("Ejercicio eliminado correctamente");
    setShowDeleteModal(false);
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <WorkoutHeader
        exercises={exercises}
        setExercises={setExercises}
        setNotification={setNotification}
      />
      <AddExerciseForm exercises={exercises} setExercises={setExercises} />

      {isLoading ? (
        <LoadingAnimation />
      ) : exercises.length > 0 ? (
        exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.ejercicioid}
            exercise={exercise}
            functions={{
              handleDeleteExercise,
              handleCloseExercise,
              calculateExerciseVolume,
            }}
            exercisesState={{ exercises, setExercises }}
          />
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
        onClick={() => navigate("/workouts")}
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
