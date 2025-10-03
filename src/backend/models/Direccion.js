import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Direccion = sequelize.define('Direccion', {
  idDireccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cliente',
      key: 'idCliente'
    }
  },
  alias: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  calle: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  ciudad: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  codigoPostal: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  pais: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  telefonoContacto: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'direccion',
  timestamps: false
});

export default Direccion;