import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token)

  // Si pas de token → redirige vers /login
  // "replace" remplace l'entrée dans l'historique pour que le bouton Retour ne ramène pas ici
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si token présent → affiche la page demandée
  return <Outlet />
}

export default ProtectedRoute
