import React from "react";
import Agenda from "../../components/Agenda";
import Fecha from "../../models/fecha";
import { connectToDatabase } from "../../utils/db";
import Reserva from "../../models/reserva";

const MyPage = ({ diasDisponibles, reservas }) => {
  return (
    <div>
      <Agenda diasDisponibles={diasDisponibles} reservas = {reservas}/>
    </div>
  );
};

export async function getServerSideProps() {
  await connectToDatabase
  const diasDisponibles = await Fecha.find({})
  const reservas = await Reserva.find({})
  return {
    props: {
      diasDisponibles: JSON.parse(JSON.stringify(diasDisponibles)),
      reservas: JSON.parse(JSON.stringify(reservas)),
    }
  };
}

export default MyPage;
