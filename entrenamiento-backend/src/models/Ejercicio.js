const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ejercicio = sequelize.define("Ejercicio", {
  ejercicioId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entrenamientoId: {
    type: DataTypes.UUID, // Changed from INTEGER to UUID to match primary key
    allowNull: false,
  },
});

// Remove the association here - we'll set it up in a separate file

module.exports = Ejercicio;
