import { useEffect, useState } from 'react'
import { getLogs, getMedicines } from '../api/client'
import './Logs.css'

function Logs() {
  const [logs, setLogs]         = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [filters, setFilters]   = useState({
    medicine_id: '',
    status: '',
    from: '',
    to: ''
  })

  useEffect(() => {
    getMedicines()
      .then(res => setMedicines(res.data))
      .catch(err => setError(err.message))
  }, [])

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs(params = {}) {
    setLoading(true)
    try {
      const res = await getLogs(params)
      setLogs(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function handleSearch(e) {
    e.preventDefault()
    // Remove empty filters before sending
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    )
    fetchLogs(clean)
  }

  function handleReset() {
    setFilters({ medicine_id: '', status: '', from: '', to: '' })
    fetchLogs()
  }

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  function statusBadge(status) {
    const map = {
      taken:   'badge-taken',
      missed:  'badge-missed',
      snoozed: 'badge-snoozed'
    }
    return <span className={`badge ${map[status] || ''}`}>{status}</span>
  }

  // Summary counts from current logs
  const summary = logs.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="logs">
      <h1>Logs</h1>

      {error && <div className="alert danger">{error}</div>}

      {/* ── Summary Strip ── */}
      <div className="summary-strip">
        <div className="summary-item taken">
          <span>{summary.taken || 0}</span> Taken
        </div>
        <div className="summary-item missed">
          <span>{summary.missed || 0}</span> Missed
        </div>
        <div className="summary-item snoozed">
          <span>{summary.snoozed || 0}</span> Snoozed
        </div>
        <div className="summary-item total">
          <span>{logs.length}</span> Total
        </div>
      </div>

      {/* ── Filters ── */}
      <section className="section">
        <h2>🔍 Filter Logs</h2>
        <form onSubmit={handleSearch} className="filters">
          <div className="filter-row">
            <div className="form-group">
              <label>Medicine</label>
              <select name="medicine_id" value={filters.medicine_id} onChange={handleFilterChange}>
                <option value="">All medicines</option>
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All statuses</option>
                <option value="taken">Taken</option>
                <option value="missed">Missed</option>
                <option value="snoozed">Snoozed</option>
              </select>
            </div>

            <div className="form-group">
              <label>From date</label>
              <input type="datetime-local" name="from" value={filters.from} onChange={handleFilterChange} />
            </div>

            <div className="form-group">
              <label>To date</label>
              <input type="datetime-local" name="to" value={filters.to} onChange={handleFilterChange} />
            </div>
          </div>

          <div className="filter-actions">
            <button type="submit" className="btn primary">Apply Filters</button>
            <button type="button" className="btn secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </section>

      {/* ── Logs Table ── */}
      <section className="section">
        <h2>History ({logs.length} records)</h2>
        {loading
          ? <div className="center">Loading logs...</div>
          : logs.length === 0
            ? <p className="empty">No logs found for selected filters</p>
            : <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Medicine</th>
                    <th>Status</th>
                    <th>Triggered At</th>
                    <th>Acknowledged At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log.id}>
                      <td className="muted">{i + 1}</td>
                      <td><strong>{log.medicine_name || '—'}</strong></td>
                      <td>{statusBadge(log.status)}</td>
                      <td>{formatDate(log.triggered_at)}</td>
                      <td>{formatDate(log.acked_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
        }
      </section>
    </div>
  )
}

export default Logs
