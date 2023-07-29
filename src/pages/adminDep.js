import React from "react";
// pages/dashboard.js
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="container">
      <h1 className="text-center mt-5">Manage Depilación</h1>
      <div className="row mt-5">
        <div className="col-md-4">
          <Link href="/adminFechas">
            <span className="btn btn-primary btn-block mb-3">
              Administrar Fechas
            </span>
          </Link>
        </div>
        <div className="col-md-4">
          <Link href="/adminZonas">
            <span className="btn btn-primary btn-block mb-3">
              Administrar Zonas
            </span>
          </Link>
        </div>
        <div className="col-md-4">
          <Link href="/agenda">
            <span className="btn btn-primary btn-block mb-3">Agenda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
