const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const closeExercise = async (exercise, workoutId) => {
  const response = await fetch(`${API_URL}/ejercicios/${workoutId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: exercise.nombre,
      series: exercise.series,
    }), // Cambiamos el estado a cerrado
  });
  return await response.json();
};

const deleteExercise = async (exercise) => {
  if (exercise.isClosed) {
    const response = await fetch(
      `${API_URL}/ejercicios/${exercise.ejercicioid}`,
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
};

const getExercises = async (workoutId) => {
  const response = await fetch(`${API_URL}/ejercicios/${workoutId}`);
  return await response.json();
};

export { closeExercise, deleteExercise, getExercises };
