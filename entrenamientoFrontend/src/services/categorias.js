const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getCategories = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/categorias/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const addCategory = async (nombre, userId) => {
  try {
    const response = await fetch(`${API_URL}/categorias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        userid: userId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

export { getCategories, addCategory };
