import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', 
  AuthController.loginValidation,
  AuthController.login
);

export default router;