import { findingsService } from '../services/findingsService.js';

export const findingsController = {
  // GET /api/findings
  getAll: (req, res) => {
    try {
      const { severity, status } = req.query;
      const findings = findingsService.getAll({ severity, status });
      return res.status(200).json(findings);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // GET /api/findings/:id
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const finding = findingsService.getById(id);
      
      if (!finding) {
        return res.status(404).json({ error: "Hallazgo no encontrado" });
      }
      
      return res.status(200).json(finding);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // POST /api/findings
  create: (req, res) => {
    try {
      const { title, description, severity, status, cvss } = req.body;

      // Validación simple según tu rúbrica de Bad Request (Página 7 y 8)
      if (!title || !description || !severity || !status) {
        return res.status(400).json({ error: "Campos requeridos faltantes (title, description, severity, status)" });
      }

      // Validar valores permitidos del enum (Página 5)
      const validSeverities = ["Critical", "High", "Medium", "Low", "Info"];
      const validStatuses = ["Open", "In Progress", "Resolved"];

      if (!validSeverities.includes(severity)) {
        return res.status(400).json({ error: "Severidad inválida" });
      }
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      const newFinding = findingsService.create({ title, description, severity, status, cvss });
      return res.status(201).json(newFinding);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // PUT /api/findings/:id
  update: (req, res) => {
    try {
      const { id } = req.params;
      const updated = findingsService.update(id, req.body);

      if (!updated) {
        return res.status(404).json({ error: "Hallazgo no encontrado para actualizar" });
      }

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // DELETE /api/findings/:id
  delete: (req, res) => {
    try {
      const { id } = req.params;
      const deleted = findingsService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Hallazgo no encontrado para eliminar" });
      }

      return res.status(204).send(); // 204 No Content no lleva cuerpo
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // GET /api/stats
  getStats: (req, res) => {
    try {
      const stats = findingsService.getStats();
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};