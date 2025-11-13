import { useState, useCallback } from 'react';

export const useNotificacion = () => {
  const [notificacion, setNotificacion] = useState(null);

  const mostrarNotificacion = useCallback((mensaje, tipo = 'info') => {
    setNotificacion({ mensaje, tipo });
  }, []);

  const cerrarNotificacion = useCallback(() => {
    setNotificacion(null);
  }, []);

  const exito = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'exito');
  }, [mostrarNotificacion]);

  const error = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'error');
  }, [mostrarNotificacion]);

  const advertencia = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'advertencia');
  }, [mostrarNotificacion]);

  const info = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'info');
  }, [mostrarNotificacion]);

  return {
    notificacion,
    cerrarNotificacion,
    exito,
    error,
    advertencia,
    info
  };
};