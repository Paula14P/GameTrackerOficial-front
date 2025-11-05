import React, { useState } from 'react';
import './App.css';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import ListaReseñas from './components/ListaReseñas';
import EstadisticasPersonales from './components/EstadisticasPersonales';

function App() {
  // Estado para controlar qué vista mostrar
  const [vistaActual, setVistaActual] = useState('biblioteca');

  return (
    <div className="app">
      {/* Menú lateral */}
      <aside className="sidebar">
        <div className="logo">
          <h1>GameTracker</h1>
        </div>
        
        <nav className="menu">
          <button 
            className={vistaActual === 'biblioteca' ? 'menu-item active' : 'menu-item'}
            onClick={() => setVistaActual('biblioteca')}
          >
            Biblioteca
          </button>
          
          <button 
            className={vistaActual === 'reseñas' ? 'menu-item active' : 'menu-item'}
            onClick={() => setVistaActual('reseñas')}
          >
             Reseñas
          </button>
          
          <button 
            className={vistaActual === 'estadisticas' ? 'menu-item active' : 'menu-item'}
            onClick={() => setVistaActual('estadisticas')}
          >
            Estadísticas
          </button>
        </nav>
      </aside>

      {/* Contenido principal que cambia según la vista */}
      <main className="main-content">
        {vistaActual === 'biblioteca' && <BibliotecaJuegos />}
        {vistaActual === 'reseñas' && <ListaReseñas />}
        {vistaActual === 'estadisticas' && <EstadisticasPersonales />}
      </main>
    </div>
  );
}

export default App;