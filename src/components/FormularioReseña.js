import React, { useState, useEffect } from 'react';
import './FormularioReseña.css';
import { crearReseña, actualizarReseña } from '../services/api';

function FormularioReseña({ juegos, onReseñaAgregada, reseñaEditando }) {
  const [formulario, setFormulario] = useState({
    juegoId: '',
    puntuacion: 5,
    textoReseña: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true
  });

  const [enviando, setEnviando] = useState(false);
  const [hoverPuntuacion, setHoverPuntuacion] = useState(0);

  // Cargar datos de la reseña si estamos editando
  useEffect(() => {
    if (reseñaEditando) {
      // Obtener el ID correcto del juego
      const juegoId = typeof reseñaEditando.juegoId === 'object' && reseñaEditando.juegoId !== null
        ? reseñaEditando.juegoId._id
        : reseñaEditando.juegoId;

      setFormulario({
        juegoId: juegoId || '',
        puntuacion: reseñaEditando.puntuacion || 5,
        textoReseña: reseñaEditando.textoReseña || '',
        horasJugadas: reseñaEditando.horasJugadas || 0,
        dificultad: reseñaEditando.dificultad || 'Normal',
        recomendaria: reseñaEditando.recomendaria !== undefined ? reseñaEditando.recomendaria : true
      });
    }
  }, [reseñaEditando]);

  // Obtener el juego seleccionado
  const juegoSeleccionado = juegos.find(j => j._id === formulario.juegoId);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Manejar clic en estrellas
  const handleClickEstrella = (puntuacion) => {
    setFormulario({
      ...formulario,
      puntuacion: puntuacion
    });
  };

  // Renderizar estrellas interactivas
  const renderEstrellas = () => {
    const estrellas = [];
    const puntuacionMostrar = hoverPuntuacion || formulario.puntuacion;

    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={`estrella ${i <= puntuacionMostrar ? 'llena' : 'vacia'}`}
          onClick={() => handleClickEstrella(i)}
          onMouseEnter={() => setHoverPuntuacion(i)}
          onMouseLeave={() => setHoverPuntuacion(0)}
        >
          {i <= puntuacionMostrar ? '⭐' : '☆'}
        </span>
      );
    }
    return estrellas;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formulario.juegoId || !formulario.textoReseña) {
      return;
    }

    try {
      setEnviando(true);
      
      const datosReseña = {
        ...formulario,
        puntuacion: Number(formulario.puntuacion),
        horasJugadas: Number(formulario.horasJugadas)
      };

      // Crear o actualizar según el caso
      if (reseñaEditando) {
        await actualizarReseña(reseñaEditando._id, datosReseña);
      } else {
        await crearReseña(datosReseña);
      }
      
      // Limpiar formulario
      setFormulario({
        juegoId: '',
        puntuacion: 5,
        textoReseña: '',
        horasJugadas: 0,
        dificultad: 'Normal',
        recomendaria: true
      });

      // Notificar al componente padre
      onReseñaAgregada();
    } catch (err) {
      console.error('Error al guardar reseña:', err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="formulario-reseña-container">
      <div className="formulario-reseña">
        <h2>{reseñaEditando ? 'Editar Reseña' : 'Agregar Nueva Reseña'}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Layout con imagen y formulario */}
          <div className="formulario-layout">
            {/* Columna izquierda: Imagen del juego */}
            <div className="preview-juego">
              {juegoSeleccionado ? (
                <>
                  <img 
                    src={juegoSeleccionado.imagenPortada} 
                    alt={juegoSeleccionado.titulo}
                    className="preview-imagen"
                  />
                  <div className="preview-info">
                    <h3>{juegoSeleccionado.titulo}</h3>
                    <p className="preview-genero">{juegoSeleccionado.genero}</p>
                    <p className="preview-plataforma">{juegoSeleccionado.plataforma}</p>
                    <p className="preview-año">{juegoSeleccionado.añoLanzamiento}</p>
                  </div>
                </>
              ) : (
                <div className="preview-vacio">
                  <span className="icono-preview">🎮</span>
                  <p>Selecciona un juego para ver su portada</p>
                </div>
              )}
            </div>

            {/* Columna derecha: Campos del formulario */}
            <div className="formulario-campos">
              {/* Seleccionar juego */}
              <div className="form-group">
                <label>Juego *</label>
                <select
                  name="juegoId"
                  value={formulario.juegoId}
                  onChange={handleChange}
                  required
                  disabled={reseñaEditando} // Deshabilitar si estamos editando
                >
                  <option value="">Selecciona un juego</option>
                  {juegos.map(juego => (
                    <option key={juego._id} value={juego._id}>
                      {juego.titulo}
                    </option>
                  ))}
                </select>
                {reseñaEditando && (
                  <p className="ayuda-campo">No puedes cambiar el juego al editar una reseña</p>
                )}
              </div>

              {/* Puntuación con estrellas clicables */}
              <div className="form-group">
                <label>Puntuación: {formulario.puntuacion} de 5 estrellas</label>
                <div className="estrellas-interactivas">
                  {renderEstrellas()}
                </div>
                <p className="ayuda-estrellas">Haz clic en las estrellas para puntuar</p>
              </div>

              <div className="form-row">
                {/* Horas jugadas */}
                <div className="form-group">
                  <label>Horas Jugadas</label>
                  <input
                    type="number"
                    name="horasJugadas"
                    value={formulario.horasJugadas}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                  />
                </div>

                {/* Dificultad */}
                <div className="form-group">
                  <label>Dificultad</label>
                  <select
                    name="dificultad"
                    value={formulario.dificultad}
                    onChange={handleChange}
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Normal">Normal</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>

              {/* Texto de la reseña */}
              <div className="form-group">
                <label>Tu Reseña *</label>
                <textarea
                  name="textoReseña"
                  value={formulario.textoReseña}
                  onChange={handleChange}
                  placeholder="Escribe tu opinión sobre el juego..."
                  rows="6"
                  required
                />
              </div>

              {/* Checkbox recomendaría */}
              <div className="form-group-check">
                <input
                  type="checkbox"
                  name="recomendaria"
                  id="recomendaria"
                  checked={formulario.recomendaria}
                  onChange={handleChange}
                />
                <label htmlFor="recomendaria">
                  Recomendaría este juego
                </label>
              </div>

              {/* Botón de envío */}
              <button 
                type="submit" 
                className="btn-submit"
                disabled={enviando}
              >
                {enviando ? 'Guardando...' : (reseñaEditando ? 'Actualizar Reseña' : 'Guardar Reseña')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioReseña;