import { useEffect, useState } from 'react'
import { getReminders, getMedicines, addReminder, updateReminder, deleteReminder } from '../api/client'
import './Reminders.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const empty = { medicine_id: '', remind_time: '', days: [...DAYS], active: true }

function Reminders() {
  const [reminders, setReminders] = useState([])
  const [medicines, setMedicines] = useState([])
  const [form, setForm]           = useState(empty)
  const [editId, setEditId]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [msg, setMsg]             = useState(null)
  const [error, setError]         = useState(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    try {
      const [r, m] = await Promise.all([getReminders(), getMedicines()])
      setReminders(r.data)
      setMedicines(m.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function toggleDay(day) {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.days.length === 0) return setError('Select at least one day')
    try {
      if (editId) {
        await updateReminder(editId, form)
        setMsg('Reminder updated!')
      } else {
        await addReminder(form)
        setMsg('Reminder added!')
      }
      setForm(empty)
      setEditId(null)
      fetchAll()
    } catch (err) {
      setError(err.message)
    }
    setTimeout(() => { setMsg(null); setError(null) }, 3000)
  }

  function handleEdit(r) {
    setForm({
      medicine_id: r.medicine_id,
      remind_time: r.remind_time.slice(0, 5),
      days: r.days,
      active: r.active
    })
    setEditId(r.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    if (!confirm('Delete this reminder?')) return
    try {
      await deleteReminder(id)
      setMsg('Reminder deleted!')
      fetchAll()
    } catch (err) {
      setError(err.message)
    }
    setTimeout(() => setMsg(null), 3000)
  }

  async function toggleActive(r) {
    try {
      await updateReminder(r.id, { active: !r.active })
      fetchAll()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleCancel() {
    setForm(empty)
    setEditId(null)
  }

  if (loading) return <div className="center">Loading reminders...</div>

  return (
    <div className="reminders">
      <h1>Reminders</h1>

      {msg   && <div className="alert success">{msg}</div>}
      {error && <div className="alert danger">{error}</div>}

      {/* ── Form ── */}
      <section className="section">
        <h2>{editId ? '✏️ Edit Reminder' : '➕ Add Reminder'}</h2>
        <form onSubmit={handleSubmit} className="form">

          <div className="form-row">
            <div className="form-group">
              <label>Medicine *</label>
              <select name="medicine_id" value={form.medicine_id} onChange={handleChange} required>
                <option value="">— Select medicine —</option>
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>{m.name} {m.dosage ? `(${m.dosage})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="remind_time"
                value={form.remind_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Days picker */}
          <div className="form-group">
            <label>Repeat on days *</label>
            <div className="days-picker">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  className={`day-btn ${form.days.includes(day) ? 'selected' : ''}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
              <button type="button" className="day-btn all" onClick={() => setForm({ ...form, days: [...DAYS] })}>All</button>
              <button type="button" className="day-btn all" onClick={() => setForm({ ...form, days: [] })}>None</button>
            </div>
          </div>

          {/* Active toggle — only show when editing */}
          {editId && (
            <div className="form-group toggle-row">
              <label>Active</label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn primary">
              {editId ? 'Update Reminder' : 'Add Reminder'}
            </button>
            {editId && (
              <button type="button" className="btn secondary" onClick={handleCancel}>Cancel</button>
            )}
          </div>
        </form>
      </section>

      {/* ── Table ── */}
      <section className="section">
        <h2>All Reminders ({reminders.length})</h2>
        {reminders.length === 0
          ? <p className="empty">No reminders set yet</p>
          : <table className="table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Time</th>
                  <th>Days</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.medicine_name}</strong></td>
                    <td>{r.dosage || '—'}</td>
                    <td>{r.remind_time.slice(0, 5)}</td>
                    <td>
                      <div className="days-list">
                        {r.days.map(d => <span key={d} className="day-tag">{d}</span>)}
                      </div>
                    </td>
                    <td>{r.stock}</td>
                    <td>
                      <span className={`badge ${r.active ? 'badge-ok' : 'badge-off'}`}>
                        {r.active ? '🟢 Active' : '⚫ Inactive'}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn sm warning" onClick={() => handleEdit(r)}>Edit</button>
                      <button className="btn sm toggle" onClick={() => toggleActive(r)}>
                        {r.active ? 'Disable' : 'Enable'}
                      </button>
                      <button className="btn sm danger" onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </section>
    </div>
  )
}

export default Reminders
