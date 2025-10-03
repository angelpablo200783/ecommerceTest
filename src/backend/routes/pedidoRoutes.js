import express from 'express';
import PedidoController from '../controllers/pedidoController.js';

const router = express.Router();

// POST /api/pedidos
router.post('/', 
  PedidoController.pedidoValidation,
  PedidoController.create
);

export default router;