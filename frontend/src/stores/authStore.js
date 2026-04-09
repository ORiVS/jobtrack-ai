import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store Zustand avec persistence automatique dans localStorage
// "persist" synchronise automatiquement l'état avec localStorage
// Quand l'utilisateur revient sur le site, l'état est restauré automatiquement
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Appelé après login ou register réussi
      setAuth: (user, token) => {
        localStorage.setItem('token', token) // aussi dans localStorage pour l'intercepteur Axios
        set({ user, token })
      },

      // Appelé au logout
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
    }),
    {
      name: 'auth-storage', // clé utilisée dans localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

export default useAuthStore
