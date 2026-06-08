import request from 'supertest';
import app from '../src/app.js';
import { seedDatabase } from '../src/store/index.js';

describe('=== VulnTracker API Endpoints Test Suite ===', () => {
  
  // Antes de cada test, reseteamos la base de datos en memoria para que esté limpia y predecible
  beforeEach(() => {
    seedDatabase();
  });

  describe('GET /api/findings', () => {
    it('Debería retornar todos los hallazgos semilla con estado 200', async () => {
      const res = await request(app).get('/api/findings');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });

    it('Debería filtrar correctamente por ?severity=High', async () => {
      const res = await request(app).get('/api/findings?severity=High');
      expect(res.statusCode).toBe(200);
      expect(res.body.every(f => f.severity === 'High')).toBe(true);
    });

    it('Debería filtrar correctamente por ?status=Open', async () => {
      const res = await request(app).get('/api/findings?status=Open');
      expect(res.statusCode).toBe(200);
      expect(res.body.every(f => f.status === 'Open')).toBe(true);
    });
  });

  describe('GET /api/findings/:id', () => {
    it('Debería retornar un hallazgo existente por su ID', async () => {
      // Obtenemos primero los existentes para sacar un ID real
      const listRes = await request(app).get('/api/findings');
      const targetId = listRes.body[0].id;

      const res = await request(app).get(`/api/findings/${targetId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(targetId);
      expect(res.body).toHaveProperty('title');
    });

    it('Debería retornar 404 si el ID no existe', async () => {
      const res = await request(app).get('/api/findings/id-inexistente-123');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/findings', () => {
    it('Debería crear un nuevo hallazgo si los datos son válidos (201)', async () => {
      const newFinding = {
        title: "XSS Reflejado en buscador principal",
        description: "El parámetro 'q' se renderiza directamente en el DOM sin codificar.",
        severity: "High",
        status: "Open",
        cvss: 8.2
      };

      const res = await request(app)
        .post('/api/findings')
        .send(newFinding);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newFinding.title);
    });

    it('Debería retornar 400 Bad Request si falta el título', async () => {
      const invalidFinding = {
        description: "Sin título",
        severity: "Low",
        status: "Open"
      };

      const res = await request(app)
        .post('/api/findings')
        .send(invalidFinding);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Campos requeridos faltantes');
    });

    it('Debería retornar 400 Bad Request si la severidad no pertenece al enum', async () => {
      const invalidFinding = {
        title: "Test Severidad",
        description: "Descripción de prueba",
        severity: "Super-Critical-Invalida", // Error
        status: "Open"
      };

      const res = await request(app)
        .post('/api/findings')
        .send(invalidFinding);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Severidad inválida');
    });
  });

  describe('PUT /api/findings/:id', () => {
    it('Debería actualizar los campos enviados de un hallazgo existente (200)', async () => {
      const listRes = await request(app).get('/api/findings');
      const target = listRes.body[0];

      const updatedData = {
        status: "Resolved",
        title: "Título modificado mediante PUT"
      };

      const res = await request(app)
        .put(`/api/findings/${target.id}`)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("Resolved");
      expect(res.body.title).toBe("Título modificado mediante PUT");
      expect(res.body.id).toBe(target.id); // El ID se tiene que mantener intacto
    });

    it('Debería retornar 404 al intentar actualizar un ID inexistente', async () => {
      const res = await request(app)
        .put('/api/findings/id-falso')
        .send({ title: "Cambio" });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/findings/:id', () => {
    it('Debería eliminar el hallazgo y responder con 204 No Content', async () => {
      const listRes = await request(app).get('/api/findings');
      const targetId = listRes.body[0].id;

      const res = await request(app).delete(`/api/findings/${targetId}`);
      expect(res.statusCode).toBe(204);

      // Verificamos que realmente ya no exista haciendo un GET
      const verifyRes = await request(app).get(`/api/findings/${targetId}`);
      expect(verifyRes.statusCode).toBe(404);
    });

    it('Debería retornar 404 al intentar eliminar un ID inexistente', async () => {
      const res = await request(app).delete('/api/findings/id-falso');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/stats', () => {
    it('Debería calcular y agrupar correctamente las métricas para el Dashboard', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('bySeverity');
      expect(res.body).toHaveProperty('byStatus');
      expect(res.body.total).toBe(3);
      expect(res.body.bySeverity.Critical).toBe(1); // El SQL Injection por defecto
    });
  });

});