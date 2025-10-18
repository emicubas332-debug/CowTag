"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

import Animales from "../components/Animales";
import Producciones from "../components/Producciones";
import Sanidades from "../components/Sanidades";
import Nacimientos from "../components/Nacimientos";
import Actividades from "../components/Actividades";
import Stats from "../components/Stats";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [tabKey, setTabKey] = useState("animales");
  const [loading, setLoading] = useState(true);

  const [animales, setAnimales] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [sanidades, setSanidades] = useState([]);
  const [nacimientos, setNacimientos] = useState([]);
  const [actividades, setActividades] = useState([]);

  const [mensaje, setMensaje] = useState(""); // 💬 Notificación visual

  const tabs = ["animales", "producciones", "sanidades", "nacimientos", "actividades", "estadisticas"];

  // 🔹 Trae datos de una tabla
  const fetchTable = async (table, setter, orderByField = "id", desc = false) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderByField, { ascending: !desc });
      if (error) throw error;
      setter(data || []);
    } catch (err) {
      console.error(`Error cargando ${table}:`, err.message);
      setter([]);
    }
  };

  // 🔁 Carga inicial de datos y verificación de usuario
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        setUser(data.session.user);
        loadAllData();
      }
      setLoadingUser(false);

      // Escuchar cambios de sesión
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) router.push("/login");
      });

      return () => listener.subscription.unsubscribe();
    };

    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTable("animales", setAnimales, "nombre"),
        fetchTable("producciones", setProducciones, "fecha", true),
        fetchTable("sanidades", setSanidades, "fecha", true),
        fetchTable("nacimientos", setNacimientos, "fecha", true),
        fetchTable("actividades", setActividades, "fecha", true),
      ]);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loadingUser) return <p className="text-center mt-20">⏳ Verificando sesión…</p>;
  if (!user) return null;

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 2500);
  };

  // 🐄 Guardar animal
  const guardarAnimal = async (animal, editId = null) => {
    try {
      if (!animal.tagid || !animal.nombre) throw new Error("Tag y nombre son obligatorios");

      if (editId) {
        const { error } = await supabase.from("animales").update(animal).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("animales").insert([animal]);
        if (error) throw error;
      }

      await fetchTable("animales", setAnimales, "nombre");
      mostrarMensaje("✅ Animal guardado correctamente");
    } catch (err) {
      alert("❌ Error al guardar animal: " + err.message);
    }
  };

  // 🗑 Eliminar animal
  const eliminarAnimal = async (id) => {
    try {
      const { error } = await supabase.from("animales").delete().eq("id", id);
      if (error) throw error;
      await fetchTable("animales", setAnimales, "nombre");
      mostrarMensaje("🗑 Animal eliminado correctamente");
    } catch (err) {
      alert("❌ Error al eliminar: " + err.message);
    }
  };

  // 🥛 Guardar producción
  const guardarProduccion = async (prod) => {
    try {
      if (!prod.animalido || !prod.fecha || !prod.tipoProduccion || !prod.cantidad)
        throw new Error("Todos los campos son obligatorios");

      const prodData = {
        ...prod,
        animalido: Number(prod.animalido),
        cantidad: Number(prod.cantidad),
      };

      const { data, error } = await supabase.from("producciones").insert([prodData]).select();
      if (error) throw error;
      if (Array.isArray(data)) setProducciones((prev) => [...prev, ...data]);

      mostrarMensaje("✅ Producción guardada correctamente");
    } catch (err) {
      alert("❌ Error al guardar producción: " + err.message);
    }
  };

  // 💉 Guardar sanidad
  const guardarSanidad = async (san) => {
    try {
      if (!san.animalido || !san.fecha || !san.tipo || !san.dosis)
        throw new Error("Todos los campos son obligatorios");

      const sanData = {
        ...san,
        animalido: Number(san.animalido),
        dosis: Number(san.dosis),
      };

      const { data, error } = await supabase.from("sanidades").insert([sanData]).select();
      if (error) throw error;
      if (Array.isArray(data)) setSanidades((prev) => [...prev, ...data]);

      mostrarMensaje("✅ Sanidad registrada correctamente");
    } catch (err) {
      alert("❌ Error al guardar sanidad: " + err.message);
    }
  };

  // 🐮 Guardar nacimiento
  const guardarNacimiento = async (nac) => {
    try {
      if (!nac.madreId || !nac.padreId || !nac.fecha || !nac.cantidad)
        throw new Error("Todos los campos son obligatorios");

      const nacData = { ...nac, cantidad: Number(nac.cantidad) };

      const { data, error } = await supabase.from("nacimientos").insert([nacData]).select();
      if (error) throw error;
      if (Array.isArray(data)) setNacimientos((prev) => [...prev, ...data]);

      mostrarMensaje("👶 Nacimiento registrado correctamente");
    } catch (err) {
      alert("❌ Error al guardar nacimiento: " + err.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-700 tracking-tight">🏡 CowTag</h1>

        <div className="flex items-center gap-2">
          <nav className="flex gap-2 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTabKey(t)}
                className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 ${
                  tabKey === t
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border hover:bg-blue-50 hover:scale-105 hover:shadow-lg"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>

          <button
            onClick={logout}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "8px 12px",
              borderRadius: 6,
              marginLeft: 10,
              fontWeight: "600",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {mensaje && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {mensaje}
        </div>
      )}

      <main className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 overflow-x-auto">
        {loading ? (
          <p className="text-gray-600 animate-pulse text-center mt-8">⏳ Cargando datos…</p>
        ) : (
          <>
            {tabKey === "animales" && (
              <Animales animales={animales} guardarAnimal={guardarAnimal} eliminarAnimal={eliminarAnimal} />
            )}
            {tabKey === "producciones" && (
              <Producciones producciones={producciones} animales={animales} guardarProduccion={guardarProduccion} />
            )}
            {tabKey === "sanidades" && (
              <Sanidades sanidades={sanidades} animales={animales} guardarSanidad={guardarSanidad} />
            )}
            {tabKey === "nacimientos" && (
              <Nacimientos nacimientos={nacimientos} animales={animales} guardarNacimiento={guardarNacimiento} />
            )}
            {tabKey === "actividades" && <Actividades actividades={actividades} />}
            {tabKey === "estadisticas" && <Stats animales={animales} producciones={producciones} />}
          </>
        )}
      </main>
    </div>
  );
}
