import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div>
                  <Link to="/" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-gray-500 text-lg">Customer International Payments Portal</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {!isLoggedIn && (
                  <>
                    <Link to="/register" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Register</Link>
                    <Link to="/login" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Log In</Link>
                  </>
                )}
                {isLoggedIn && (
                  <button onClick={() => setIsLoggedIn(false)} className="py-2 px-2 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300">Log Out</button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-4xl font-bold text-gray-800">Welcome to Customer International Payments Portal</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;