import React from 'react';
import './TarjetaJuego.css';

function TarjetaJuego({ juego, onEliminar, onActualizar }) {
  
  // Función para marcar como completado/no completado
  const toggleCompletado = () => {
    const juegoActualizado = {
      ...juego,
      completado: !juego.completado
    };
    onActualizar(juego._id, juegoActualizado);
  };

  return (
    <div className="tarjeta-juego">
      {/* Imagen del juego */}
      <div className="tarjeta-imagen">
        <img src={juego.imagenPortada} alt={juego.titulo} />
        {juego.completado && (
          <div className="badge-completado">✓ Completado</div>
        )}
      </div>

      {/* Información del juego */}
      <div className="tarjeta-info">
        <h3 className="tarjeta-titulo">{juego.titulo}</h3>
        
        <div className="tarjeta-detalles">
          <span className="badge genero">{juego.genero}</span>
          <span className="badge plataforma">{juego.plataforma}</span>
        </div>

        <p className="tarjeta-desarrollador">
          {juego.desarrollador}
        </p>

        <p className="tarjeta-año">
          {juego.añoLanzamiento}
        </p>

        <p className="tarjeta-descripcion">
          {juego.descripcion}
        </p>

        {/* Botones de acción */}
        <div className="tarjeta-acciones">
          <button 
            className={juego.completado ? 'btn-secundario' : 'btn-primario'}
            onClick={toggleCompletado}
          >
            {juego.completado ? '↩Marcar incompleto' : '✓ Marcar completado'}
          </button>
          
          <button 
            className="btn-eliminar"
            onClick={() => onEliminar(juego._id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaJuego;