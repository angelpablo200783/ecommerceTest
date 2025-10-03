import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { syncModels } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import metodoPagoRoutes from './routes/metodoPagoRoutes.js';
import direccionRoutes from './routes/direccionRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/metodos-pago', metodoPagoRoutes);
app.use('/api/direcciones', direccionRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del ecommerce funcionando correctamente' });
});

// Inicializar base de datos
syncModels();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}`);
});

export default app;