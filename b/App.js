import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    department_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Format date to yyyy-mm-dd for date input
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:3001/employees");
    setEmployees(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:3001/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, dob, phone, email, department_id } = form;

    if (!name || !dob || !phone || !email || !department_id) {
      alert("All fields required");
      return;
    }

    if (editingId === null) {
      await axios.post("http://localhost:3001/employees", form);
    } else {
      await axios.put(`http://localhost:3001/employees/${editingId}`, form);
    }

    setForm({ name: "", dob: "", phone: "", email: "", department_id: "" });
    setEditingId(null);
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/employees/${id}`);
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      dob: formatDate(emp.dob),
      phone: emp.phone,
      email: emp.email,
      department_id: emp.department_id,
    });
    setEditingId(emp.id);
  };

  return (
    <div className="container mt-4">
      <h2>Employee Management System</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <select
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button className="btn btn-primary">
          {editingId ? "Update" : "Add"} Employee
        </button>
      </form>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{formatDate(emp.dob)}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                <button
                  onClick={() => handleEdit(emp)}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
