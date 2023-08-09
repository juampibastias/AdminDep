import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fechaDisponible: { type: String, required: true },
  zonasDepilar: [{ type: String, required: true }],
  precioAcumulado: { type: Number, required: true }, // Nuevo campo para precio acumulado
  tiempoAcumulado: { type: Number, required: true },
  horariosSeleccionados: [{ type: String, required: true }],
});

const Reserva =
  mongoose.models.Reserva || mongoose.model("Reserva", reservaSchema);

export default Reserva;
