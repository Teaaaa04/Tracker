// Función para obtener los entrenamientos desde la API

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getWorkouts = async () => {
  try {
    const response = await fetch(`${API_URL}/entrenamientos`);
    const data = await response.json();
    return data; // Asignar los datos a workouts
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};

const addWorkout = async () => {
  try {
    const response = await fetch(`${API_URL}/entrenamientos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
      }),
    });
    const newWorkout = await response.json();
    return newWorkout; // Devolver el nuevo entrenamiento creado
  } catch (error) {
    console.error("Error adding workout:", error);
  }
};

const deleteWorkout = async (id) => {
  try {
    const response = await fetch(`${API_URL}/entrenamientos/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Workout deleted successfully");
    } else {
      console.error("Error deleting workout:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting workout:", error);
  }
};

export { getWorkouts, addWorkout, deleteWorkout };
