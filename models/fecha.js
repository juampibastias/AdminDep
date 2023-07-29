import mongoose from "mongoose";

const fechaSchema = new mongoose.Schema({
  desde: {
    type: Date,
    required: true,
  },
  hasta: {
    type: Date,
    required: true,
  },
});

const Fecha = mongoose.models.Fecha || mongoose.model("Fecha", fechaSchema);

export default Fecha;
