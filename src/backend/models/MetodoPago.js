import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MetodoPago = sequelize.define('MetodoPago', {
  idMetodoPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'metodopago',
  timestamps: false
});

export default MetodoPago;