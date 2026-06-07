import { Router } from 'express';
import { findingsController } from '../controllers/findingsController.js';

const router = Router();

// Rutas para los Hallazgos (CRUD)
router.get('/findings', findingsController.getAll);
router.get('/findings/:id', findingsController.getById);
router.post('/findings', findingsController.create);
router.put('/findings/:id', findingsController.update);
router.delete('/findings/:id', findingsController.delete);

// Ruta para las Estadísticas del Dashboard
router.get('/stats', findingsController.getStats);

export default router;