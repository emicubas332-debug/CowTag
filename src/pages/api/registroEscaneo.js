// src/pages/api/registroEscaneo.js
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: "Falta parámetro uid" });

  try {
    const animalesRef = collection(db, "animales");
    const q = query(animalesRef, where("tagID", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ error: "Tag no registrado" });
    }

    const docSnap = snapshot.docs[0];
    const docRef = docSnap.ref;

    await updateDoc(docRef, {
      historialEscaneos: arrayUnion({
        fecha: Timestamp.now(),
      }),
    });

    return res.status(200).json({ mensaje: "Escaneo registrado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
