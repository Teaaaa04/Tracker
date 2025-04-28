// Función para obtener los entrenamientos desde la API
const getWorkouts = async () => {
  try {
    // Cambié la URL para que apunte a la función en Netlify
    const response = await fetch("/.netlify/functions/entrenamientos");
    const data = await response.json();
    return data; // Asignar los datos a workouts
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};

const addWorkout = async () => {
  try {
    // Cambié la URL para que apunte a la función en Netlify
    const response = await fetch("/.netlify/functions/entrenamientos", {
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
    // Cambié la URL para que apunte a la función en Netlify
    const response = await fetch(`/.netlify/functions/entrenamientos/${id}`, {
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
