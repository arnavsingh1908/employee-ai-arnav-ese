const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  searchEmployee,
  updateEmployee,
  deleteEmployee,
  signup,
  login,
} = require('../controllers/employeeController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/', addEmployee);
router.get('/', getAllEmployees);
router.get('/search', searchEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;