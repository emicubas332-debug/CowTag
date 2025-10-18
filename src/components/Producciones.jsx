"use client";

import { useState } from "react";

export default function Producciones({ producciones = [], animales = [], guardarProduccion }) {
  const [form, setForm] = useState({ animalId: "", fecha: "", tipoProduccion: "", cantidad: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => setForm({ animalId: "", fecha: "", tipoProduccion: "", cantidad: "" });

  const handleSubmit = async () => {
    if (!form.animalId || !form.fecha || !form.tipoProduccion || !form.cantidad) {
      alert("Por favor completa todos los campos");
      return;
    }
    await guardarProduccion(form);
    resetForm();
  };

  // Función para calcular litros de leche de hoy
  const litrosHoy = () => {
    const hoy = new Date().toISOString().split("T")[0];
    return producciones
      .filter(p => p.tipoProduccion.toLowerCase() === "leche" && p.fecha === hoy)
      .reduce((acc, p) => acc + Number(p.cantidad || 0), 0);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Producciones</h2>

      <div className="mb-4 text-green-800 font-semibold">
        Total litros de leche hoy: {litrosHoy()} L
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          name="animalId"
          value={form.animalId}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        >
          <option value="">Seleccionar animal</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>
              {a.nombre} ({a.tipo || "—"})
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Tipo Producción"
          name="tipoProduccion"
          value={form.tipoProduccion}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Cantidad"
          name="cantidad"
          value={form.cantidad}
          onChange={onChange}
          className="border p-2 rounded w-24"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2">Animal</th>
              <th className="px-4 py-2">Tipo Animal</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo Producción</th>
              <th className="px-4 py-2">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {producciones.map(p => {
              const animal = animales.find(a => a.id === p.animalId) || {};
              return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{animal.nombre || "-"}</td>
                  <td className="px-4 py-2">{animal.tipo || "-"}</td>
                  <td className="px-4 py-2">{p.fecha}</td>
                  <td className="px-4 py-2">{p.tipoProduccion}</td>
                  <td className="px-4 py-2">{p.cantidad}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
