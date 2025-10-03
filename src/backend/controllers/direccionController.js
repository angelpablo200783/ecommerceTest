import { body, validationResult } from 'express-validator';
import { Direccion } from '../models/index.js';

class DireccionController {
  // Validaciones para direcciones
  static direccionValidation = [
    body('alias').isLength({ min: 2 }).withMessage('El alias debe tener al menos 2 caracteres'),
    body('calle').isLength({ min: 5 }).withMessage('La calle debe tener al menos 5 caracteres'),
    body('ciudad').isLength({ min: 2 }).withMessage('La ciudad debe tener al menos 2 caracteres'),
    body('estado').isLength({ min: 2 }).withMessage('El estado debe tener al menos 2 caracteres'),
    body('pais').isLength({ min: 2 }).withMessage('El país debe tener al menos 2 caracteres')
  ];

  // GET /api/direcciones/:idCliente
  static async getByCliente(req, res) {
    try {
      const { idCliente } = req.params;
      const direcciones = await Direccion.findAll({
        where: { idCliente }
      });
      res.json(direcciones);
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // POST /api/direcciones
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Datos inválidos', 
          errors: errors.array() 
        });
      }

      const direccion = await Direccion.create(req.body);
      res.status(201).json(direccion);
    } catch (error) {
      console.error('Error al crear dirección:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default DireccionController;