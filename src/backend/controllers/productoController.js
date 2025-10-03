import { body, validationResult } from 'express-validator';
import { Producto } from '../models/index.js';

class ProductoController {
  // Validaciones para productos
  static productoValidation = [
    body('nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser mayor a 0'),
    body('cantidadDisponible').isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero mayor o igual a 0')
  ];

  // GET /api/productos
  static async getAll(req, res) {
    try {
      const productos = await Producto.findAll();
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // GET /api/productos/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      res.json(producto);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // POST /api/productos
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Datos inválidos', 
          errors: errors.array() 
        });
      }

      const producto = await Producto.create(req.body);
      res.status(201).json(producto);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // PUT /api/productos/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Datos inválidos', 
          errors: errors.array() 
        });
      }

      const [updated] = await Producto.update(req.body, {
        where: { idProducto: id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      const producto = await Producto.findByPk(id);
      res.json(producto);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // DELETE /api/productos/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Producto.destroy({
        where: { idProducto: id }
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default ProductoController;