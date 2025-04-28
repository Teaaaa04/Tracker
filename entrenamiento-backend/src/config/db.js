const { Sequelize } = require("sequelize");

// Configura tu conexión a la base de datos PostgreSQL
const sequelize = new Sequelize("Entrenamientos", "postgres", "skalipso04", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // Opcional: desactiva los logs SQL si no los necesitas
});

module.exports = sequelize;
