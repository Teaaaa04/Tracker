const Entrenamiento = require("./Entrenamiento");
const Ejercicio = require("./Ejercicio");
const Serie = require("./Serie");

// Set up associations
Entrenamiento.hasMany(Ejercicio, {
  foreignKey: "entrenamientoId",
  onDelete: "CASCADE",
});

Ejercicio.belongsTo(Entrenamiento, {
  foreignKey: "entrenamientoId",
});

// Add Serie associations
Ejercicio.hasMany(Serie, {
  foreignKey: "ejercicioId",
  onDelete: "CASCADE",
});

Serie.belongsTo(Ejercicio, {
  foreignKey: "ejercicioId",
});

// Export models with associations
module.exports = {
  Entrenamiento,
  Ejercicio,
  Serie,
};
