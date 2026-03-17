import { useEffect, useState } from 'react'
import { getDashboard } from '../api/client'
import './Dashboard.css'

function Dashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="center">Loading dashboard...</div>
  if (error)   return <div className="center error">Error: {error}</div>

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* ── Today's Summary ── */}
      <section className="section">
        <h2>Today's Summary</h2>
        <div className="stats-grid">
          <div className="stat-card taken">
            <span className="stat-num">{data.today.taken}</span>
            <span className="stat-label">Taken</span>
          </div>
          <div className="stat-card missed">
            <span className="stat-num">{data.today.missed}</span>
            <span className="stat-label">Missed</span>
          </div>
          <div className="stat-card snoozed">
            <span className="stat-num">{data.today.snoozed}</span>
            <span className="stat-label">Snoozed</span>
          </div>
          <div className="stat-card total">
            <span className="stat-num">{data.total_medicines}</span>
            <span className="stat-label">Total Medicines</span>
          </div>
        </div>
      </section>

      {/* ── Upcoming Reminders ── */}
      <section className="section">
        <h2>Upcoming Reminders Today</h2>
        {data.upcoming_reminders.length === 0
          ? <p className="empty">No more reminders for today</p>
          : <table className="table">
              <thead>
                <tr><th>Time</th><th>Medicine</th><th>Dosage</th></tr>
              </thead>
              <tbody>
                {data.upcoming_reminders.map(r => (
                  <tr key={r.id}>
                    <td>{r.remind_time.slice(0,5)}</td>
                    <td>{r.medicine_name}</td>
                    <td>{r.dosage || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </section>

      {/* ── Low Stock Alerts ── */}
      <section className="section">
        <h2>⚠️ Low Stock Alerts</h2>
        {data.low_stock_alerts.length === 0
          ? <p className="empty">All medicines are well stocked</p>
          : <table className="table">
              <thead>
                <tr><th>Medicine</th><th>Stock</th><th>Threshold</th></tr>
              </thead>
              <tbody>
                {data.low_stock_alerts.map(m => (
                  <tr key={m.id} className="low-stock-row">
                    <td>{m.name}</td>
                    <td className="danger">{m.stock}</td>
                    <td>{m.low_stock_threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </section>
    </div>
  )
}

export default Dashboard
