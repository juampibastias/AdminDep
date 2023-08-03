import React from "react";
import Agenda from "../../components/Agenda";
import Fecha from "../../models/fecha";
import { connectToDatabase } from "../../utils/db";

const MyPage = ({ diasDisponibles }) => {
  console.log(diasDisponibles)
  return (
    <div>
      <Agenda diasDisponibles={diasDisponibles} />
    </div>
  );
};

export async function getServerSideProps() {
  await connectToDatabase
  const diasDisponibles = await Fecha.find({})
  return {
    props: {
      diasDisponibles: JSON.parse(JSON.stringify(diasDisponibles)),
    },
  };
}

export default MyPage;
