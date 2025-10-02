import sequelize from '../config/database.js';
import Persona from './Persona.js';

// Sincronizar modelos con la base de datos
const syncModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (no forzar, solo si no existen)
    await sequelize.sync({ alter: false });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

export { sequelize, Persona, syncModels };