// routes/entrenamientos.js
const express = require("express");
const router = express.Router();
const supabase = require("../../supabaseClient"); // Importar el cliente de Supabase

// Endpoint para agregar un entrenamiento
router.post("/", async (req, res) => {
  const { fecha } = req.body; // Obtener la fecha del cuerpo de la solicitud

  // Insertar el nuevo entrenamiento en Supabase
  const { data, error } = await supabase
    .from("entrenamiento") // Asegúrate de que la tabla 'entrenamiento' esté creada en Supabase
    .insert(
      { fecha } // Insertar el campo 'fecha'
    )
    .select("*"); // Seleccionar todos los campos del nuevo entrenamiento

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data); // Devolver el entrenamiento creado
});

// Endpoint para obtener todos los entrenamientos
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("entrenamiento") // Seleccionar todos los entrenamientos de la tabla
    .select("*");

  if (error) {
    return res.status(500).json({
      error: "Error al obtener los entrenamientos",
      details: error.message,
    });
  }

  res.status(200).json(data); // Devolver los entrenamientos obtenidos
});

// Endpoint para eliminar un entrenamiento por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Obtener el ID del entrenamiento a eliminar

  // Eliminar el entrenamiento de la base de datos
  const { error } = await supabase
    .from("entrenamiento")
    .delete()
    .eq("entrenamientoid", id); // Suponiendo que 'id' es el nombre de la columna en la tabla

  if (error) {
    console.error(error); // Imprimir el error en la consola para depuración
    return res.status(500).json({
      error: "Error al eliminar el entrenamiento",
      details: error.message,
    });
  }

  res.status(200).json({ message: "Entrenamiento eliminado" }); // Confirmar que se eliminó el entrenamiento
});

module.exports = router;
