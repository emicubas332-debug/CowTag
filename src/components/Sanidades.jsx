"use client";

import { useState } from "react";

export default function Sanidades({ sanidades = [], animales = [], guardarSanidad }) {
  const [form, setForm] = useState({
    animalido: "",
    fecha: "",
    tipo: "",
    dosis: "",
    descripcion: "",
    proximaFecha: "",
    veterinario: "",
  });
  const [errores, setErrores] = useState({});
  const [editId, setEditId] = useState(null);
  const [filtroAnimal, setFiltroAnimal] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: false }));
  };

  const resetForm = () => {
    setForm({
      animalido: "",
      fecha: "",
      tipo: "",
      dosis: "",
      descripcion: "",
      proximaFecha: "",
      veterinario: "",
    });
    setErrores({});
    setEditId(null);
  };

  const handleSubmit = async () => {
    const nuevosErrores = {};
    if (!form.animalido) nuevosErrores.animalido = true;
    if (!form.fecha) nuevosErrores.fecha = true;
    if (!form.tipo.trim()) nuevosErrores.tipo = true;
    if (!form.dosis || isNaN(Number(form.dosis))) nuevosErrores.dosis = true;

    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      return;
    }

    const sanidadData = {
      animalido: Number(form.animalido),
      fecha: form.fecha,
      tipo: form.tipo.trim(),
      dosis: Number(form.dosis),
      descripcion: form.descripcion.trim() || null,
      proximaFecha: form.proximaFecha || null,
      veterinario: form.veterinario.trim() || null,
      id: editId,
    };

    try {
      await guardarSanidad(sanidadData);
      resetForm();
    } catch (error) {
      alert("Error al guardar sanidad: " + error.message);
    }
  };

  const handleEditar = (s) => {
    setForm({
      animalido: s.animalido,
      fecha: s.fecha,
      tipo: s.tipo,
      dosis: s.dosis,
      descripcion: s.descripcion || "",
      proximaFecha: s.proximaFecha || "",
      veterinario: s.veterinario || "",
    });
    setEditId(s.id);
  };

  const handleEliminar = (id) => {
    if (confirm("¿Eliminar este registro de sanidad?")) {
      guardarSanidad({ id, eliminar: true });
    }
  };

  const contarPorTipo = (animalido, palabraClave) =>
    sanidades.filter(
      (s) => s.animalido === Number(animalido) && s.tipo.toLowerCase().includes(palabraClave.toLowerCase())
    ).length;

  const sanidadesFiltradas = sanidades.filter((s) => {
    const animalMatch = filtroAnimal ? s.animalido === filtroAnimal : true;
    const tipoMatch = filtroTipo ? s.tipo.toLowerCase().includes(filtroTipo.toLowerCase()) : true;
    return animalMatch && tipoMatch;
  });

  return (
    <div className="p-6 bg-yellow-50 rounded-2xl shadow-xl max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-yellow-800 mb-6 text-center">Sanidades</h2>

      {/* Resumen */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <div className="bg-yellow-100 p-4 rounded-xl shadow-md w-60 text-center">
          <h3 className="font-semibold text-yellow-800">Vacunas aplicadas</h3>
          <p className="text-2xl font-bold">{sanidades.filter(s => s.tipo.toLowerCase().includes("vacuna")).length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow-md w-60 text-center">
          <h3 className="font-semibold text-yellow-800">Desparasitaciones</h3>
          <p className="text-2xl font-bold">{sanidades.filter(s => s.tipo.toLowerCase().includes("desparasit")).length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          value={filtroAnimal}
          onChange={(e) => setFiltroAnimal(Number(e.target.value))}
          className="border p-2 rounded w-60"
        >
          <option value="">Filtrar por animal</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filtrar por tipo (Vacuna, Desparasitación...)"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border p-2 rounded w-60"
        />
      </div>

      {/* Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-xl shadow-md">
        <select
          name="animalido"
          value={form.animalido}
          onChange={onChange}
          className={`border p-2 rounded ${errores.animalido ? "border-red-500" : ""}`}
        >
          <option value="">Seleccionar animal</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={onChange}
          className={`border p-2 rounded ${errores.fecha ? "border-red-500" : ""}`}
        />

        <input
          type="text"
          placeholder="Tipo (Vacuna, Desparasitación...)"
          name="tipo"
          value={form.tipo}
          onChange={onChange}
          className={`border p-2 rounded ${errores.tipo ? "border-red-500" : ""}`}
        />

        <input
          type="number"
          placeholder="Dosis"
          name="dosis"
          value={form.dosis}
          onChange={onChange}
          className={`border p-2 rounded ${errores.dosis ? "border-red-500" : ""}`}
        />

        <input
          type="text"
          placeholder="Descripción / Observaciones"
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          placeholder="Próxima fecha"
          name="proximaFecha"
          value={form.proximaFecha}
          onChange={onChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Veterinario"
          name="veterinario"
          value={form.veterinario}
          onChange={onChange}
          className="border p-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          {editId ? "Guardar cambios" : "Agregar"}
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-yellow-600 text-white">
            <tr>
              <th className="px-4 py-2">Animal</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Dosis</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Próxima fecha</th>
              <th className="px-4 py-2">Veterinario</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sanidadesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No hay registros de sanidad.
                </td>
              </tr>
            ) : (
              sanidadesFiltradas.map((s) => {
                const animal = animales.find(a => a.id === Number(s.animalido)) || {};
                const proxima = s.proximaFecha ? new Date(s.proximaFecha) : null;
                const hoy = new Date();
                const alertaProxima = proxima && (proxima - hoy) / (1000 * 60 * 60 * 24) <= 7; // próximos 7 días

                return (
                  <tr
                    key={s.id}
                    className={`border-b hover:bg-gray-50 ${alertaProxima ? "bg-red-100" : ""}`}
                  >
                    <td className="px-4 py-2">{animal.nombre || "-"}</td>
                    <td className="px-4 py-2">{new Date(s.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-white text-sm ${
                        s.tipo.toLowerCase().includes("vacuna") ? "bg-green-500" :
                        s.tipo.toLowerCase().includes("desparasit") ? "bg-blue-500" :
                        "bg-gray-500"
                      }`}>
                        {s.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-2">{s.dosis}</td>
                    <td className="px-4 py-2">{s.descripcion || "-"}</td>
                    <td className="px-4 py-2">{s.proximaFecha ? new Date(s.proximaFecha).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2">{s.veterinario || "-"}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEditar(s)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(s.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
