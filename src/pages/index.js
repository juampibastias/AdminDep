import Head from "next/head";
import Image from "next/image";
import Formulario from "../../components/FormularioTurno";
import Zona from "../../models/zona";
import Fecha from "../../models/fecha";
import { connectToDatabase } from "../../utils/db";

const Home = ({ zonasDepilar, fechasDisponibles }) => {
  return (
    <>
      <Head>
        <title>TurnosDep</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Image
            src="/logoKinesio.png"
            alt="Next.js Logo"
            width={100}
            height={100}
            priority
          />
          <h1>TurnosDep</h1>
        </div>
        <div>
          {" "}
          <Formulario
            zonasDepilar={zonasDepilar}
            fechasDisponibles={fechasDisponibles}
          />
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  await connectToDatabase();
  const zonasDepilar = await Zona.find({});
  const fechasDisponibles = await Fecha.find({});

  return {
    props: {
      zonasDepilar: JSON.parse(JSON.stringify(zonasDepilar)),
      fechasDisponibles: JSON.parse(JSON.stringify(fechasDisponibles)),
    },
  };
}

export default Home;
