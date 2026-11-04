import { useEffect, useState } from 'react'

const emptyForm = { name: '', email: '', course: '' }

export default function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  async function loadStudents() {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Could not load students')
      setStudents(await response.json())
    } catch (error) {
      setMessage(`${error.message}. Is the backend running?`)
    }
  }

  useEffect(() => { loadStudents() }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const url = editingId ? `/api/students/${editingId}` : '/api/students'
    const method = editingId ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Request failed')
      }
      setMessage(editingId ? 'Student updated.' : 'Student added.')
      setForm(emptyForm)
      setEditingId(null)
      await loadStudents()
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  function editStudent(student) {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course || ''
    })
    setEditingId(student.id)
    setMessage('')
  }

  async function deleteStudent(id) {
    if (!window.confirm('Delete this student?')) return
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete student')
      setMessage('Student deleted.')
      await loadStudents()
    } catch (error) {
      setMessage(error.message)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">DOCKER PRACTICE PROJECT</p>
        <h1>Student Management</h1>
        <p className="subtitle">A small React frontend connected to a Spring Boot CRUD API.</p>
      </header>

      <section className="panel">
        <h2>{editingId ? 'Update student' : 'Add a student'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>Course
            <input name="course" value={form.course} onChange={handleChange} placeholder="e.g. CSE" />
          </label>
          <div className="actions">
            <button type="submit">{editingId ? 'Save changes' : 'Add student'}</button>
            {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </section>

      <section className="panel">
        <div className="table-heading">
          <h2>Students</h2>
          <button className="secondary" onClick={loadStudents}>Refresh</button>
        </div>
        {students.length === 0 ? <p className="empty">No students yet. Add one above.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td><td>{student.name}</td><td>{student.email}</td><td>{student.course}</td>
                    <td className="row-actions">
                      <button className="small secondary" onClick={() => editStudent(student)}>Edit</button>
                      <button className="small danger" onClick={() => deleteStudent(student.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
