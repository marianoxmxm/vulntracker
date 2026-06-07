import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error("Error al cargar estadísticas:", err));
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Cargando métricas del sistema...</div>;

  const styles = {
    container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1.5rem' },
    card: { background: '#1e1e2f', padding: '1.5rem', borderRadius: '8px', border: '1px solid #323238' },
    badge: { display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', marginRight: '0.5rem' },
    totalNum: { fontSize: '3rem', fontWeight: 'bold', color: '#00d2d3', margin: '0' }
  };

  // Colores para las severidades del dominio de pentesting
  const severityColors = {
    Critical: '#ff4d4d',
    High: '#ff944d',
    Medium: '#ffdb4d',
    Low: '#4dff4d',
    Info: '#4da6ff'
  };

  return (
    <div style={styles.container}>
      <h1>📊 Dashboard de Seguridad</h1>
      <p>Métricas consolidadas de las auditorías y vulnerabilidades de la plataforma.</p>

      <div style={styles.grid}>
        {/* Tarjeta del Total */}
        <div style={styles.card}>
          <h3>Total de Hallazgos</h3>
          <p style={styles.totalNum}>{stats.total}</p>
          <p style={{ color: '#888' }}>Vulnerabilidades registradas en memoria</p>
        </div>

        {/* Distribución por Severidad */}
        <div style={styles.card}>
          <h3>Por Severidad</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(stats.bySeverity).map(([sev, count]) => (
              <li key={sev} style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <span style={{ ...styles.badge, backgroundColor: severityColors[sev], color: '#000' }}>
                    {sev}
                  </span>
                </span>
                <strong style={{ fontSize: '1.2rem' }}>{count}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Distribución por Estado */}
        <div style={styles.card}>
          <h3>Por Estado</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <li key={status} style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>🔹 {status}</span>
                <strong style={{ fontSize: '1.2rem', color: '#00d2d3' }}>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}