import { body, validationResult } from 'express-validator';
import { Pedido, DetallePedido, Pago } from '../models/index.js';

class PedidoController {
  // Validaciones para pedidos
  static pedidoValidation = [
    body('idCliente').isInt().withMessage('ID de cliente inválido'),
    body('idMetodoPago').isInt().withMessage('ID de método de pago inválido'),
    body('idDireccionEntrega').isInt().withMessage('ID de dirección inválido'),
    body('total').isFloat({ min: 0 }).withMessage('El total debe ser mayor a 0')
  ];

  // POST /api/pedidos
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Datos inválidos', 
          errors: errors.array() 
        });
      }

      const { idCliente, idMetodoPago, idDireccionEntrega, total, productos } = req.body;

      // Crear el pedido
      const pedido = await Pedido.create({
        idCliente,
        idMetodoPago,
        idDireccionEntrega,
        fechaPedido: new Date(),
        estadoPedido: 'Pendiente',
        total
      });

      // Crear los detalles del pedido
      for (const producto of productos) {
        await DetallePedido.create({
          idPedido: pedido.idPedido,
          idProducto: producto.idProducto,
          cantidad: producto.cantidad,
          precioUnitario: producto.precioUnitario
        });
      }

      // Crear el pago
      await Pago.create({
        idPedido: pedido.idPedido,
        idMetodoPago,
        montoTotal: total,
        fechaPago: new Date(),
        estadoPago: 'Pendiente',
        detallesTransaccion: 'Pago simulado'
      });

      res.status(201).json({
        message: 'Pedido creado exitosamente',
        pedido: {
          idPedido: pedido.idPedido,
          total: pedido.total,
          estado: pedido.estadoPedido
        }
      });
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default PedidoController;