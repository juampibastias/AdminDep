import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fechaDisponible: { type: String, required: true },
  zonasDepilar: [{ type: String, required: true }],
});

const Reserva = mongoose.model("Reserva", reservaSchema);

export default Reserva;
