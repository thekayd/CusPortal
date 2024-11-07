const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  empID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create an Employee model based on the schema
const EmployeeModel = mongoose.model('Employee', employeeSchema);

// Employee Data (This will be inserted into the database with hashed passwords)
const employees = [
  { name: 'Jane Smith', empID: '001', email: 'jane@example.com', password: 'test@01' },
  { name: 'Tim Monty', empID: '002', email: 'tim@example.com', password: 'test@01' },
  { name: 'Ruth Nell', empID: '003', email: 'ruth@example.com', password: 'test@01' },
];

// Function to hash passwords
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Function to add employees to the Employee collection
async function addEmployees() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add each employee, hashing the password before saving
    for (const employee of employees) {
      const hashedPassword = await hashPassword(employee.password);

      // Create a new employee document with hashed password
      const newEmployee = new EmployeeModel({
        ...employee,
        password: hashedPassword,
      });

      // Save the employee to the Employee collection in MongoDB
      await newEmployee.save();
      console.log('Employee added:', newEmployee);
    }
  } catch (error) {
    console.error('Error adding employees:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the addEmployees function
addEmployees();