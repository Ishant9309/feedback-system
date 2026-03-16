import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import FeedbackForm from "./pages/FeedbackForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>

      <div className="flex flex-col min-h-screen">

        <Header />

        <main className="flex-grow">

          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>

        </main>

        <Footer />

      </div>

    </BrowserRouter>
  );
}

export default App;