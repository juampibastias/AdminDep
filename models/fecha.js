import mongoose from "mongoose";

const fechaSchema = new mongoose.Schema({
  dia: {
    type: Date,
    required: true,
  },
  horaInicio: {
    type: String,
    required: true,
  },
  horaFin: {
    type: String,
    required: true,
  },
});

const Fecha = mongoose.models.Fecha || mongoose.model("Fecha", fechaSchema);

export default Fecha;
