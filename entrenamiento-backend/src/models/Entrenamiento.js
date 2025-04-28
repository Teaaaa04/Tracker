const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Entrenamiento = sequelize.define("Entrenamiento", {
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  entrenamientoId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

// Remove the association here - we'll set it up in a separate file

module.exports = Entrenamiento;
