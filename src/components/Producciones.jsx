"use client";

import { useState } from "react";

export default function Producciones({ producciones = [], animales = [], guardarProduccion }) {
  const [form, setForm] = useState({ animalido: "", fecha: "", tipoProduccion: "", cantidad: "" });
  const [editId, setEditId] = useState(null); // Para editar
  const [filtroAnimal, setFiltroAnimal] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => {
    setForm({ animalido: "", fecha: "", tipoProduccion: "", cantidad: "" });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!form.animalido || !form.fecha || !form.tipoProduccion || !form.cantidad) {
      alert("Por favor completa todos los campos");
      return;
    }

    const nuevaProduccion = { ...form, cantidad: Number(form.cantidad) };

    if (editId) {
      // Editar producción existente
      guardarProduccion({ ...nuevaProduccion, id: editId, editar: true });
    } else {
      // Agregar nueva
      guardarProduccion(nuevaProduccion);
    }

    resetForm();
  };

  const handleEditar = (p) => {
    setForm({ animalido: p.animalido, fecha: p.fecha, tipoProduccion: p.tipoProduccion, cantidad: p.cantidad });
    setEditId(p.id);
  };

  const handleEliminar = (id) => {
    if (confirm("¿Eliminar esta producción?")) {
      guardarProduccion({ id, eliminar: true });
    }
  };

  // Filtrar producciones
  const produccionesFiltradas = producciones.filter(p => {
    const animalMatch = filtroAnimal ? p.animalido === filtroAnimal : true;
    const fechaMatch = filtroFecha ? p.fecha === filtroFecha : true;
    return animalMatch && fechaMatch;
  });

  // Litros de leche hoy
  const litrosHoy = () => {
    const hoy = new Date().toISOString().split("T")[0];
    return producciones
      .filter(p => p.tipoProduccion.toLowerCase() === "leche" && p.fecha === hoy)
      .reduce((acc, p) => acc + Number(p.cantidad || 0), 0);
  };

  // Resumen por tipo de producción
  const resumenProduccion = producciones.reduce((acc, p) => {
    acc[p.tipoProduccion] = (acc[p.tipoProduccion] || 0) + Number(p.cantidad);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-xl max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">Producciones</h2>

      {/* Indicador de litros hoy */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-md flex justify-between items-center">
        <span className="text-lg font-semibold text-green-700">Litros de leche hoy:</span>
        <span className="text-2xl font-bold text-green-900">{litrosHoy()} L</span>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={filtroAnimal}
          onChange={(e) => setFiltroAnimal(e.target.value)}
          className="border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Filtrar por animal</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>

        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Formulario agregar/editar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-white p-4 rounded-xl shadow-md">
        <select
          name="animalido"
          value={form.animalido}
          onChange={onChange}
          className="border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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
          className="border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <select
          name="tipoProduccion"
          value={form.tipoProduccion}
          onChange={onChange}
          className="border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Seleccionar tipo</option>
          <option value="leche">Leche</option>
          <option value="estandar">Estándar</option>
          <option value="buena">Buena</option>
          <option value="muy buena">Muy buena</option>
          <option value="mala">Mala</option>
          <option value="excelente">Excelente</option>
        </select>

        <input
          type="number"
          placeholder="Cantidad"
          name="cantidad"
          value={form.cantidad}
          onChange={onChange}
          className="border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg p-3 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {editId ? "Guardar cambios" : "Agregar"}
        </button>
      </div>

      {/* Tabla de producciones */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-green-600 text-white rounded-t-lg">
            <tr>
              <th className="px-6 py-3 font-medium">Animal</th>
              <th className="px-6 py-3 font-medium">Tipo Animal</th>
              <th className="px-6 py-3 font-medium">Fecha</th>
              <th className="px-6 py-3 font-medium">Tipo Producción</th>
              <th className="px-6 py-3 font-medium">Cantidad</th>
              <th className="px-6 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {produccionesFiltradas.map(p => {
              const animal = animales.find(a => String(a.id) === String(p.animalido)) || {};
              return (
                <tr
                  key={p.id}
                  className={`border-b transition-colors hover:bg-green-50 ${
                    p.tipoProduccion === "mala" ? "bg-red-100" :
                    p.tipoProduccion === "buena" ? "bg-yellow-100" :
                    p.tipoProduccion === "excelente" ? "bg-green-100" : ""
                  }`}
                >
                  <td className="px-6 py-3">{animal.nombre || "-"}</td>
                  <td className="px-6 py-3">{animal.tipo || "-"}</td>
                  <td className="px-6 py-3">{p.fecha}</td>
                  <td className="px-6 py-3">{p.tipoProduccion}</td>
                  <td className="px-6 py-3">{p.cantidad}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditar(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumen por tipo de producción */}
      <div className="mt-4 p-4 bg-green-100 rounded-xl">
        <h3 className="font-semibold text-green-800 mb-2">Resumen por tipo de producción</h3>
        {Object.entries(resumenProduccion).map(([tipo, total]) => (
          <p key={tipo}>{tipo}: {total} L</p>
        ))}
      </div>
    </div>
  );
}
