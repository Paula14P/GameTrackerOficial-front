import React, { useState, useEffect } from 'react';
import './EstadisticasPersonales.css';
import { obtenerJuegos, obtenerReseñas } from '../services/api';

function EstadisticasPersonales() {
  const [juegos, setJuegos] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalJuegos: 0,
    juegosCompletados: 0,
    juegosPendientes: 0,
    totalReseñas: 0,
    totalHorasJugadas: 0,
    promedioCalificacion: 0,
    generoFavorito: '',
    plataformaFavorita: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [juegosData, reseñasData] = await Promise.all([
        obtenerJuegos(),
        obtenerReseñas()
      ]);
      
      setJuegos(juegosData);
      setReseñas(reseñasData);
      calcularEstadisticas(juegosData, reseñasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar las estadísticas');
    } finally {
      setCargando(false);
    }
  };

  const calcularEstadisticas = (juegosData, reseñasData) => {
    // Total de juegos
    const totalJuegos = juegosData.length;
    
    // Juegos completados y pendientes
    const juegosCompletados = juegosData.filter(j => j.completado).length;
    const juegosPendientes = totalJuegos - juegosCompletados;
    
    // Total de reseñas
    const totalReseñas = reseñasData.length;
    
    // Total de horas jugadas
    const totalHorasJugadas = reseñasData.reduce((total, r) => total + r.horasJugadas, 0);
    
    // Promedio de calificación
    const promedioCalificacion = totalReseñas > 0
      ? (reseñasData.reduce((total, r) => total + r.puntuacion, 0) / totalReseñas).toFixed(1)
      : 0;
    
    // Género favorito (el que más se repite)
    const generos = juegosData.map(j => j.genero);
    const generoFavorito = obtenerMasFrecuente(generos) || 'N/A';
    
    // Plataforma favorita
    const plataformas = juegosData.map(j => j.plataforma);
    const plataformaFavorita = obtenerMasFrecuente(plataformas) || 'N/A';

    setEstadisticas({
      totalJuegos,
      juegosCompletados,
      juegosPendientes,
      totalReseñas,
      totalHorasJugadas,
      promedioCalificacion,
      generoFavorito,
      plataformaFavorita
    });
  };

  // Función auxiliar para obtener el elemento más frecuente
  const obtenerMasFrecuente = (arr) => {
    if (arr.length === 0) return null;
    
    const frecuencia = {};
    arr.forEach(item => {
      frecuencia[item] = (frecuencia[item] || 0) + 1;
    });
    
    return Object.keys(frecuencia).reduce((a, b) => 
      frecuencia[a] > frecuencia[b] ? a : b
    );
  };

  // Obtener juegos mejor calificados
  const obtenerMejoresJuegos = () => {
    const juegosConCalificacion = juegos.map(juego => {
      const reseñasDelJuego = reseñas.filter(r => {
        const id = typeof r.juegoId === 'object' ? r.juegoId._id : r.juegoId;
        return id === juego._id;
      });
      
      if (reseñasDelJuego.length === 0) return null;
      
      const promedioCalif = reseñasDelJuego.reduce((sum, r) => sum + r.puntuacion, 0) / reseñasDelJuego.length;
      
      return {
        ...juego,
        calificacion: promedioCalif
      };
    }).filter(j => j !== null);

    return juegosConCalificacion
      .sort((a, b) => b.calificacion - a.calificacion)
      .slice(0, 5);
  };

  const mejoresJuegos = obtenerMejoresJuegos();

  return (
    <div className="estadisticas">
      {/* Encabezado */}
      <div className="estadisticas-header">
        <h1>📊 Mis Estadísticas</h1>
        <p>Resumen de tu actividad como gamer</p>
      </div>

      {cargando ? (
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      ) : (
        <>
          {/* Cards de estadísticas principales */}
          <div className="stats-grid">
            <div className="stat-card card-juegos">
              <div className="stat-icono">🎮</div>
              <div className="stat-info">
                <h3>{estadisticas.totalJuegos}</h3>
                <p>Juegos en Biblioteca</p>
              </div>
            </div>

            <div className="stat-card card-completados">
              <div className="stat-icono">✅</div>
              <div className="stat-info">
                <h3>{estadisticas.juegosCompletados}</h3>
                <p>Juegos Completados</p>
              </div>
            </div>

            <div className="stat-card card-pendientes">
              <div className="stat-icono">⏳</div>
              <div className="stat-info">
                <h3>{estadisticas.juegosPendientes}</h3>
                <p>Juegos Pendientes</p>
              </div>
            </div>

            <div className="stat-card card-reseñas">
              <div className="stat-icono">⭐</div>
              <div className="stat-info">
                <h3>{estadisticas.totalReseñas}</h3>
                <p>Reseñas Escritas</p>
              </div>
            </div>

            <div className="stat-card card-horas">
              <div className="stat-icono">🕐</div>
              <div className="stat-info">
                <h3>{estadisticas.totalHorasJugadas}</h3>
                <p>Horas Jugadas</p>
              </div>
            </div>

            <div className="stat-card card-promedio">
              <div className="stat-icono">⭐</div>
              <div className="stat-info">
                <h3>{estadisticas.promedioCalificacion}</h3>
                <p>Calificación Promedio</p>
              </div>
            </div>
          </div>

          {/* Sección de preferencias */}
          <div className="preferencias-section">
            <h2>🎯 Tus Preferencias</h2>
            <div className="preferencias-grid">
              <div className="preferencia-card">
                <div className="preferencia-icono"> </div>
                <div className="preferencia-info">
                  <p className="preferencia-label">Género Favorito</p>
                  <h3>{estadisticas.generoFavorito}</h3>
                </div>
              </div>

              <div className="preferencia-card">
                <div className="preferencia-icono">🎮</div>
                <div className="preferencia-info">
                  <p className="preferencia-label">Plataforma Favorita</p>
                  <h3>{estadisticas.plataformaFavorita}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Mejores Juegos */}
          {mejoresJuegos.length > 0 && (
            <div className="top-juegos-section">
              <h2>Top 5 Mejores Juegos</h2>
              <div className="top-juegos-lista">
                {mejoresJuegos.map((juego, index) => (
                  <div key={juego._id} className="top-juego-item">
                    <div className="top-numero">#{index + 1}</div>
                    <img 
                      src={juego.imagenPortada} 
                      alt={juego.titulo}
                      className="top-juego-imagen"
                    />
                    <div className="top-juego-info">
                      <h4>{juego.titulo}</h4>
                      <p className="top-juego-genero">{juego.genero}</p>
                    </div>
                    <div className="top-juego-calificacion">
                      <span className="estrellas-top">
                        {'⭐'.repeat(Math.round(juego.calificacion))}
                      </span>
                      <span className="numero-calificacion">
                        {juego.calificacion.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje si no hay datos */}
          {estadisticas.totalJuegos === 0 && (
            <div className="sin-datos">
              <h2>📊 No hay suficientes datos</h2>
              <p>Agrega juegos y reseñas para ver tus estadísticas</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EstadisticasPersonales;