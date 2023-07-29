import { connectToDatabase } from "../../../../utils/db";
import Fecha from "../../../../models/fecha";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const fechas = await Fecha.find({});
      return res.status(200).json(fechas);
    } catch (error) {
      console.error("Error al obtener las fechas", error);
      return res.status(500).json({ message: "Error al obtener las fechas" });
    }
  } else if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { desde, hasta } = req.body;
      const nuevaFecha = new Fecha({
        desde,
        hasta,
      });
      await nuevaFecha.save();
      return res.status(200).json({ message: "Fecha agregada correctamente" });
    } catch (error) {
      console.error("Error al agregar la fecha", error);
      return res.status(500).json({ message: "Error al agregar la fecha" });
    }
  } else if (req.method === "DELETE") {
    try {
      await connectToDatabase();
      const { id } = req.query;

      console.log(req.query)

      // Buscar y eliminar la fecha por su id
      console.log("Id a eliminar:", id);
      const fechaEliminada = await Fecha.findByIdAndDelete(id);

      if (!fechaEliminada) {
        // Si no se encontró la fecha con el id dado, responde con un error 404
        return res.status(404).json({ message: "Fecha no encontrada" });
      }

      return res.status(200).json({ message: "Fecha eliminada correctamente" });
    } catch (error) {
      console.log("ID: ", id)
      console.error("Error al eliminar la fecha", error);
      return res.status(500).json({ message: "Error al eliminar la fecha" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
