import React, { useState, useEffect } from 'react';
import './ListaReseñas.css';
import FormularioReseña from './FormularioReseña';
import Notificacion from './Notificacion';
import { obtenerReseñas, eliminarReseña, obtenerJuegos } from '../services/api';
import { useNotificacion } from '../hooks/useNotificacion';

function ListaReseñas() {
  const [reseñas, setReseñas] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reseñaEditando, setReseñaEditando] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [reseñaAEliminar, setReseñaAEliminar] = useState(null);

  // Hook de notificaciones
  const { notificacion, cerrarNotificacion, exito, error } = useNotificacion();

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
    } catch (err) {
      console.error('Error al cargar datos:', err);
      error('Error al cargar las reseñas');
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener el juego completo
  const obtenerJuego = (juegoId) => {
    const id = typeof juegoId === 'object' && juegoId !== null ? juegoId._id : juegoId;
    return juegos.find(j => j._id === id);
  };

  // Función para obtener el nombre del juego
  const obtenerNombreJuego = (juegoId) => {
    if (typeof juegoId === 'object' && juegoId !== null && juegoId.titulo) {
      return juegoId.titulo;
    }
    const juego = obtenerJuego(juegoId);
    return juego ? juego.titulo : 'Juego desconocido';
  };

  // Función para obtener la imagen del juego
  const obtenerImagenJuego = (juegoId) => {
    if (typeof juegoId === 'object' && juegoId !== null && juegoId.imagenPortada) {
      return juegoId.imagenPortada;
    }
    const juego = obtenerJuego(juegoId);
    return juego ? juego.imagenPortada : 'https://via.placeholder.com/200x280?text=Sin+Imagen';
  };

  // Mostrar modal de confirmación
  const handleEliminar = (id) => {
    setReseñaAEliminar(id);
    setMostrarConfirmacion(true);
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    try {
      await eliminarReseña(reseñaAEliminar);
      cargarDatos();
      exito('Reseña eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar:', err);
      error('Error al eliminar la reseña');
    } finally {
      setMostrarConfirmacion(false);
      setReseñaAEliminar(null);
    }
  };

  // Cancelar eliminación
  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setReseñaAEliminar(null);
  };

  // Función para editar una reseña
  const handleEditar = (reseña) => {
    // Si el formulario ya está abierto, cerrarlo primero
    if (mostrarFormulario) {
      setMostrarFormulario(false);
      setReseñaEditando(null);
      // Esperar un momento antes de abrir con la nueva reseña
      setTimeout(() => {
        setReseñaEditando(reseña);
        setMostrarFormulario(true);
      }, 100);
    } else {
      setReseñaEditando(reseña);
      setMostrarFormulario(true);
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
      {/* Notificaciones */}
      {notificacion && (
        <Notificacion
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          onClose={cerrarNotificacion}
        />
      )}

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="modal-overlay" onClick={cancelarEliminacion}>
          <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de eliminar esta reseña?</p>
              <p className="modal-advertencia">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cancelarEliminacion}>
                Cancelar
              </button>
              <button className="btn-confirmar-eliminar" onClick={confirmarEliminacion}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
            exito(reseñaEditando ? 'Reseña actualizada correctamente' : 'Reseña agregada correctamente');
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
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x280?text=Sin+Imagen';
                  }}
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
                    className="btn-editar-reseña"
                    onClick={() => handleEditar(reseña)}
                  >
                    Editar
                  </button>
                  
                  <button 
                    className="btn-eliminar-reseña"
                    onClick={() => handleEliminar(reseña._id)}
                  >
                    Eliminar
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