import "./App.css";
import React from "react";
import logo from "./logo.svg";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DashboardPage, LoginPage, SignUpPage } from "./Pages";

function App() {
  return (
    <Router>
      <div className="App w-full flex justify-center items-center flex-col min-h-screen ">
        {/* <header className="App-header"></header> */}
        <Routes>
          <Route path="/" Component={DashboardPage} />
          <Route path="/login" Component={LoginPage} />
          <Route path="/signup" Component={SignUpPage} />
          {/* <Route path="*" Component={NotFoundPage} /> */}
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;
