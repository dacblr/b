const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rishit@123',
  database: 'WptL2',
});

app.get('/employees', (req, res) => {
  const query = `
    SELECT e.id, e.name, e.dob, e.phone, e.email, e.department_id, d.name AS department
    FROM employee e
    JOIN departments d ON e.department_id = d.id
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/departments', (req, res) => {
  db.query("SELECT * FROM departments", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post('/employees', (req, res) => {
  const { name, dob, phone, email, department_id } = req.body;
  db.query(
    'INSERT INTO employee (name, dob, phone, email, department_id) VALUES (?, ?, ?, ?, ?)',
    [name, dob, phone, email, department_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Inserted");
    }
  );
});

app.put('/employees/:id', (req, res) => {
  const { name, dob, phone, email, department_id } = req.body;
  db.query(
    'UPDATE employee SET name = ?, dob = ?, phone = ?, email = ?, department_id = ? WHERE id = ?',
    [name, dob, phone, email, department_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Updated");
    }
  );
});

app.delete('/employees/:id', (req, res) => {
  db.query('DELETE FROM employee WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Deleted");
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
