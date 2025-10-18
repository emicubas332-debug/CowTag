// src/firebase/escaneo.js
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function registrarEscaneo(tagID) {
  const animalesRef = collection(db, "animales");
  const q = query(animalesRef, where("tagID", "==", tagID));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("El tag no está registrado en el sistema");
    return false;
  }

  const animalDoc = querySnapshot.docs[0];
  const animalRef = doc(db, "animales", animalDoc.id);
  const animalData = animalDoc.data();

  const historial = animalData.historialEscaneos || [];
  const nuevoContador = historial.length + 1;

  await updateDoc(animalRef, {
    historialEscaneos: arrayUnion({
      fecha: serverTimestamp(),
      contador: nuevoContador
    })
  });

  console.log(`Escaneo registrado para tag ${tagID}, total escaneos: ${nuevoContador}`);

  return true;
}
