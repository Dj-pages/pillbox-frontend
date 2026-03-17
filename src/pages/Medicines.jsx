import { useEffect, useState } from 'react'
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from '../api/client'
import './Medicines.css'

const empty = { name: '', dosage: '', stock: '', low_stock_threshold: 5 }

function Medicines() {
  const [medicines, setMedicines] = useState([])
  const [form, setForm]           = useState(empty)
  const [editId, setEditId]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [msg, setMsg]             = useState(null)

  useEffect(() => { fetchMedicines() }, [])

  async function fetchMedicines() {
    try {
      const res = await getMedicines()
      setMedicines(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editId) {
        await updateMedicine(editId, form)
        setMsg('Medicine updated!')
      } else {
        await addMedicine(form)
        setMsg('Medicine added!')
      }
      setForm(empty)
      setEditId(null)
      fetchMedicines()
    } catch (err) {
      setError(err.message)
    }
    setTimeout(() => setMsg(null), 3000)
  }

  function handleEdit(m) {
    setForm({ name: m.name, dosage: m.dosage || '', stock: m.stock, low_stock_threshold: m.low_stock_threshold })
    setEditId(m.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    if (!confirm('Delete this medicine? All its reminders will also be deleted.')) return
    try {
      await deleteMedicine(id)
      setMsg('Medicine deleted!')
      fetchMedicines()
    } catch (err) {
      setError(err.message)
    }
    setTimeout(() => setMsg(null), 3000)
  }

  function handleCancel() {
    setForm(empty)
    setEditId(null)
  }

  if (loading) return <div className="center">Loading medicines...</div>

  return (
    <div className="medicines">
      <h1>Medicines</h1>

      {msg   && <div className="alert success">{msg}</div>}
      {error && <div className="alert danger">{error}</div>}

      {/* ── Form ── */}
      <section className="section">
        <h2>{editId ? '✏️ Edit Medicine' : '➕ Add Medicine'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol"
                required
              />
            </div>
            <div className="form-group">
              <label>Dosage</label>
              <input
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                placeholder="e.g. 500mg"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Stock (number of pills) *</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="e.g. 30"
                required
              />
            </div>
            <div className="form-group">
              <label>Low Stock Alert Threshold</label>
              <input
                name="low_stock_threshold"
                type="number"
                min="1"
                value={form.low_stock_threshold}
                onChange={handleChange}
                placeholder="e.g. 5"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary">
              {editId ? 'Update Medicine' : 'Add Medicine'}
            </button>
            {editId && (
              <button type="button" className="btn secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ── Table ── */}
      <section className="section">
        <h2>All Medicines ({medicines.length})</h2>
        {medicines.length === 0
          ? <p className="empty">No medicines added yet</p>
          : <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Stock</th>
                  <th>Alert At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.dosage || '—'}</td>
                    <td>{m.stock}</td>
                    <td>{m.low_stock_threshold}</td>
                    <td>
                      <span className={`badge ${m.stock <= m.low_stock_threshold ? 'badge-danger' : 'badge-ok'}`}>
                        {m.stock <= m.low_stock_threshold ? '⚠️ Low' : '✅ OK'}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn sm warning" onClick={() => handleEdit(m)}>Edit</button>
                      <button className="btn sm danger"  onClick={() => handleDelete(m.id)}>Delete</button>
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

export default Medicines
