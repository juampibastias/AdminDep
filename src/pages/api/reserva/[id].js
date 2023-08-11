import { connectToDatabase } from "../../../../utils/db";
import Reserva from "../../../../models/reserva";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();

      // Obtener la fecha de la solicitud
      const { fecha } = req.query;

      // Buscar las reservas que coincidan con la fecha
      const reservas = await Reserva.find({ fechaDisponible: fecha });

      return res.status(200).json(reservas);
    } catch (error) {
      console.error("Error al obtener las reservas", error);
      return res.status(500).json({ message: "Error al obtener las reservas" });
    }
  }

  try {
    // Obtener los datos de la reserva del cuerpo de la solicitud
    const {
      nombre,
      apellido,
      fechaDisponible,
      zonasDepilar,
      precioAcumulado,
      tiempoAcumulado,
      horariosSeleccionados,
    } = req.body;

    if (
      !nombre ||
      !apellido ||
      !fechaDisponible ||
      !zonasDepilar ||
      !precioAcumulado ||
      !tiempoAcumulado
    ) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    await connectToDatabase(); // Conexión a la base de datos

    // Crear una nueva instancia del modelo Reserva con los datos recibidos
    const nuevaReserva = new Reserva({
      nombre,
      apellido,
      fechaDisponible,
      zonasDepilar,
      precioAcumulado,
      tiempoAcumulado,
      horariosSeleccionados,
    });

    // Guardar la reserva en la base de datos
    const reservaGuardada = await nuevaReserva.save();

    return res.status(201).json(reservaGuardada);
  } catch (error) {
    console.error("Error al guardar la reserva", error);
    return res.status(500).json({ message: "Error al guardar la reserva" });
  }
}
