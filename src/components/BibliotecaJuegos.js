import React, { useState, useEffect } from 'react';
import './BibliotecaJuegos.css';
import TarjetaJuego from './TarjetaJuego';
import FormularioJuego from './FormularioJuego';
import { obtenerJuegos, eliminarJuego, actualizarJuego } from '../services/api';

function BibliotecaJuegos() {
  // Estados
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtro, setFiltro] = useState('todos'); // todos, completados, pendientes

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
    } catch (error) {
      console.error('Error al cargar juegos:', error);
      alert('Error al cargar los juegos');
    } finally {
      setCargando(false);
    }
  };

  // Función para eliminar un juego
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este juego?')) {
      try {
        await eliminarJuego(id);
        cargarJuegos(); // Recargar lista
        alert('Juego eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el juego');
      }
    }
  };

  // Función para actualizar un juego
  const handleActualizar = async (id, juegoActualizado) => {
    try {
      await actualizarJuego(id, juegoActualizado);
      cargarJuegos(); // Recargar lista
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar el juego');
    }
  };

  // Filtrar juegos según el filtro seleccionado
  const juegosFiltrados = juegos.filter(juego => {
    if (filtro === 'completados') return juego.completado;
    if (filtro === 'pendientes') return !juego.completado;
    return true; // todos
  });

  return (
    <div className="biblioteca">
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