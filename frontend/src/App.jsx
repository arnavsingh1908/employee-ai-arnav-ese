import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'https://employee-ai-arnav-ese.onrender.com/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: '',
  });
  const [recommendation, setRecommendation] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch employees on load
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/employees`, {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      setForm({
        name: '',
        email: '',
        department: '',
        skills: '',
        performanceScore: '',
        experience: '',
      });
      fetchEmployees();
      alert('✅ Employee added successfully!');
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    }
  };

  // Get recommendation
  const handleGetRecommendation = async (employeeId) => {
    setLoading(true);
    setSelectedEmpId(employeeId);
    try {
      const res = await axios.post(`${API}/ai/recommend`, { employeeId });
      setRecommendation(res.data.recommendation);
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API}/employees/${id}`);
        fetchEmployees();
        alert('✅ Employee deleted');
      } catch (error) {
        alert('❌ Error: ' + error.message);
      }
    }
  };

  return (
    <div className="App">
      <h1>⚡ Employee Performance Analytics</h1>

      {/* Add Employee Form */}
      <div className="form-section">
        <h2>Add New Employee</h2>
        <form onSubmit={handleAddEmployee}>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <input
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <input
            placeholder="Performance Score (0-100)"
            type="number"
            min="0"
            max="100"
            value={form.performanceScore}
            onChange={(e) => setForm({ ...form, performanceScore: e.target.value })}
            required
          />
          <input
            placeholder="Years of Experience"
            type="number"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            required
          />
          <button type="submit">✚ Add Employee</button>
        </form>
      </div>

      {/* Employee List */}
      <div className="list-section">
        <h2>Employees ({employees.length})</h2>
        {employees.length === 0 ? (
          <p className="empty">No employees yet. Add one to get started!</p>
        ) : (
          employees.map((emp) => (
            <div key={emp._id} className="employee-card">
              <div className="emp-info">
                <h3>{emp.name}</h3>
                <p><strong>Department:</strong> {emp.department}</p>
                <p><strong>Score:</strong> {emp.performanceScore}/100 | <strong>Exp:</strong> {emp.experience} yrs</p>
                <p><strong>Skills:</strong> {emp.skills.length > 0 ? emp.skills.join(', ') : 'N/A'}</p>
              </div>
              <div className="emp-actions">
                <button 
                  onClick={() => handleGetRecommendation(emp._id)}
                  className="rec-btn"
                >
                  🤖 Get AI Recommendation
                </button>
                <button 
                  onClick={() => handleDelete(emp._id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Recommendation */}
      {recommendation && (
        <div className="recommendation-section">
          <h2>🤖 AI Recommendation</h2>
          <div className="rec-content">
            <p>{recommendation}</p>
          </div>
          <button onClick={() => setRecommendation('')} className="close-rec">✕ Clear</button>
        </div>
      )}

      {loading && <div className="loading">⏳ AI is analyzing...</div>}
    </div>
  );
}

export default App;