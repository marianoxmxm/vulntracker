import { v4 as uuidv4 } from 'uuid';

// Este array simula nuestra base de datos en memoria
let findings = [];

// Función para cargar los datos por defecto (Seed Data) al levantar la app
export const seedDatabase = () => {
  findings = [
    {
      id: uuidv4(),
      title: "SQL Injection en Formulario de Login",
      description: "Se detectó que el parámetro 'username' no está sanitizado, permitiendo la inyección de comandos SQL y bypass de autenticación.",
      severity: "Critical",
      status: "Open",
      cvss: 9.8,
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: "Uso de Librería de Terceros Vulnerable",
      description: "El componente 'lodash' utilizado en el backend se encuentra en una versión desactualizada afectada por un Prototype Pollution.",
      severity: "Medium",
      status: "In Progress",
      cvss: 5.6,
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: "Exposición de Directorio Transacciones",
      description: "El servidor web tiene habilitado el listado de directorios en la ruta /backup, exponiendo archivos sensibles.",
      severity: "High",
      status: "Resolved",
      cvss: 7.5,
      createdAt: new Date().toISOString()
    }
  ];
  console.log(`[🚀 Store] Base de datos en memoria inicializada con ${findings.length} hallazgos semilla.`);
};

// Métodos del repositorio para interactuar con los datos
export const store = {
  findAll: () => findings,
  
  findById: (id) => findings.find(f => f.id === id),
  
  create: (findingData) => {
    const newFinding = {
      id: uuidv4(),
      ...findingData,
      createdAt: new Date().toISOString()
    };
    findings.push(newFinding);
    return newFinding;
  },
  
  update: (id, updatedData) => {
    const index = findings.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    // Mantenemos el ID y la fecha de creación originales
    findings[index] = {
      ...findings[index],
      ...updatedData,
      id: findings[index].id,
      createdAt: findings[index].createdAt
    };
    return findings[index];
  },
  
  delete: (id) => {
    const index = findings.findIndex(f => f.id === id);
    if (index === -1) return false;
    findings.splice(index, 1);
    return true;
  }
};