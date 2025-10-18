// src/pages/tags.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [nuevoTag, setNuevoTag] = useState("");
  const [nombre, setNombre] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [nombreEdit, setNombreEdit] = useState("");

  const cargarTags = async () => {
    const { data, error } = await supabase
      .from("animales")
      .select("*")
      .order("fechaRegistro", { ascending: false });

    if (error) {
      console.error("Error cargando tags:", error);
      return;
    }

    setTags(data);
  };

  useEffect(() => {
    cargarTags();
  }, []);

  const registrarTag = async () => {
    if (!nuevoTag || !nombre) {
      alert("Completa todos los campos");
      return;
    }

    // Verificar si el tag ya existe
    const { data: existing, error: queryError } = await supabase
      .from("animales")
      .select("*")
      .eq("tagID", nuevoTag)
      .limit(1);

    if (queryError) {
      console.error(queryError);
      alert("Error al verificar el tag");
      return;
    }

    if (existing.length > 0) {
      alert("Tag ya registrado");
      return;
    }

    // Insertar nuevo tag
    const { error: insertError } = await supabase
      .from("animales")
      .insert([{ tagID: nuevoTag, nombre, fechaRegistro: new Date().toISOString() }]);

    if (insertError) {
      console.error(insertError);
      alert("Error al registrar tag");
      return;
    }

    setNuevoTag("");
    setNombre("");
    cargarTags();
  };

  const empezarEdicion = (tag) => {
    setEditingId(tag.id);
    setNombreEdit(tag.nombre);
  };

  const guardarEdicion = async () => {
    if (!nombreEdit) {
      alert("Nombre no puede estar vacío");
      return;
    }

    const { error } = await supabase
      .from("animales")
      .update({ nombre: nombreEdit })
      .eq("id", editingId);

    if (error) {
      console.error(error);
      alert("Error al actualizar nombre");
      return;
    }

    setEditingId(null);
    setNombreEdit("");
    cargarTags();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Animales Registrados</h1>

      <ul>
        {tags.map((t) => (
          <li key={t.id} style={{ marginBottom: 10 }}>
            {editingId === t.id ? (
              <>
                <input
                  value={nombreEdit}
                  onChange={(e) => setNombreEdit(e.target.value)}
                />
                <button onClick={guardarEdicion}>Guardar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <b>{t.nombre}</b> - {t.tagID}{" "}
                <button onClick={() => empezarEdicion(t)}>Editar</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Registrar Nuevo Tag</h2>
      <input
        placeholder="Tag RFID"
        value={nuevoTag}
        onChange={(e) => setNuevoTag(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Nombre Animal"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={registrarTag}>Registrar</button>

      <p style={{ marginTop: 30 }}>
        <a href="/">Volver al inicio</a>
      </p>
    </div>
  );
}
