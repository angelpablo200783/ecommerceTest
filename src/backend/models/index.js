import sequelize from '../config/database.js';
import Persona from './Persona.js';
import Cliente from './Cliente.js';
import Administrador from './Administrador.js';
import Producto from './Producto.js';
import MetodoPago from './MetodoPago.js';
import Direccion from './Direccion.js';
import Pedido from './Pedido.js';
import DetallePedido from './DetallePedido.js';
import Pago from './Pago.js';

// Definir relaciones solo para las que existen
Persona.hasOne(Cliente, { foreignKey: 'idPersona' });
Cliente.belongsTo(Persona, { foreignKey: 'idPersona' });

// Relaciones para el proceso de compra
Cliente.hasMany(Direccion, { foreignKey: 'idCliente' });
Direccion.belongsTo(Cliente, { foreignKey: 'idCliente' });

Cliente.hasMany(Pedido, { foreignKey: 'idCliente' });
Pedido.belongsTo(Cliente, { foreignKey: 'idCliente' });

Pedido.hasMany(DetallePedido, { foreignKey: 'idPedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'idPedido' });

Producto.hasMany(DetallePedido, { foreignKey: 'idProducto' });
DetallePedido.belongsTo(Producto, { foreignKey: 'idProducto' });

Pedido.hasOne(Pago, { foreignKey: 'idPedido' });
Pago.belongsTo(Pedido, { foreignKey: 'idPedido' });

MetodoPago.hasMany(Pago, { foreignKey: 'idMetodoPago' });
Pago.belongsTo(MetodoPago, { foreignKey: 'idMetodoPago' });

MetodoPago.hasMany(Pedido, { foreignKey: 'idMetodoPago' });
Pedido.belongsTo(MetodoPago, { foreignKey: 'idMetodoPago' });

Direccion.hasMany(Pedido, { foreignKey: 'idDireccionEntrega' });
Pedido.belongsTo(Direccion, { foreignKey: 'idDireccionEntrega' });

// Sincronizar modelos con la base de datos
const syncModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (no forzar, solo si no existen)
    await sequelize.sync({ alter: false });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

export { 
  sequelize, 
  Persona, 
  Cliente, 
  Administrador, 
  Producto, 
  MetodoPago, 
  Direccion, 
  Pedido, 
  DetallePedido, 
  Pago, 
  syncModels 
};