import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SuccessPage from './pages/SuccessPage'
import CancelPage from './pages/CancelPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
