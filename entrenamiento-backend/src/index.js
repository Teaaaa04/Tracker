const express = require("express");
const supabase = require("../supabaseClient"); // Importar la configuración de Supabase
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON

// Rutas
const entrenamientosRoutes = require("./routes/entrenamientos");
const ejerciciosRoutes = require("./routes/ejercicios");
// const seriesRoutes = require("./routes/series");

app.use("/entrenamientos", entrenamientosRoutes);
app.use("/ejercicios", ejerciciosRoutes);

// Sincronizar la base de datos con Supabase y luego iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
