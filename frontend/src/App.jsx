import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Pages protégées — stubs temporaires, on les remplacera phase par phase
const DashboardPage = () => <div className="p-8 text-2xl font-bold">Dashboard — bientôt</div>
const ApplicationsPage = () => <div className="p-8 text-2xl font-bold">Candidatures — bientôt</div>
const AddApplicationPage = () => <div className="p-8 text-2xl font-bold">Ajouter — bientôt</div>
const ApplicationDetailPage = () => <div className="p-8 text-2xl font-bold">Détail — bientôt</div>
const StatisticsPage = () => <div className="p-8 text-2xl font-bold">Statistiques — bientôt</div>
const ProfilePage = () => <div className="p-8 text-2xl font-bold">Profil — bientôt</div>

const App = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes protégées — ProtectedRoute vérifie le token avant d'afficher */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/new" element={<AddApplicationPage />} />
        <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Toute autre URL → redirige vers dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
