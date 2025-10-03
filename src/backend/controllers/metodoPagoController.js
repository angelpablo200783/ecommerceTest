import { MetodoPago } from '../models/index.js';

class MetodoPagoController {
  // GET /api/metodos-pago
  static async getAll(req, res) {
    try {
      const metodos = await MetodoPago.findAll();
      res.json(metodos);
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default MetodoPagoController;