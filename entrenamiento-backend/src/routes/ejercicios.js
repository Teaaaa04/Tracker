// src/routes/ejercicios.js
const express = require("express");
const router = express.Router();
const supabase = require("../../supabaseClient"); // Importar el cliente de Supabase

// Obtener los ejercicios asociados a un entrenamiento
router.get("/:entrenamientoId", async (req, res) => {
  const { entrenamientoId } = req.params;

  try {
    // Obtener los ejercicios asociados al entrenamiento
    const { data, error } = await supabase
      .from("ejercicio")
      .select("*")
      .eq("entrenamientoid", entrenamientoId);

    if (error) {
      throw new Error(error.message);
    }

    // También obtenemos las series asociadas a los ejercicios
    for (const ejercicio of data) {
      const { data: series, error: seriesError } = await supabase
        .from("serie")
        .select("*")
        .eq("ejercicioid", ejercicio.ejercicioid); // Asegúrate de que 'id' sea el campo correcto del ejercicio

      if (seriesError) {
        throw new Error(seriesError.message);
      }

      ejercicio.series = series; // Asociamos las series al ejercicio
    }

    res.json(data); // Retornamos los ejercicios con sus series
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los ejercicios" });
  }
});

// Ruta para agregar un ejercicio
router.post("/:entrenamientoid", async (req, res) => {
  const { entrenamientoid } = req.params;
  const { nombre, series } = req.body;

  try {
    // Insertar el ejercicio en la base de datos
    const { data, error } = await supabase
      .from("ejercicio")
      .insert({ nombre: nombre, entrenamientoid: entrenamientoid })
      .select("ejercicioid, nombre, entrenamientoid"); // Especifica las columnas que deseas obtener

    if (error) {
      throw new Error(error.message);
    }

    // Insertar las series asociadas al ejercicio
    if (series && series.length > 0) {
      const seriesConEjercicioId = series.map((serie) => ({
        repeticiones: serie.repeticiones,
        peso: serie.peso,
        ejercicioid: data[0].ejercicioid, // Asociamos las series al nuevo ejercicio
      }));

      const { error: seriesError } = await supabase
        .from("serie")
        .insert(seriesConEjercicioId);

      if (seriesError) {
        throw new Error(seriesError.message);
      }
    }
    res.status(201).json(data[0]); // Retornamos el ejercicio creado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo crear el ejercicio." });
  }
});

// Eliminar un ejercicio por ID
router.delete("/:ejercicioid", async (req, res) => {
  const { ejercicioid } = req.params;

  try {
    // Primero, eliminar las series asociadas al ejercicio
    const { error: seriesError } = await supabase
      .from("serie")
      .delete()
      .eq("ejercicioid", ejercicioid);

    if (seriesError) {
      throw new Error(seriesError.message);
    }

    // Luego, eliminar el ejercicio
    const { error } = await supabase
      .from("ejercicio")
      .delete()
      .eq("ejercicioid", ejercicioid);

    if (error) {
      throw new Error(error.message);
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el ejercicio" });
  }
});

router.put("/:ejercicioid", async (req, res) => {
  const { ejercicioid } = req.params;
  const { series } = req.body;

  try {
    // Actualizar las series asociadas al ejercicio
    if (series && series.length > 0) {
      // 1. Eliminar series existentes para ese ejercicio
      await supabase.from("serie").delete().eq("ejercicioid", ejercicioid);

      // 2. Insertar las nuevas series
      const nuevasSeries = series.map((serie) => ({
        repeticiones: serie.repeticiones,
        peso: serie.peso,
        ejercicioid,
      }));

      const { error: insertError } = await supabase
        .from("serie")
        .insert(nuevasSeries);

      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    const { data, error: err } = await supabase
      .from("ejercicio")
      .select("*")
      .eq("ejercicioid", ejercicioid);

    res.status(200).json(data[0]); // Retornamos el ejercicio actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el ejercicio" });
  }
});

module.exports = router;
