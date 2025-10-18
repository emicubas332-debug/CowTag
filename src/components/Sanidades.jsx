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
    };

    try {
      await guardarSanidad(sanidadData);
      resetForm();
    } catch (error) {
      alert("Error al guardar sanidad: " + error.message);
    }
  };

  const contarPorTipo = (animalido, palabraClave) =>
    sanidades.filter(
      (s) => s.animalido === Number(animalido) && s.tipo.toLowerCase().includes(palabraClave.toLowerCase())
    ).length;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">Sanidades</h2>

      <div className="mb-4 text-yellow-800 font-semibold">
        Total vacunas: {sanidades.filter((s) => s.tipo.toLowerCase().includes("vacuna")).length} |{" "}
        Total desparasitaciones: {sanidades.filter((s) => s.tipo.toLowerCase().includes("desparasit")).length}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          name="animalido"
          value={form.animalido}
          onChange={onChange}
          className={`border p-2 rounded flex-1 ${errores.animalido ? "border-red-500" : ""}`}
        >
          <option value="">Seleccionar animal</option>
          {animales.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} (Vacunas: {contarPorTipo(a.id, "vacuna")}, Desparasitaciones: {contarPorTipo(a.id, "desparasit")})
            </option>
          ))}
        </select>
        {errores.animalido && <span className="text-red-500 text-sm">Campo obligatorio</span>}

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={onChange}
          className={`border p-2 rounded flex-1 ${errores.fecha ? "border-red-500" : ""}`}
        />
        {errores.fecha && <span className="text-red-500 text-sm">Campo obligatorio</span>}

        <input
          type="text"
          placeholder="Tipo (Vacuna, Desparasitación, Tratamiento, Revisión)"
          name="tipo"
          value={form.tipo}
          onChange={onChange}
          className={`border p-2 rounded flex-1 ${errores.tipo ? "border-red-500" : ""}`}
        />
        {errores.tipo && <span className="text-red-500 text-sm">Campo obligatorio</span>}

        <input
          type="number"
          placeholder="Dosis"
          name="dosis"
          value={form.dosis}
          onChange={onChange}
          className={`border p-2 rounded w-24 ${errores.dosis ? "border-red-500" : ""}`}
        />
        {errores.dosis && <span className="text-red-500 text-sm">Campo obligatorio</span>}

        <input
          type="text"
          placeholder="Descripción / Observaciones"
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        />

        <input
          type="date"
          placeholder="Próxima fecha"
          name="proximaFecha"
          value={form.proximaFecha}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        />

        <input
          type="text"
          placeholder="Veterinario"
          name="veterinario"
          value={form.veterinario}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        />

        <button
          onClick={handleSubmit}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Agregar
        </button>
      </div>

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
              <th className="px-4 py-2">Vacunas aplicadas</th>
            </tr>
          </thead>
          <tbody>
            {sanidades.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No hay registros de sanidad.
                </td>
              </tr>
            ) : (
              sanidades.map((s) => {
                const animal = animales.find((a) => a.id === Number(s.animalido)) || {};
                return (
                  <tr key={`${s.animalido}-${s.fecha}-${s.tipo}`} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{animal.nombre || "-"}</td>
                    <td className="px-4 py-2">{new Date(s.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{s.tipo}</td>
                    <td className="px-4 py-2">{s.dosis}</td>
                    <td className="px-4 py-2">{s.descripcion || "-"}</td>
                    <td className="px-4 py-2">{s.proximaFecha ? new Date(s.proximaFecha).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2">{s.veterinario || "-"}</td>
                    <td className="px-4 py-2">{contarPorTipo(s.animalido, "vacuna")}</td>
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
