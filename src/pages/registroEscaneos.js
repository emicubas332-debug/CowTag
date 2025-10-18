// src/components/RegistroEscaneo.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RegistroEscaneos() {
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [historial, setHistorial] = useState([]);

  // Traer animales y su historial
  useEffect(() => {
    async function fetchHistorial() {
      const { data, error } = await supabase
        .from("animales")
        .select("id, tag, historialEscaneos")
        .order("tag", { ascending: true });

      if (error) {
        console.error("Error al cargar animales:", error);
        return;
      }

      const dataOrdenada = data.map(animal => ({
        ...animal,
        historialEscaneos: (animal.historialEscaneos || []).sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        ),
      }));

      setHistorial(dataOrdenada);
    }

    fetchHistorial();
  }, []);

  // Registrar escaneo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!tag) {
      setError("Ingrese un Tag ID");
      return;
    }

    try {
      // Buscar el animal por tag
      const { data: animales, error: queryError } = await supabase
        .from("animales")
        .select("id, historialEscaneos")
        .eq("tag", tag)
        .limit(1)
        .single();

      if (queryError || !animales) {
        setError("Tag no encontrado");
        return;
      }

      const nuevoEscaneo = { fecha: new Date().toISOString() };

      // Actualizar el historial
      const { error: updateError } = await supabase
        .from("animales")
        .update({
          historialEscaneos: [...(animales.historialEscaneos || []), nuevoEscaneo]
        })
        .eq("id", animales.id);

      if (updateError) {
        setError("Error al registrar escaneo");
        return;
      }

      // Refrescar historial local
      setHistorial(prev =>
        prev.map(a =>
          a.id === animales.id
            ? { ...a, historialEscaneos: [nuevoEscaneo, ...(a.historialEscaneos || [])] }
            : a
        )
      );

      setTag("");
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>Registrar Escaneo de Tag</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Ingrese Tag ID"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          style={{ padding: 8, width: "70%" }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 10 }}>
          Registrar
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Historial de Escaneos</h2>
      {historial.length === 0 ? (
        <p>No hay escaneos registrados.</p>
      ) : (
        historial.map((animal) => (
          <div
            key={animal.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 15,
              borderRadius: 5
            }}
          >
            <strong>Tag ID: </strong>{animal.tag}
            <br />
            <strong>Historial:</strong>
            <ul>
              {animal.historialEscaneos.length === 0 && <li>No hay escaneos aún.</li>}
              {animal.historialEscaneos.map((escaneo, idx) => (
                <li key={idx}>
                  {escaneo.fecha
                    ? new Date(escaneo.fecha).toLocaleString()
                    : "Fecha no disponible"}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
