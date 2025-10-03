import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pago = sequelize.define('Pago', {
  idPago: {
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
  idMetodoPago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'metodopago',
      key: 'idMetodoPago'
    }
  },
  montoTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estadoPago: {
    type: DataTypes.ENUM('Pendiente', 'Procesado', 'Rechazado'),
    allowNull: false,
    defaultValue: 'Pendiente'
  },
  detallesTransaccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'pago',
  timestamps: false
});

export default Pago;