import { connectToDatabase } from "../../../../utils/db";
import Zona from "../../../../models/zona";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const zonas = await Zona.find({});
      return res.status(200).json(zonas);
    } catch (error) {
      console.error("Error al obtener las fechas", error);
      return res.status(500).json({ message: "Error al obtener las fechas" });
    }
  } else if (req.method === "POST") {
    try {
      await connectToDatabase();

      const { zona, tiempo, precio } = req.body;

      const nuevaZona = new Zona({
        zona,
        tiempo,
        precio,
      });

      await nuevaZona.save();

      return res.status(200).json({ message: "Zona agregada correctamente" });
    } catch (error) {
      console.error("Error al agregar la zona", error);
      return res.status(500).json({ message: "Error al agregar la zona" });
    }
  } else if (req.method === "DELETE") {
    try {
      await connectToDatabase();
      const { id } = req.query;

      // Verifica que el ID no sea "undefined" antes de eliminar la zona
      if (!id) {
        return res.status(400).json({ message: "ID de zona no proporcionado" });
      }

      // Busca la zona por su ID y elimínala de la base de datos
      await Zona.findByIdAndRemove(id);

      return res.status(200).json({ message: "Zona eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la zona", error);
      return res.status(500).json({ message: "Error al eliminar la zona" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
