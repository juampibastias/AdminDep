import { connectToDatabase } from "../../../../utils/db";
import Reserva from "../../../../models/reserva"; // Importamos el modelo Reserva
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

      const { nombre, apellido, fechaDisponible, zonasDepilar } = req.body;

      // Calcular precio y tiempo acumulado
      let precioAcumulado = 0;
      let tiempoAcumulado = 0;
      for (const zonaSeleccionada of zonasDepilar) {
        const [, precio, tiempo] = zonaSeleccionada.split(" | ");
        precioAcumulado += parseInt(precio);
        tiempoAcumulado += parseInt(tiempo);
      }

      // Creamos una nueva instancia del modelo Reserva con los datos recibidos y el acumulado
      const nuevaReserva = new Reserva({
        nombre,
        apellido,
        fechaDisponible,
        zonasDepilar,
        precioAcumulado,
        tiempoAcumulado,
      });

      // Guardamos la reserva en la base de datos
      await nuevaReserva.save();

      return res.status(200).json({ message: "Reserva guardada correctamente" });
    } catch (error) {
      console.error("Error al guardar la reserva", error);
      return res.status(500).json({ message: "Error al guardar la reserva" });
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
