import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Findings() {
  const [findings, setFindings] = useState([]);
  const [filters, setFilters] = useState({ severity: '', status: '' });
  
  // Estado para el formulario (sirve tanto para Crear como para Editar)
  const [formData, setFormData] = useState({ id: null, title: '', description: '', severity: 'Medium', status: 'Open', cvss: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Cargar hallazgos aplicando filtros cuando cambien
  useEffect(() => {
    api.getFindings(filters)
      .then(data => setFindings(data))
      .catch(err => console.error(err));
  }, [filters]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Enviar formulario (Guardar o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        status: formData.status,
        cvss: formData.cvss ? parseFloat(formData.cvss) : null
      };

      if (isEditing) {
        await api.updateFinding(formData.id, payload);
      } else {
        await api.createFinding(payload);
      }

      // Resetear formulario y recargar lista
      setFormData({ id: null, title: '', description: '', severity: 'Medium', status: 'Open', cvss: '' });
      setIsEditing(false);
      const updatedList = await api.getFindings(filters);
      setFindings(updatedList);
    } catch (error) {
      alert(error.message);
    }
  };

  // Cargar datos en el formulario para editar
  const handleEdit = (finding) => {
    setIsEditing(true);
    setFormData({
      id: finding.id,
      title: finding.title,
      description: finding.description,
      severity: finding.severity,
      status: finding.status,
      cvss: finding.cvss || ''
    });
  };

  // Eliminar hallazgo
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este hallazgo de seguridad?")) {
      await api.deleteFinding(id);
      setFindings(findings.filter(f => f.id !== id));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🐛 Gestión de Hallazgos (CRUD)</h1>

      {/* Sección Formulario */}
      <div style={{ background: '#1e1e2f', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #323238' }}>
        <h3>{isEditing ? '📝 Editar Hallazgo' : '➕ Registrar Nuevo Hallazgo'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input type="text" name="title" placeholder="Título de la vulnerabilidad" value={formData.title} onChange={handleInputChange} style={{ flex: 2 }} required />
            <input type="number" name="cvss" placeholder="CVSS Score (0-10)" step="0.1" min="0" max="10" value={formData.cvss} onChange={handleInputChange} style={{ flex: 1 }} />
          </div>
          
          <textarea name="description" placeholder="Descripción detallada de la vulnerabilidad y mitigación..." rows="3" value={formData.description} onChange={handleInputChange} required />
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select name="severity" value={formData.severity} onChange={handleInputChange} style={{ flex: 1 }}>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Info">Info</option>
            </select>
            
            <select name="status" value={formData.status} onChange={handleInputChange} style={{ flex: 1 }}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: null, title: '', description: '', severity: 'Medium', status: 'Open', cvss: '' }); }} style={{ background: '#4e4e54', color: '#fff' }}>
                Cancelar
              </button>
            )}
            <button type="submit" style={{ background: '#00d2d3', color: '#000' }}>
              {isEditing ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>

      {/* Sección Filtros en Tiempo Real */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <span>Filtrar por:</span>
        <select name="severity" value={filters.severity} onChange={handleFilterChange}>
          <option value="">Todas las severidades</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Info">Info</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Todos los estados</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Tabla de Resultados */}
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Severidad</th>
            <th>Estado</th>
            <th>CVSS</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {findings.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>No se encontraron hallazgos con los filtros seleccionados.</td></tr>
          ) : (
            findings.map(f => (
              <tr key={f.id}>
                <td>
                  <strong>{f.title}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.25rem' }}>{f.description}</div>
                </td>
                <td>{f.severity}</td>
                <td>{f.status}</td>
                <td>{f.cvss ? f.cvss.toFixed(1) : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(f)} style={{ background: '#ffdb4d', color: '#000', marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}>Editar</button>
                  <button onClick={() => handleDelete(f.id)} style={{ background: '#ff4d4d', color: '#fff', padding: '0.25rem 0.5rem' }}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}