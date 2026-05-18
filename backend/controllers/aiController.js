const axios = require('axios');
const Employee = require('../models/Employee');

exports.getRecommendation = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const prompt = `Based on this employee data:
Name: ${employee.name}
Department: ${employee.department}
Skills: ${employee.skills.join(', ')}
Performance Score: ${employee.performanceScore}/100
Experience: ${employee.experience} years

Provide:
1. Promotion recommendation (yes/no with reason)
2. Training suggestions
3. Overall feedback

Keep it brief and professional.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const recommendation = response.data.choices[0].message.content;

    res.json({ 
      employeeName: employee.name,
      recommendation 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
