// src/utils/registrarActividad.js
import { db, serverTimestamp } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

/**
 * Registra una nueva actividad de escaneo RFID en el animal correspondiente.
 * @param {string} tagId - ID del animal (documento en la colección "animales")
 */
export const registrarActividad = async (tagId) => {
  const docRef = doc(db, "animales", tagId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log("❌ Tag no registrado en la base de datos.");
    return;
  }

  try {
    await updateDoc(docRef, {
      actividad: arrayUnion({
        tipo: "Lectura RFID",
        fecha: serverTimestamp(),
      }),
    });
    console.log("✅ Actividad registrada con éxito.");
  } catch (error) {
    console.error("⚠ Error al registrar actividad:", error);
  }
};