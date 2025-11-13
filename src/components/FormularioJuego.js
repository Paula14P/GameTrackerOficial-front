import React, { useState, useEffect } from 'react';
import './FormularioJuego.css';
import { crearJuego, actualizarJuego } from '../services/api';

function FormularioJuego({ onJuegoAgregado, juegoEditando }) {
  // Estado del formulario
  const [formulario, setFormulario] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    añoLanzamiento: '',
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });

  const [enviando, setEnviando] = useState(false);

  // Cargar datos del juego si estamos editando
  useEffect(() => {
    if (juegoEditando) {
      setFormulario({
        titulo: juegoEditando.titulo || '',
        genero: juegoEditando.genero || '',
        plataforma: juegoEditando.plataforma || '',
        añoLanzamiento: juegoEditando.añoLanzamiento || '',
        desarrollador: juegoEditando.desarrollador || '',
        imagenPortada: juegoEditando.imagenPortada || '',
        descripcion: juegoEditando.descripcion || '',
        completado: juegoEditando.completado || false
      });
    }
  }, [juegoEditando]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formulario.titulo || !formulario.genero || !formulario.plataforma) {
      return;
    }

    try {
      setEnviando(true);
      
      // Preparar datos del juego
      const datosJuego = {
        ...formulario,
        añoLanzamiento: formulario.añoLanzamiento || new Date().getFullYear(),
        imagenPortada: formulario.imagenPortada || 'https://via.placeholder.com/300x400?text=Sin+Imagen',
        descripcion: formulario.descripcion || 'Sin descripción'
      };

      // Crear o actualizar según el caso
      if (juegoEditando) {
        await actualizarJuego(juegoEditando._id, datosJuego);
      } else {
        await crearJuego(datosJuego);
      }
      
      // Limpiar formulario
      setFormulario({
        titulo: '',
        genero: '',
        plataforma: '',
        añoLanzamiento: '',
        desarrollador: '',
        imagenPortada: '',
        descripcion: '',
        completado: false
      });

      // Notificar al componente padre
      onJuegoAgregado();
    } catch (err) {
      console.error('Error al guardar juego:', err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="formulario-juego-container">
      <div className="formulario-juego">
        <h2>{juegoEditando ? '✏️ Editar Juego' : '➕ Agregar Nuevo Juego'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Título */}
            <div className="form-group">
              <label>Título del Juego *</label>
              <input
                type="text"
                name="titulo"
                value={formulario.titulo}
                onChange={handleChange}
                placeholder="Ej: The Legend of Zelda"
                required
              />
            </div>

            {/* Género */}
            <div className="form-group">
              <label>Género *</label>
              <select
                name="genero"
                value={formulario.genero}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un género</option>
                <option value="Aventura">Aventura</option>
                <option value="Acción">Acción</option>
                <option value="RPG">RPG</option>
                <option value="Estrategia">Estrategia</option>
                <option value="Deportes">Deportes</option>
                <option value="Sandbox">Sandbox</option>
                <option value="Simulación">Simulación</option>
                <option value="Horror">Horror</option>
                <option value="Puzzle">Puzzle</option>
                <option value="FPS">FPS</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Plataforma */}
            <div className="form-group">
              <label>Plataforma *</label>
              <select
                name="plataforma"
                value={formulario.plataforma}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una plataforma</option>
                <option value="PC">PC</option>
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="PlayStation 4">PlayStation 4</option>
                <option value="Xbox Series X/S">Xbox Series X/S</option>
                <option value="Xbox One">Xbox One</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Multiplataforma">Multiplataforma</option>
              </select>
            </div>

            {/* Año */}
            <div className="form-group">
              <label>Año de Lanzamiento</label>
              <input
                type="number"
                name="añoLanzamiento"
                value={formulario.añoLanzamiento}
                onChange={handleChange}
                placeholder="2024"
                min="1980"
                max="2030"
              />
            </div>
          </div>

          <div className="form-row">
            {/* Desarrollador */}
            <div className="form-group">
              <label>Desarrollador</label>
              <input
                type="text"
                name="desarrollador"
                value={formulario.desarrollador}
                onChange={handleChange}
                placeholder="Ej: Nintendo"
              />
            </div>

            {/* Imagen */}
            <div className="form-group">
              <label>URL de la Imagen (opcional)</label>
              <input
                type="url"
                name="imagenPortada"
                value={formulario.imagenPortada}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              placeholder="Describe el juego..."
              rows="4"
            />
          </div>

          {/* Checkbox completado */}
          <div className="form-group-check">
            <input
              type="checkbox"
              name="completado"
              id="completado"
              checked={formulario.completado}
              onChange={handleChange}
            />
            <label htmlFor="completado">
              ✓ Marcar como completado
            </label>
          </div>

          {/* Botón de envío */}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={enviando}
          >
            {enviando ? 'Guardando...' : (juegoEditando ? 'Actualizar Juego' : 'Guardar Juego')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioJuego;