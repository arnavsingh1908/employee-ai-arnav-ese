const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      email,
      password: hashed,
      department,
      performanceScore: 0,
      experience: 0,
    });

    await employee.save();

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ message: '✅ Signup successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, employee.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ message: '✅ Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    if (!name || !email || !department || performanceScore === undefined || !experience) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const employee = new Employee({
      name,
      email,
      department,
      skills: skills || [],
      performanceScore,
      experience,
    });

    await employee.save();
    res.status(201).json({ message: '✅ Employee added', employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search Employee by Department
exports.searchEmployee = async (req, res) => {
  try {
    const { department } = req.query;
    const employees = await Employee.find({ department });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: '✅ Employee updated', updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.json({ message: '✅ Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};