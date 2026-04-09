import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useAuth'
import { Briefcase, Loader2 } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate: login, isPending, error } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault() // empêche le rechargement de la page
    login({ email, password })
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo + Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <Briefcase className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">JobTracker AI</h1>
          <p className="text-slate-500 mt-1">Connecte-toi à ton espace</p>
        </div>

        {/* Card formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Connexion</h2>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
              {error.response?.data?.message || 'Email ou mot de passe incorrect'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
