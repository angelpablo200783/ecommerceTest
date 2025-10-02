import bcrypt from 'bcryptjs';
import { Persona } from '../models/index.js';

class AuthService {
  // Buscar usuario por email
  async findByEmail(email) {
    try {
      const user = await Persona.findOne({
        where: { email }
      });
      return user;
    } catch (error) {
      throw new Error('Error al buscar usuario por email');
    }
  }

  // Buscar usuario por ID
  async findById(id) {
    try {
      const user = await Persona.findByPk(id);
      return user;
    } catch (error) {
      throw new Error('Error al buscar usuario por ID');
    }
  }

  // Verificar contraseña
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Error al verificar contraseña');
    }
  }

  // Encriptar contraseña
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