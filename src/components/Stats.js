"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Stats({ animales, producciones }) {
  // Agrupar producciones por tipo
  const produccionPorTipo = producciones.reduce((acc, p) => {
    const tipo = p.tipoProduccion || "Desconocido";
    acc[tipo] = (acc[tipo] || 0) + Number(p.cantidad || 0);
    return acc;
  }, {});

  // Agrupar producciones por animal
  const produccionPorAnimal = producciones.reduce((acc, p) => {
    const animal = animales.find((a) => a.id === p.animalId)?.nombre || "Sin nombre";
    acc[animal] = (acc[animal] || 0) + Number(p.cantidad || 0);
    return acc;
  }, {});

  const dataPorTipo = Object.entries(produccionPorTipo).map(([tipo, cantidad]) => ({
    tipo,
    cantidad,
  }));

  const dataPorAnimal = Object.entries(produccionPorAnimal).map(([animal, cantidad]) => ({
    animal,
    cantidad,
  }));

  // Contar animales por sexo
  const conteoSexo = animales.reduce(
    (acc, a) => {
      if (a.sexo === "Macho") acc.macho += 1;
      else if (a.sexo === "Hembra") acc.hembra += 1;
      else acc.desconocido += 1;
      return acc;
    },
    { macho: 0, hembra: 0, desconocido: 0 }
  );

  const dataSexo = [
    { sexo: "Hembra", cantidad: conteoSexo.hembra },
    { sexo: "Macho", cantidad: conteoSexo.macho },
  ];

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9"];

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    padding: "10px",
    width: "300px",
    height: "280px",
    boxSizing: "border-box",
  };

  const titleStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#2563eb",
  };

  const noDataStyle = {
    color: "#555",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "50px",
  };

  return (
    <div style={containerStyle}>
      {/* Producción por tipo */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>🥛 Producción por tipo</h2>
        {dataPorTipo.length === 0 ? (
          <p style={noDataStyle}>No hay datos suficientes</p>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={dataPorTipo}
                dataKey="cantidad"
                nameKey="tipo"
                outerRadius={60}
                innerRadius={30}
                label
              >
                {dataPorTipo.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Producción por animal */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>🐄 Producción por animal</h2>
        {dataPorAnimal.length === 0 ? (
          <p style={noDataStyle}>No hay datos disponibles</p>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dataPorAnimal}>
              <XAxis dataKey="animal" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Conteo de animales por sexo */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>👩‍🌾 Conteo de vacas</h2>
        {animales.length === 0 ? (
          <p style={noDataStyle}>No hay animales registrados</p>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={dataSexo}
                dataKey="cantidad"
                nameKey="sexo"
                outerRadius={60}
                innerRadius={30}
                label
              >
                {dataSexo.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
