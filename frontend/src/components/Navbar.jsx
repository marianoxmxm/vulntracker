import { Link } from 'react-router-dom';

export default function Navbar() {
  const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e1e2f', color: '#fff' },
    logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#00d2d3', textDecoration: 'none' },
    links: { display: 'flex', gap: '1.5rem' },
    link: { color: '#fff', textDecoration: 'none', fontWeight: '500' }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛡️ VulnTracker</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>📊 Dashboard</Link>
        <Link to="/findings" style={styles.link}>🐛 Hallazgos (CRUD)</Link>
      </div>
    </nav>
  );
}