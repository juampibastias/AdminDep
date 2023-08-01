import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Agenda = ({ events }) => {
  const eventStyleGetter = (event) => {
    // Aquí definimos las clases CSS para los eventos disponibles
    if (event.disponible) {
      return {
        className: 'disponible', // Clase CSS "disponible" para resaltar los eventos disponibles
      };
    }
    return {};
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter} // Asignamos la función eventStyleGetter para personalizar el estilo de los eventos
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Agenda;
