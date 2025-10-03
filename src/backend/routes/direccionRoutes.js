import express from 'express';
import DireccionController from '../controllers/direccionController.js';

const router = express.Router();

// GET /api/direcciones/:idCliente
router.get('/:idCliente', DireccionController.getByCliente);

// POST /api/direcciones
router.post('/', 
  DireccionController.direccionValidation,
  DireccionController.create
);

export default router;