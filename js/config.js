// js/config.js
// Define la clave del token siempre de forma global
const TOKEN_KEY = "authToken";

function getBaseApiPath() {
    // Permite configurar el endpoint vía `window.__ENV.API_BASE_URL`
    if (window.__ENV && window.__ENV.API_BASE_URL) {
        return window.__ENV.API_BASE_URL;
    }
    // Por defecto, usa `/api` en el mismo host
    return '/api';
}

var API_BASE_URL = getBaseApiPath();
