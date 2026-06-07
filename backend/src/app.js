import express from 'express';
import findingsRoutes from './routes/findingsRoutes.js';
import { seedDatabase } from './store/index.js';

const app = express();
const PORT = 3001; // Usamos el puerto 3001 definidos en scripts globales (Página 9)

// Middleware para parsear bodies en formato JSON
app.use(express.json());

// Middleware para evitar problemas de CORS cuando React intente llamarnos desde el puerto 5173
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Inicializar base de datos con los Seed Data 
seedDatabase();

// Enlazar las rutas de la API bajo el prefijo /api
app.use('/api', findingsRoutes);

// Levantar el servidor únicamente si el archivo se ejecuta directamente 
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[🌐 Server] VulnTracker Backend corriendo en http://localhost:${PORT}`);
  });
}

export default app;