// src/pages/api/recibirTag.js
import { registrarActividad } from "../../utils/registrarActividad";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { tagId } = req.body;

    if (!tagId) {
      return res.status(400).json({ error: "tagId es requerido" });
    }

    await registrarActividad(tagId);

    return res.status(200).json({ message: "Tag procesado correctamente" });
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
