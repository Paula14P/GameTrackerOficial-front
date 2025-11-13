import React, { useState, useEffect } from 'react';
import './BibliotecaJuegos.css';
import TarjetaJuego from './TarjetaJuego';
import FormularioJuego from './FormularioJuego';
import Notificacion from './Notificacion';
import { obtenerJuegos, eliminarJuego, actualizarJuego } from '../services/api';
import { useNotificacion } from '../hooks/useNotificacion';

function BibliotecaJuegos() {
  // Estados
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [juegoAEliminar, setJuegoAEliminar] = useState(null);
  
  // Hook de notificaciones
  const { notificacion, cerrarNotificacion, exito, error } = useNotificacion();

  // Cargar juegos al iniciar
  useEffect(() => {
    cargarJuegos();
  }, []);

  // Función para cargar juegos del backend
  const cargarJuegos = async () => {
    try {
      setCargando(true);
      const data = await obtenerJuegos();
      setJuegos(data);
    } catch (err) {
      console.error('Error al cargar juegos:', err);
      error('Error al cargar los juegos');
    } finally {
      setCargando(false);
    }
  };

  // Mostrar modal de confirmación
  const handleEliminar = (id) => {
    setJuegoAEliminar(id);
    setMostrarConfirmacion(true);
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    try {
      const resultado = await eliminarJuego(juegoAEliminar);
      cargarJuegos();
      
      if (resultado.reseñasEliminadas && resultado.reseñasEliminadas > 0) {
        exito(`Juego eliminado. También se eliminaron ${resultado.reseñasEliminadas} reseña(s)`);
      } else {
        exito('Juego eliminado correctamente');
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      error('Error al eliminar el juego');
    } finally {
      setMostrarConfirmacion(false);
      setJuegoAEliminar(null);
    }
  };

  // Cancelar eliminación
  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setJuegoAEliminar(null);
  };

  // Función para actualizar un juego
  const handleActualizar = async (id, juegoActualizado) => {
    try {
      await actualizarJuego(id, juegoActualizado);
      cargarJuegos();
      exito('Juego actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar:', err);
      error('Error al actualizar el juego');
    }
  };

  // Filtrar juegos según el filtro seleccionado
  const juegosFiltrados = juegos.filter(juego => {
    if (filtro === 'completados') return juego.completado;
    if (filtro === 'pendientes') return !juego.completado;
    return true;
  });

  return (
    <div className="biblioteca">
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
              <p>¿Estás seguro de eliminar este juego?</p>
              <p className="modal-advertencia">
                También se eliminarán todas sus reseñas asociadas.
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
      <div className="biblioteca-header">
        <div>
          <h1>Mi Biblioteca de Juegos</h1>
          <p>Gestiona tu colección personal</p>
        </div>
        
        <button 
          className="btn-agregar"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cerrar' : '➕ Agregar Juego'}
        </button>
      </div>

      {/* Formulario para agregar juego */}
      {mostrarFormulario && (
        <FormularioJuego 
          onJuegoAgregado={() => {
            cargarJuegos();
            setMostrarFormulario(false);
            exito('Juego agregado correctamente');
          }}
        />
      )}

      {/* Filtros */}
      <div className="filtros">
        <button 
          className={filtro === 'todos' ? 'filtro-btn active' : 'filtro-btn'}
          onClick={() => setFiltro('todos')}
        >
          Todos ({juegos.length})
        </button>
        
        <button 
          className={filtro === 'completados' ? 'filtro-btn active' : 'filtro-btn'}
          onClick={() => setFiltro('completados')}
        >
          Completados ({juegos.filter(j => j.completado).length})
        </button>
        
        <button 
          className={filtro === 'pendientes' ? 'filtro-btn active' : 'filtro-btn'}
          onClick={() => setFiltro('pendientes')}
        >
          Pendientes ({juegos.filter(j => !j.completado).length})
        </button>
      </div>

      {/* Grid de juegos */}
      {cargando ? (
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando juegos...</p>
        </div>
      ) : juegosFiltrados.length === 0 ? (
        <div className="sin-juegos">
          <h2>No hay juegos</h2>
          <p>Agrega tu primer juego para comenzar</p>
        </div>
      ) : (
        <div className="juegos-grid">
          {juegosFiltrados.map(juego => (
            <TarjetaJuego 
              key={juego._id}
              juego={juego}
              onEliminar={handleEliminar}
              onActualizar={handleActualizar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BibliotecaJuegos;