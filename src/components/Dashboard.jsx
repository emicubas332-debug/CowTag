// src/components/Dashboard.jsx
"use client";

import { useState, useEffect } from "react";
import Producciones from "./Producciones";
import Sanidades from "./Sanidades";
import Nacimientos from "./Nacimientos";

export default function Dashboard() {
  const [animales, setAnimales] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [sanidades, setSanidades] = useState([]);
  const [nacimientos, setNacimientos] = useState([]);

  // Cargar animales desde API al iniciar
  useEffect(() => {
    fetch("/api/animales")
      .then(res => res.json())
      .then(data => setAnimales(data))
      .catch(err => console.error(err));
  }, []);

  // Funciones para agregar datos
  const agregarProduccion = async (produccion) => {
    const res = await fetch("/api/producciones", {
      method: "POST",
      body: JSON.stringify(produccion),
      headers: { "Content-Type": "application/json" }
    });
    const nueva = await res.json();
    setProducciones([...producciones, nueva]);
  };

  const agregarSanidad = async (sanidad) => {
    const res = await fetch("/api/sanidades", {
      method: "POST",
      body: JSON.stringify(sanidad),
      headers: { "Content-Type": "application/json" }
    });
    const nueva = await res.json();
    setSanidades([...sanidades, nueva]);
  };

  const agregarNacimiento = async (nacimiento) => {
    const res = await fetch("/api/nacimientos", {
      method: "POST",
      body: JSON.stringify(nacimiento),
      headers: { "Content-Type": "application/json" }
    });
    const nueva = await res.json();
    setNacimientos([...nacimientos, nueva]);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard de Animales</h1>

      <Producciones
        animales={animales}
        producciones={producciones}
        guardarProduccion={agregarProduccion}
      />

      <Sanidades
        animales={animales}
        sanidades={sanidades}
        guardarSanidad={agregarSanidad}
      />

      <Nacimientos
        animales={animales}
        nacimientos={nacimientos}
        guardarNacimiento={agregarNacimiento}
      />
    </div>
  );
}
