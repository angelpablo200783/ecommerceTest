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
  static registerValidation = [
    body('nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido').isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('telefono').optional().isLength({ min: 10 }).withMessage('El teléfono debe tener al menos 10 dígitos')
  ];

  // Validaciones para crear administrador
  static adminValidation = [
    body('nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido').isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('telefono').optional().isLength({ min: 10 }).withMessage('El teléfono debe tener al menos 10 dígitos'),
    body('departamento').optional().isLength({ min: 2 }).withMessage('El departamento debe tener al menos 2 caracteres'),
    body('nivelAcceso').optional().isInt({ min: 1 }).withMessage('El nivel de acceso debe ser un número entero mayor a 0')
  ];

  // POST /api/auth/create-admin
  static async createAdmin(req, res) {
    try {
      console.log('=== CREAR ADMINISTRADOR ===');
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

      const { nombre, apellido, email, password, telefono, departamento, nivelAcceso } = req.body;
      console.log('Verificando si el email ya existe:', email);

      // Verificar si el email ya existe en persona o administrador
      const existingUser = await authService.findByEmail(email);
      const existingAdmin = await authService.findAdminByEmail(email);
      
      if (existingUser || existingAdmin) {
        console.log('Email ya existe');
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      console.log('Creando administrador...');
      // Crear nuevo administrador
      const newAdmin = await authService.createAdmin({
        nombre,
        apellido,
        email,
        password,
        telefono: telefono || null
      }, departamento || 'General', nivelAcceso || 1);

      console.log('Administrador creado exitosamente');
      res.status(201).json({
        message: 'Administrador creado exitosamente',
        user: {
          id: newAdmin.idAdministrador,
          nombre: newAdmin.nombre,
          apellido: newAdmin.apellido,
          email: newAdmin.email,
          telefono: newAdmin.telefono,
          role: 'admin'
        }
      });

    } catch (error) {
      console.error('=== ERROR AL CREAR ADMINISTRADOR ===');
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

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
      const existingAdmin = await authService.findAdminByEmail(email);
      
      if (existingUser || existingAdmin) {
        console.log('Usuario ya existe');
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      console.log('Encriptando contraseña...');
      // Encriptar contraseña
      const hashedPassword = await authService.hashPassword(password);

      console.log('Creando usuario...');
      // Crear nuevo usuario (cliente por defecto)
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
          telefono: newUser.telefono,
          role: 'cliente'
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

      // Buscar primero en administradores
      let foundUser = await authService.findAdminByEmail(email);
      let userRole = 'admin';
      
      // Si no es administrador, buscar en usuarios normales
      if (!foundUser) {
        foundUser = await authService.findByEmail(email);
        userRole = 'cliente';
      }
      
      console.log('Usuario encontrado:', foundUser ? 'Sí' : 'No');
      
      if (!foundUser) {
        console.log('Usuario no encontrado');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      console.log('Verificando contraseña...');
      // Verificar contraseña según el tipo de usuario
      let isValidPassword = false;
      
      if (userRole === 'admin') {
        // Para administradores: contraseña en texto plano
        isValidPassword = await authService.verifyAdminPassword(password, foundUser.password);
      } else {
        // Para usuarios normales: contraseña encriptada
        isValidPassword = await authService.verifyPassword(password, foundUser.password);
      }
      
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
          id: foundUser.idPersona || foundUser.idAdministrador,
          nombre: foundUser.nombre,
          apellido: foundUser.apellido,
          email: foundUser.email,
          telefono: foundUser.telefono,
          role: userRole
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