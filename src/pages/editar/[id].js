import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useRouter } from "next/router";

export default function Editar() {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const fetchAnimal = async () => {
      const docRef = doc(db, "animales", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAnimal(docSnap.data());
      } else {
        alert("Animal no encontrado");
        router.push("/");
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
      const docRef = doc(db, "animales", id);
      await updateDoc(docRef, {
        ...animal,
        vacunas: Number(animal.vacunas),
        peso: Number(animal.peso),
      });
      alert("Animal actualizado");
      router.push("/");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!animal) return null;

  return (
    <div style={{maxWidth: 600, margin: "auto", padding: 20}}>
      <h1>Editar Animal</h1>
      <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap: 10}}>
        <input name="tagID" value={animal.tagID} onChange={handleChange} disabled />
        <input name="nombre" value={animal.nombre} onChange={handleChange} />
        <input name="dueno" value={animal.dueno} onChange={handleChange} />
        <input type="date" name="fechaNacimiento" value={animal.fechaNacimiento} onChange={handleChange} />
        <input name="numeroVaca" value={animal.numeroVaca} onChange={handleChange} />
        <input name="sexo" value={animal.sexo} onChange={handleChange} />
        <input type="number" name="vacunas" value={animal.vacunas} onChange={handleChange} />
        <input type="number" name="peso" value={animal.peso} onChange={handleChange} />
        <button type="submit" style={{padding: 10, backgroundColor:"#2980b9", color:"white", border:"none", borderRadius:5, cursor:"pointer"}}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
