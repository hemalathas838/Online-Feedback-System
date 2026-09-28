import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Form from "./components/Form";
import Report from "./components/Report";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">

        {/* Professional Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* Logo / Title */}
            <Link
              to="/"
              className="text-2xl font-bold text-slate-800"
            >
              Online Feedback System
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 font-medium transition"
              >
                Feedback
              </Link>

              <Link
                to="/report"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                Admin Dashboard
              </Link>
            </div>

          </div>
        </nav>

        {/* Pages */}
        <main>
          <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
};

export default App;