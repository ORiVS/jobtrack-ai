import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import useAuthStore from '../stores/authStore'

export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (credentials) =>
      api.post('/auth/login', credentials).then((res) => res.data),

    onSuccess: (data) => {
      // On stocke l'utilisateur et le token dans Zustand (+ localStorage via persist)
      setAuth(data.user, data.token)
      navigate('/dashboard')
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (formData) =>
      api.post('/auth/register', formData).then((res) => res.data),

    onSuccess: (data) => {
      // Après register, on connecte directement l'utilisateur
      // Pour ça, on fait un login automatique
      navigate('/login')
    },
  })
}
