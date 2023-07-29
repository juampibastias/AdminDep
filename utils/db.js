import mongoose from "mongoose";

let cachedConnection = null;

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI
  const MONGODB_DB = process.env.MONGODB_DB

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside next.config.js"
    );
  }

  if (!MONGODB_DB) {
    throw new Error(
      "Please define the MONGODB_DB environment variable inside next.config.js"
    );
  }

  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: MONGODB_DB,
    });

    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
    throw new Error("Error al conectar a la base de datos");
  }
}
