import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

const Report = () => {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [notAuth, setNotAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      setNotAuth(true);
      return;
    }

    try {
      setLoading(true);
      setNotAuth(false);

      const response = await axios.get(
        `http://localhost:5000/getPass/${password}`
      );

      if (response.data) {
        setAuth(true);
        setPassword("");
      } else {
        setNotAuth(true);
      }
    } catch (error) {
      console.error(error);
      setNotAuth(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (auth) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="bg-slate-800 px-8 py-8 text-center">

            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl">
                A
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white">
              Admin Login
            </h1>

            <p className="text-slate-300 mt-2 text-sm">
              Sign in to manage feedback
            </p>

          </div>

          {/* Form */}
          <div className="p-8">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Admin Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setNotAuth(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter admin password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {notAuth && (
              <p className="mt-3 text-sm text-red-600">
                Incorrect password. Please try again.
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Report;