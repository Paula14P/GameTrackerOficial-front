import React, { useState, useEffect } from 'react';
import './ListaReseñas.css';
import FormularioReseña from './FormularioReseña';
import { obtenerReseñas, eliminarReseña, obtenerJuegos } from '../services/api';

function ListaReseñas() {
  const [reseñas, setReseñas] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reseñaEditando, setReseñaEditando] = useState(null);

  // Cargar reseñas y juegos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [reseñasData, juegosData] = await Promise.all([
        obtenerReseñas(),
        obtenerJuegos()
      ]);
      setReseñas(reseñasData);
      setJuegos(juegosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar las reseñas');
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener el nombre del juego
  const obtenerNombreJuego = (juegoId) => {
    const juego = juegos.find(j => j._id === juegoId);
    return juego ? juego.titulo : 'Juego desconocido';
  };

  // Función para obtener la imagen del juego
  const obtenerImagenJuego = (juegoId) => {
    const juego = juegos.find(j => j._id === juegoId);
    return juego ? juego.imagenPortada : 'https://via.placeholder.com/100';
  };

  // Función para eliminar reseña
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
      try {
        await eliminarReseña(id);
        cargarDatos();
        alert('Reseña eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la reseña');
      }
    }
  };

  // Función para renderizar estrellas
  const renderEstrellas = (puntuacion) => {
    return '⭐'.repeat(puntuacion) + '☆'.repeat(5 - puntuacion);
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="lista-reseñas">
      {/* Encabezado */}
      <div className="reseñas-header">
        <div>
          <h1>Mis Reseñas</h1>
          <p>Comparte tu opinión sobre los juegos</p>
        </div>
        
        <button 
          className="btn-agregar"
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setReseñaEditando(null);
          }}
        >
          {mostrarFormulario ? '✕ Cerrar' : '➕ Agregar Reseña'}
        </button>
      </div>

      {/* Formulario para agregar/editar reseña */}
      {mostrarFormulario && (
        <FormularioReseña 
          juegos={juegos}
          reseñaEditando={reseñaEditando}
          onReseñaAgregada={() => {
            cargarDatos();
            setMostrarFormulario(false);
            setReseñaEditando(null);
          }}
        />
      )}

      {/* Lista de reseñas */}
      {cargando ? (
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando reseñas...</p>
        </div>
      ) : reseñas.length === 0 ? (
        <div className="sin-reseñas">
          <h2>No hay reseñas</h2>
          <p>Agrega tu primera reseña para comenzar</p>
        </div>
      ) : (
        <div className="reseñas-container">
          {reseñas.map(reseña => (
            <div key={reseña._id} className="reseña-card">
              {/* Imagen del juego */}
              <div className="reseña-imagen">
                <img 
                  src={obtenerImagenJuego(reseña.juegoId)} 
                  alt={obtenerNombreJuego(reseña.juegoId)} 
                />
              </div>

              {/* Contenido de la reseña */}
              <div className="reseña-contenido">
                <div className="reseña-header-card">
                  <div>
                    <h3>{obtenerNombreJuego(reseña.juegoId)}</h3>
                    <div className="reseña-estrellas">
                      {renderEstrellas(reseña.puntuacion)}
                      <span className="puntuacion-numero">
                        {reseña.puntuacion}/5
                      </span>
                    </div>
                  </div>
                  
                  <div className="reseña-badges">
                    <span className="badge-dificultad">{reseña.dificultad}</span>
                    {reseña.recomendaria && (
                      <span className="badge-recomendado">Recomendado</span>
                    )}
                  </div>
                </div>

                <p className="reseña-texto">{reseña.textoReseña}</p>

                <div className="reseña-info">
                  <span>{reseña.horasJugadas} horas jugadas</span>
                  <span>{formatearFecha(reseña.fechaCreacion)}</span>
                </div>

                {/* Botones de acción */}
                <div className="reseña-acciones">
                  <button 
                    className="btn-eliminar-reseña"
                    onClick={() => handleEliminar(reseña._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaReseñas;