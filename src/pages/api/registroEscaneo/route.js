// src/pages/api/registroEscaneo.js (o src/app/api/registroEscaneo/route.js si usas app router)

import { db } from "../../../firebase/firebaseConfig"; // Ajusta ruta
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ message: "Falta uid" });
  }

  try {
    await addDoc(collection(db, "escaneos"), {
      uid,
      fecha: serverTimestamp(),
    });

    return res.status(200).json({ message: "Escaneo registrado" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno: " + error.message });
  }
}
