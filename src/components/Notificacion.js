import React, { useEffect } from 'react';
import './Notificacion.css';

function Notificacion({ mensaje, tipo, onClose, duracion = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [onClose, duracion]);

  const iconos = {
    exito: '✅',
    error: '❌',
    advertencia: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`notificacion notificacion-${tipo}`}>
      <div className="notificacion-icono">
        {iconos[tipo]}
      </div>
      <div className="notificacion-contenido">
        <p>{mensaje}</p>
      </div>
      <button className="notificacion-cerrar" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}

export default Notificacion;