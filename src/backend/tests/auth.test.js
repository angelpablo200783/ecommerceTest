import request from 'supertest';
import app from '../app.js';
import { Persona, Cliente, Administrador } from '../models/index.js';
import bcrypt from 'bcryptjs';

describe('Authentication', () => {
  let testUserId;
  let testAdminId;

  beforeEach(async () => {
    // Limpiar base de datos
    await Cliente.destroy({ where: {} });
    await Administrador.destroy({ where: {} });
    await Persona.destroy({ where: {} });
  });

  afterAll(async () => {
    // Limpiar después de todas las pruebas
    await Cliente.destroy({ where: {} });
    await Administrador.destroy({ where: {} });
    await Persona.destroy({ where: {} });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      const user = await Persona.create({
        nombre: 'Test',
        apellido: 'User',
        email: 'test@test.com',
        password: hashedPassword,
        telefono: '1234567890'
      });

      // Crear cliente
      await Cliente.create({
        idPersona: user.idPersona,
        fechaDeRegistro: new Date()
      });

      testUserId = user.idPersona;

      // Crear administrador de prueba
      const admin = await Administrador.create({
        nombre: 'Admin',
        apellido: 'Test',
        email: 'admin@test.com',
        password: 'adminpassword',
        telefono: '0987654321',
        departamento: 'IT',
        nivelAcceso: 1
      });

      testAdminId = admin.idAdministrador;
    });

    it('should login with valid user credentials', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'testpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.role).toBe('cliente');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should login with valid admin credentials', async () => {
      const loginData = {
        email: 'admin@test.com',
        password: 'adminpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});