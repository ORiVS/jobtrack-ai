import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../../hooks/useAuth'
import { Briefcase, Loader2 } from 'lucide-react'

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    targetStack: '',
    targetCity: '',
    targetContractType: '',
  })

  const { mutate: register, isPending, error } = useRegister()

  // Un seul handler pour tous les champs grâce à l'objet form
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    register(form)
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
          <p className="text-slate-500 mt-1">Crée ton espace de suivi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Créer un compte</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
              {error.response?.data?.message || 'Une erreur est survenue'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Alex Rivera"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="ton@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Séparateur — préférences optionnelles */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide font-medium">
                Préférences (optionnel — utilisées par l'IA pour le score)
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={form.targetStack}
                  onChange={handleChange('targetStack')}
                  placeholder="Stack cible : React, Node.js, Python..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
                <input
                  type="text"
                  value={form.targetCity}
                  onChange={handleChange('targetCity')}
                  placeholder="Ville cible : Paris, Lyon, Remote..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
                <select
                  value={form.targetContractType}
                  onChange={handleChange('targetContractType')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm text-slate-600"
                >
                  <option value="">Type de contrat recherché</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="STAGE">Stage</option>
                  <option value="ALTERNANCE">Alternance</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Création...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
