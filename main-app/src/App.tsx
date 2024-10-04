import "./App.css";
import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DashboardPage, LoginPage, RegisterPage } from "./Pages";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header"></header> */}
        <Routes>
          <Route path="/" Component={DashboardPage} />
          <Route path="/login" Component={LoginPage} />
          <Route path="/signup" Component={RegisterPage} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
