export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tag } = req.body;

    // Aquí deberías consultar tu base de datos y verificar si ese tag existe
    if (tag === "9AE25719") {
      return res.status(200).json({ autorizado: true, mensaje: "Acceso permitido" });
    } else {
      return res.status(403).json({ autorizado: false, mensaje: "Acceso denegado" });
    }
  } else {
    res.status(405).json({ mensaje: "Método no permitido" });
  }
}
