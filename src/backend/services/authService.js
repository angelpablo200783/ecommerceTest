import bcrypt from 'bcryptjs';
import { Persona, Cliente, Administrador } from '../models/index.js';

class AuthService {
  // Buscar usuario por email (persona normal)
  async findByEmail(email) {
    try {
      const user = await Persona.findOne({
        where: { email }
      });
      return user;
    } catch (error) {
      console.error('Error en findByEmail:', error);
      throw new Error('Error al buscar usuario por email');
    }
  }

  // Buscar administrador por email
  async findAdminByEmail(email) {
    try {
      const admin = await Administrador.findOne({
        where: { email }
      });
      return admin;
    } catch (error) {
      console.error('Error en findAdminByEmail:', error);
      throw new Error('Error al buscar administrador por email');
    }
  }

  // Buscar usuario por ID
  async findById(id) {
    try {
      const user = await Persona.findByPk(id);
      return user;
    } catch (error) {
      console.error('Error en findById:', error);
      throw new Error('Error al buscar usuario por ID');
    }
  }

  // Verificar si es cliente
  async isCliente(idPersona) {
    try {
      const cliente = await Cliente.findOne({
        where: { idPersona }
      });
      return !!cliente;
    } catch (error) {
      console.error('Error en isCliente:', error);
      return false;
    }
  }

  // Crear nuevo usuario (cliente por defecto)
  async createUser(userData) {
    try {
      const user = await Persona.create(userData);
      
      // Crear registro de cliente por defecto
 
      await Cliente.create({
        idCliente: user.idPersona,
        fechaDeRegistro: new Date()
      }); 
      
      return user;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error('Error al crear usuario');
    }
  }

  // Crear administrador (sin encriptar contraseña)
  async createAdmin(userData, departamento = 'General', nivelAcceso = 1) {
    try {
      // Crear administrador con contraseña en texto plano
      const admin = await Administrador.create({
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        password: userData.password, // Sin encriptar
        telefono: userData.telefono,
        departamento,
        nivelAcceso
      });
      
      return admin;
    } catch (error) {
      console.error('Error al crear administrador:', error);
      throw new Error('Error al crear administrador');
    }
  }

  // Verificar contraseña (para usuarios normales - encriptada)
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Error al verificar contraseña');
    }
  }

  // Verificar contraseña de administrador (texto plano)
  async verifyAdminPassword(plainPassword, storedPassword) {
    try {
      return plainPassword === storedPassword;
    } catch (error) {
      throw new Error('Error al verificar contraseña de administrador');
    }
  }

  // Encriptar contraseña (solo para usuarios normales)
  async hashPassword(password) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error('Error al encriptar contraseña');
    }
  }
}

export default new AuthService();