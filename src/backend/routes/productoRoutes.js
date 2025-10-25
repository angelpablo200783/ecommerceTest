import express from 'express';
import ProductoController from '../controllers/productoController.js';

const router = express.Router();

// GET /api/productos
router.get('/', ProductoController.getAll);

//GET /api/productos/categoria/:categoria
router.get('categoria/:categoria', ProductoController.getByCategoria);

// GET /api/productos/:id
router.get('/:id', ProductoController.getById);

// POST /api/productos
router.post('/', 
  ProductoController.productoValidation,
  ProductoController.create
);

// PUT /api/productos/:id
router.put('/:id', 
  ProductoController.productoValidation,
  ProductoController.update
);

// DELETE /api/productos/:id
router.delete('/:id', ProductoController.delete);

export default router;