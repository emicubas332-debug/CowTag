// src/components/Nuevo.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Nuevo() {
  const [tag, setTag] = useState("");
  const [animales, setAnimales] = useState([]);
  const [error, setError] = useState("");

  // Cargar animales
  const fetchAnimales = async () => {
    const { data, error } = await supabase
      .from("animales")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al cargar animales:", error);
    } else {
      setAnimales(data);
    }
  };

  useEffect(() => {
    fetchAnimales();
  }, []);

  // Guardar tag
  const handleGuardar = async () => {
    setError("");

    if (!tag) {
      setError("El tag no puede estar vacío");
      return;
    }

    // Verificar si el tag ya existe
    const { data: existing, error: checkError } = await supabase
      .from("animales")
      .select("*")
      .eq("tag", tag);

    if (checkError) {
      console.error(checkError);
      setError("Error al verificar el tag");
      return;
    }

    if (existing.length > 0) {
      setError("Este tag ya está registrado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("animales")
        .insert([{ tag, created_at: new Date().toISOString() }]);

      if (error) {
        console.error(error);
        setError("Error al guardar el tag");
      } else {
        setTag("");
        fetchAnimales(); // refrescar lista
      }
    } catch (e) {
      console.error(e);
      setError("Error al guardar el tag");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Registrar Animal</h1>
      <input
        type="text"
        placeholder="Escribe el tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <button onClick={handleGuardar}>Guardar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Animales Registrados</h2>
      {animales.length === 0 ? (
        <p>No hay animales registrados.</p>
      ) : (
        <ul>
          {animales.map((animal) => (
            <li key={animal.id}>{animal.tag}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
