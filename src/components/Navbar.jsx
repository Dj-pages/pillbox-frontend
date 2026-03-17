import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        💊 PillBox
      </div>
      <div className="navbar-links">
        <NavLink to="/"          className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/medicines" className={({ isActive }) => isActive ? 'active' : ''}>Medicines</NavLink>
        <NavLink to="/reminders" className={({ isActive }) => isActive ? 'active' : ''}>Reminders</NavLink>
        <NavLink to="/logs"      className={({ isActive }) => isActive ? 'active' : ''}>Logs</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
