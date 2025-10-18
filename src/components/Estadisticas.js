// src/components/Estadisticas.js
"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Estadisticas({ animales, producciones, nacimientos, sanidades }) {

  // ===== Datos para gráfico de Producción por animal =====
  const etiquetasProduccion = producciones.map(p => {
    const animal = animales.find(a => a.id === p.animalId);
    return animal ? animal.nombre : p.animalId;
  });

  const cantidadesProduccion = producciones.map(p => Number(p.cantidad || 0));

  const dataProduccion = {
    labels: etiquetasProduccion,
    datasets: [
      {
        label: "Producción",
        data: cantidadesProduccion,
        backgroundColor: "rgba(79,70,229,0.6)",
        borderColor: "rgba(79,70,229,1)",
        borderWidth: 1,
      }
    ]
  };

  const opcionesProduccion = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: "Producción por Animal" } } };

  // ===== Datos para gráfico de Nacimientos =====
  const etiquetasNacimientos = nacimientos.map(n => {
    const madre = animales.find(a => a.id === n.madreId);
    return madre ? madre.nombre : n.madreId;
  });

  const cantidadesNacimientos = nacimientos.map(n => Number(n.cantidad || 0));

  const dataNacimientos = {
    labels: etiquetasNacimientos,
    datasets: [
      {
        label: "Crías",
        data: cantidadesNacimientos,
        backgroundColor: "rgba(16,185,129,0.6)",
        borderColor: "rgba(16,185,129,1)",
        borderWidth: 1,
      }
    ]
  };

  const opcionesNacimientos = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: "Nacimientos por Madre" } } };

  // ===== Datos para gráfico de Sanidades (Vacunas) =====
  const etiquetasSanidad = sanidades.map(s => {
    const animal = animales.find(a => a.id === s.animalId);
    return animal ? animal.nombre : s.animalId;
  });

  const cantidadesSanidad = sanidades.map(s => 1); // cada vacuna cuenta como 1

  const dataSanidad = {
    labels: etiquetasSanidad,
    datasets: [
      {
        label: "Vacunas aplicadas",
        data: cantidadesSanidad,
        backgroundColor: "rgba(239,68,68,0.6)",
        borderColor: "rgba(239,68,68,1)",
        borderWidth: 1,
      }
    ]
  };

  const opcionesSanidad = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: "Vacunas aplicadas por Animal" } } };

  return (
    <div>
      <h2 style={{ marginBottom: "20px", color: "#4F46E5", fontWeight: "700" }}>📊 Estadísticas</h2>
      <div style={{ marginBottom: "40px" }}>
        <Bar data={dataProduccion} options={opcionesProduccion} />
      </div>
      <div style={{ marginBottom: "40px" }}>
        <Bar data={dataNacimientos} options={opcionesNacimientos} />
      </div>
      <div style={{ marginBottom: "40px" }}>
        <Bar data={dataSanidad} options={opcionesSanidad} />
      </div>
    </div>
  );
}
