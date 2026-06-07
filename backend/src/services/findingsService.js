import { store } from '../store/index.js';

export const findingsService = {
  // Obtener todos los hallazgos aplicando filtros opcionales de estado y severidad
  getAll: (filters) => {
    let list = store.findAll();
    const { severity, status } = filters;

    if (severity) {
      list = list.filter(f => f.severity.toLowerCase() === severity.toLowerCase());
    }
    if (status) {
      list = list.filter(f => f.status.toLowerCase() === status.toLowerCase());
    }

    return list;
  },

  getById: (id) => {
    return store.findById(id);
  },

  create: (data) => {
    // Validaciones básicas de negocio 
    return store.create({
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: data.status,
      cvss: data.cvss ? parseFloat(data.cvss) : null
    });
  },

  update: (id, data) => {
    return store.update(id, data);
  },

  delete: (id) => {
    return store.delete(id);
  },

  // Genera el resumen para la pantalla de reporte (Dashboard)
  getStats: () => {
    const all = store.findAll();
    
    // Estructura por defecto para los contadores
    const stats = {
      bySeverity: { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 },
      byStatus: { Open: 0, "In Progress": 0, Resolved: 0 },
      total: all.length
    };

    all.forEach(f => {
      if (stats.bySeverity[f.severity] !== undefined) {
        stats.bySeverity[f.severity]++;
      }
      if (stats.byStatus[f.status] !== undefined) {
        stats.byStatus[f.status]++;
      }
    });

    return stats;
  }
};