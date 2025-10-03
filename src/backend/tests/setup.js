import { sequelize } from '../models/index.js';

// Configurar base de datos para pruebas
beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});