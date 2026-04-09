import axios from 'axios'

// Instance Axios configurée pour notre backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// INTERCEPTEUR REQUEST
// S'exécute automatiquement avant CHAQUE requête
// Lit le token dans localStorage et l'ajoute au header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// INTERCEPTEUR RESPONSE
// S'exécute automatiquement après CHAQUE réponse
// Si le serveur répond 401 (token expiré ou invalide) → on déconnecte l'utilisateur
api.interceptors.response.use(
  (response) => response, // si tout va bien, on retourne la réponse telle quelle
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide : on nettoie localStorage et on redirige vers login
      localStorage.removeItem('token')
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
