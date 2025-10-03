import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cliente = sequelize.define('Cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'persona',
      key: 'idPersona'
    }
  },
  fechaDeRegistro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cliente',
  timestamps: false
});

export default Cliente;