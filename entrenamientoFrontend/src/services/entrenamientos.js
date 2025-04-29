const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getWorkouts = async (categoriaId) => {
  try {
    const response = await fetch(`${API_URL}/entrenamientos/${categoriaId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};

const addWorkout = async (nombre, categoriaId) => {
  try {
    const response = await fetch(`${API_URL}/entrenamientos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        nombre: nombre,
        categoriaid: categoriaId,
      }),
    });
    const newWorkout = await response.json();
    return newWorkout;
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
