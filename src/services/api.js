import axios from 'axios';

// URL base del backend
const API_URL = 'http://localhost:5000/api';

// ===== FUNCIONES PARA JUEGOS =====

// Obtener todos los juegos
export const obtenerJuegos = async () => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data;
};

// Obtener un juego por ID
export const obtenerJuegoPorId = async (id) => {
  const response = await axios.get(`${API_URL}/games/${id}`);
  return response.data;
};

// Crear un nuevo juego
export const crearJuego = async (juego) => {
  const response = await axios.post(`${API_URL}/games`, juego);
  return response.data;
};

// Actualizar un juego
export const actualizarJuego = async (id, juego) => {
  const response = await axios.put(`${API_URL}/games/${id}`, juego);
  return response.data;
};

// Eliminar un juego
export const eliminarJuego = async (id) => {
  const response = await axios.delete(`${API_URL}/games/${id}`);
  return response.data;
};

// ===== FUNCIONES PARA RESEÑAS =====

// Obtener todas las reseñas
export const obtenerReseñas = async () => {
  const response = await axios.get(`${API_URL}/reviews`);
  return response.data;
};

// Obtener reseñas por juego
export const obtenerReseñasPorJuego = async (juegoId) => {
  const response = await axios.get(`${API_URL}/reviews/game/${juegoId}`);
  return response.data;
};

// Crear una reseña
export const crearReseña = async (reseña) => {
  const response = await axios.post(`${API_URL}/reviews`, reseña);
  return response.data;
};

// Actualizar una reseña
export const actualizarReseña = async (id, reseña) => {
  const response = await axios.put(`${API_URL}/reviews/${id}`, reseña);
  return response.data;
};

// Eliminar una reseña
export const eliminarReseña = async (id) => {
  const response = await axios.delete(`${API_URL}/reviews/${id}`);
  return response.data;
};