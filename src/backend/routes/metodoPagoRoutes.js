import express from 'express';
import MetodoPagoController from '../controllers/metodoPagoController.js';

const router = express.Router();

// GET /api/metodos-pago
router.get('/', MetodoPagoController.getAll);

export default router;