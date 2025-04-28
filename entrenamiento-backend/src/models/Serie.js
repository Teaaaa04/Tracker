const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Serie = sequelize.define("Serie", {
  serieId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  repeticiones: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peso: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  ejercicioId: {
    type: DataTypes.UUID, // Changed to UUID to match the primary key in Ejercicio
    allowNull: false,
  },
});

// Remove association here - we'll move it to the associations file

module.exports = Serie;
