import { body, validationResult } from 'express-validator';
import authService from '../services/authService.js';
import { generateToken } from '../middleware/auth.js';

class AuthController {
  // Validaciones para el login
  static loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 })
  ];

  // Validaciones para el registro

  /*
  static registerValidation = [
    body('nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido').isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('telefono').optional().isLength({ min: 10 }).withMessage('El teléfono debe tener al menos 10 dígitos')
  ];
  */

  // POST /api/auth/register
  static async register(req, res) {
    try {
      console.log('=== INICIO REGISTRO ===');
      console.log('Datos recibidos:', req.body);

      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Errores de validación:', errors.array());
        return res.status(400).json({ 
          message: 'Datos inválidos', 
          errors: errors.array() 
        });
      }

      const { nombre, apellido, email, password, telefono } = req.body;
      console.log('Verificando si el email ya existe:', email);

      // Verificar si el usuario ya existe
      const existingUser = await authService.findByEmail(email);
      if (existingUser) {
        console.log('Usuario ya existe');
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      console.log('Encriptando contraseña...');
      // Encriptar contraseña
      const hashedPassword = await authService.hashPassword(password);

      console.log('Creando usuario...');
      // Crear nuevo usuario
      const newUser = await authService.createUser({
        nombre,
        apellido,
        email,
        password: hashedPassword,
        telefono: telefono || null
      });

      console.log('Generando token...');
      // Generar token JWT
      const token = generateToken(newUser);

      console.log('Registro exitoso');
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: newUser.idPersona,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          email: newUser.email,
          telefono: newUser.telefono
        }
      });

    } catch (error) {
      console.error('=== ERROR EN REGISTRO ===');
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // POST /api/auth/login
  static async login(req, res) {
    try {
      console.log('=== INICIO LOGIN ===');
      console.log('Datos recibidos:', req.body);

      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Errores de validación:', errors.array());
        return res.status(400).json({ 
          message: 'Datos inválidos', 
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;
      console.log('Buscando usuario con email:', email);

      // Buscar usuario por email
      const foundUser = await authService.findByEmail(email);
      console.log('Usuario encontrado:', foundUser ? 'Sí' : 'No');
      
      if (!foundUser) {
        console.log('Usuario no encontrado');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      console.log('Verificando contraseña...');
      // Verificar contraseña 
      const isValidPassword = await authService.verifyPassword(password, foundUser.password);
      console.log('Contraseña válida:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Contraseña inválida');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      console.log('Generando token...');
      // Generar token JWT
      const token = generateToken(foundUser);

      console.log('Login exitoso');
      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: foundUser.idPersona,
          nombre: foundUser.nombre,
          apellido: foundUser.apellido,
          email: foundUser.email,
          telefono: foundUser.telefono
        }
      });

    } catch (error) {
      console.error('=== ERROR EN LOGIN ===');
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default AuthController;