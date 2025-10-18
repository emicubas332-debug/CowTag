import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const { tagID } = req.body;

  if (!tagID) {
    res.status(400).json({ error: "Falta tagID" });
    return;
  }

  try {
    await addDoc(collection(db, "lecturas"), {
      tagID,
      timestamp: serverTimestamp(),
    });
    res.status(200).json({ message: "Lectura registrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error registrando lectura" });
  }
}
