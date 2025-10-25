import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Producto = sequelize.define('Producto', {
  idProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cantidadDisponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  enStock: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  imagen: {
    type: DataTypes.TEXT('long'), // Para almacenar base64
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: true
  }

}, {
  tableName: 'producto',
  timestamps: false
});

export default Producto;