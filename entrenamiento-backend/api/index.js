const express = require("express");
const supabase = require("../supabaseClient"); // Importar la configuración de Supabase
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON

// Rutas
const entrenamientosRoutes = require("../src/routes/entrenamientos");
const ejerciciosRoutes = require("../src/routes/ejercicios");
const categoriasRoutes = require("../src/routes/categorias");
// const seriesRoutes = require("./routes/series");

app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Entrenamientos!");
});

app.use("/entrenamientos", entrenamientosRoutes);
app.use("/ejercicios", ejerciciosRoutes);
app.use("/categorias", categoriasRoutes);

// Sincronizar la base de datos con Supabase y luego iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
