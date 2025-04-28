const express = require("express");
const app = express();
const cors = require("cors");
const supabase = require("./supabaseClient");

app.use(cors());
app.use(express.json());

// Rutas
const entrenamientosRoutes = require("./entrenamientos");
const ejerciciosRoutes = require("./ejercicios");

app.use("/entrenamientos", entrenamientosRoutes);
app.use("/ejercicios", ejerciciosRoutes);

// Exporta la función para Netlify
exports.handler = async function (event, context) {
  return await require("express-netlify")(app)(event, context);
};
