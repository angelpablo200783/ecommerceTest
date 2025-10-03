import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
  idPedido: {
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
  idMetodoPago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'metodopago',
      key: 'idMetodoPago'
    }
  },
  idDireccionEntrega: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'direccion',
      key: 'idDireccion'
    }
  },
  fechaPedido: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estadoPedido: {
    type: DataTypes.ENUM('Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Pendiente'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'pedido',
  timestamps: false
});

export default Pedido;