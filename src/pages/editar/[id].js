import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export default function Editar() {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchAnimal = async () => {
      const { data, error } = await supabase
        .from("animales")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Animal no encontrado: " + error.message);
        router.push("/");
      } else {
        setAnimal(data);
      }
      setLoading(false);
    };

    fetchAnimal();
  }, [id, router]);

  const handleChange = (e) => {
    setAnimal({ ...animal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!animal) return;

    try {
      const { error } = await supabase
        .from("animales")
        .update({
          ...animal,
          vacunas: Number(animal.vacunas),
          peso: Number(animal.peso),
        })
        .eq("id", id);

      if (error) throw error;

      alert("Animal actualizado");
      router.push("/");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!animal) return null;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Editar Animal</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input name="tagID" value={animal.tagID} onChange={handleChange} disabled />
        <input name="nombre" value={animal.nombre} onChange={handleChange} />
        <input name="dueno" value={animal.dueno} onChange={handleChange} />
        <input
          type="date"
          name="fechaNacimiento"
          value={animal.fechaNacimiento}
          onChange={handleChange}
        />
        <input name="numeroVaca" value={animal.numeroVaca} onChange={handleChange} />
        <input name="sexo" value={animal.sexo} onChange={handleChange} />
        <input type="number" name="vacunas" value={animal.vacunas} onChange={handleChange} />
        <input type="number" name="peso" value={animal.peso} onChange={handleChange} />
        <button
          type="submit"
          style={{
            padding: 10,
            backgroundColor: "#2980b9",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
