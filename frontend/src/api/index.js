const API_URL = 'http://localhost:3001/api';

export const api = {
  // Obtener hallazgos con filtros opcionales (Página 6)
  getFindings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.status) params.append('status', filters.status);
    
    const response = await fetch(`${API_URL}/findings?${params.toString()}`);
    return response.json();
  },

  getFindingById: async (id) => {
    const response = await fetch(`${API_URL}/findings/${id}`);
    if (!response.ok) throw new Error('No se encontró el hallazgo');
    return response.json();
  },

  createFinding: async (findingData) => {
    const response = await fetch(`${API_URL}/findings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(findingData),
    });
    if (!response.ok) throw new Error('Error al crear el hallazgo');
    return response.json();
  },

  updateFinding: async (id, findingData) => {
    const response = await fetch(`${API_URL}/findings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(findingData),
    });
    if (!response.ok) throw new Error('Error al actualizar el hallazgo');
    return response.json();
  },

  deleteFinding: async (id) => {
    const response = await fetch(`${API_URL}/findings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el hallazgo');
    return true;
  },

  // Obtener métricas para la pantalla de reporte (Página 6)
  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`);
    return response.json();
  }
};