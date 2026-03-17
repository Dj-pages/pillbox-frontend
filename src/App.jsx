import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Medicines from './pages/Medicines'
import Reminders from './pages/Reminders'
import Logs from './pages/Logs'

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/logs"      element={<Logs />} />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
