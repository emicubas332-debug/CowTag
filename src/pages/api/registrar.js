import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    tagID,
    lector,
    nombre,
    dueño,
    fechaNacimiento,
    numeroVaca,
    sexo,
    cantidadVacunas,
    peso
  } = req.body;

  if (!tagID) {
    return res.status(400).json({ error: "Falta el tagID" });
  }

  try {
    const animalesRef = collection(db, "animales");
    const q = query(animalesRef, where("tagID", "==", tagID));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Crear nuevo documento
      const data = {
        tagID,
        nombre: nombre || "",
        dueño: dueño || "",
        fechaNacimiento: fechaNacimiento || "",
        numeroVaca: numeroVaca || "",
        sexo: sexo || "",
        cantidadVacunas: cantidadVacunas || 0,
        peso: peso || 0,
        historialEscaneos: [{ fecha: new Date().toISOString(), lector: lector || "desconocido" }],
      };
      const docRef = await addDoc(animalesRef, data);
      return res.status(201).json({ message: "Animal registrado", id: docRef.id });
    } else {
      // Actualizar historial
      const animalDoc = snapshot.docs[0];
      const docRef = doc(db, "animales", animalDoc.id);

      // También, si envían datos nuevos, actualizar esos campos (excepto historial)
      const updateData = {
        historialEscaneos: arrayUnion({ fecha: new Date().toISOString(), lector: lector || "desconocido" }),
      };

      // Actualizar solo si hay datos nuevos (evita borrar campos)
      if (nombre) updateData.nombre = nombre;
      if (dueño) updateData.dueño = dueño;
      if (fechaNacimiento) updateData.fechaNacimiento = fechaNacimiento;
      if (numeroVaca) updateData.numeroVaca = numeroVaca;
      if (sexo) updateData.sexo = sexo;
      if (cantidadVacunas !== undefined) updateData.cantidadVacunas = cantidadVacunas;
      if (peso !== undefined) updateData.peso = peso;

      await updateDoc(docRef, updateData);
      return res.status(200).json({ message: "Animal actualizado y historial agregado", id: animalDoc.id });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
