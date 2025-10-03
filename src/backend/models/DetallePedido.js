import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetallePedido = sequelize.define('DetallePedido', {
  idDetallePedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedido',
      key: 'idPedido'
    }
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'producto',
      key: 'idProducto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detallepedido',
  timestamps: false
});

export default DetallePedido;