import "./App.css";
import React from "react";
import logo from "./logo.svg";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DashboardPage, LoginPage, SignUpPage, PaymentPage, AccountInfoPage } from "./Pages";
import { AuthProvider } from "./lib/AuthContext";

function App() {
  return (
    <Router>
      <div className="App w-full flex justify-center items-center flex-col min-h-screen ">
        {/* <AuthProvider> */}
        {/* <header className="App-header"></header> */}
        <Routes>
          <Route path="/" Component={DashboardPage} />
          <Route path="/login" Component={LoginPage} />
          <Route path="/signup" Component={SignUpPage} />
          <Route path="/payment" Component={PaymentPage} />
          <Route path="/account-info" Component={AccountInfoPage} />
          {/* <Route path="*" Component={NotFoundPage} /> */}
        </Routes>
        {/* </AuthProvider> */}
      </div>
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;
