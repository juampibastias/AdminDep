import mongoose from "mongoose";

const zonaSchema = new mongoose.Schema({
  zona: {
    type: String,
    required: true,
  },
  tiempo: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
});

const Zona = mongoose.models.Zona || mongoose.model("Zona", zonaSchema);

export default Zona;
