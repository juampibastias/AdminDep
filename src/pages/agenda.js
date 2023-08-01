import React from "react";
import Agenda from "../../components/Agenda";
import { connectToDatabase } from "../../utils/db";
import Reserva from "../../models/reserva";


const App = ({ eventos }) => {
  // Transformar los datos de cada reserva en el formato requerido por el calendario
  const eventosTransformados = eventos.map((reserva) => {
    // Parsear las fechas y crear objetos Date válidos
    const fechaInicio = new Date(
      reserva.fechaDisponible.split(" - ")[0] + "T00:00:00"
    );

    const fechaFin = new Date(
      reserva.fechaDisponible.split(" - ")[1] + "T23:59:59"
    );

    // Buscar la fecha en la base de datos para determinar si es "disponible" o no
    const fechaDisponible = eventos.find((fecha) => {
      return (
        fecha.dia &&
        fecha.dia.getTime &&
        fecha.dia.getTime() === fechaInicio.getTime() &&
        fecha.horaInicio &&
        fecha.horaFin &&
        fecha.horaInicio <= horaInicio &&
        fecha.horaFin >= horaFin
      );
    });

    return {
      start: fechaInicio,
      end: fechaFin,
      title: `${reserva.nombre} ${reserva.apellido}`,
      zonasDepilar: reserva.zonasDepilar,
      precioAcumulado: reserva.precioAcumulado,
      tiempoAcumulado: reserva.tiempoAcumulado,
      disponible: !!fechaDisponible, // Si fechaDisponible es undefined, será falso; de lo contrario, será verdadero
    };
  });

  return (
    <div>
      <h1>Calendario</h1>
      <Agenda events={eventosTransformados} />
    </div>
  );
};

export async function getServerSideProps() {
  await connectToDatabase();
  const eventos = await Reserva.find({});
  console.log(eventos);

  return {
    props: {
      eventos: JSON.parse(JSON.stringify(eventos)),
    },
  };
}

export default App;
