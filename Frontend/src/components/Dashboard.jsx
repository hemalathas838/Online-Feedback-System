import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    fiveStarReviews: 0,
  });

  const [search, setSearch] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET STATISTICS
  // =========================
  const getStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/getFB"
      );

      setStats(response.data);
    } catch (err) {
      console.error("Stats error:", err);
      setError("Unable to load dashboard statistics.");
    }
  };

  // =========================
  // GET ALL FEEDBACK
  // =========================
  const getFeedback = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/getFBInfo"
      );

      setFeedback(response.data);
    } catch (err) {
      console.error("Feedback error:", err);
      setError("Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    getStats();
    getFeedback();
  }, []);

  // =========================
  // DELETE FEEDBACK
  // =========================
  const deleteFeedback = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/deleteFB/${id}`
      );

      setSelectedFeedback(null);

      await getStats();
      await getFeedback();

    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete feedback.");
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredFeedback = feedback.filter((item) => {
    const searchValue = search.toLowerCase();

    return (
      (item.studentName || "")
        .toLowerCase()
        .includes(searchValue) ||

      (item.email || "")
        .toLowerCase()
        .includes(searchValue) ||

      (item.comment || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // RATING STARS
  // =========================
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= Number(rating)
                ? "text-yellow-400 text-lg"
                : "text-gray-300 text-lg"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // =========================
  // DASHBOARD
  // =========================
  return (
    <div className="min-h-screen bg-gray-100">

      {/* =========================================
          TOP NAVIGATION
      ========================================= */}
      <header className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Online Feedback Management System
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-700">
                  Administrator
                </p>

                <p className="text-xs text-gray-400">
                  Admin Panel
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
                A
              </div>

            </div>

          </div>

        </div>

      </header>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* PAGE TITLE */}
        <div className="mb-7">

          <h2 className="text-xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage feedback submitted by users.
          </p>

        </div>

        {/* =========================================
            ERROR MESSAGE
        ========================================= */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* =========================================
            STATISTICS
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* TOTAL */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Feedback
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-3">
                  {stats.totalFeedback}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Total responses received
                </p>
              </div>

              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                FB
              </div>

            </div>

          </div>

          {/* AVERAGE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Average Rating
                </p>

                <div className="flex items-center gap-2 mt-3">

                  <p className="text-3xl font-bold text-gray-800">
                    {stats.averageRating}
                  </p>

                  <span className="text-yellow-400 text-xl">
                    ★
                  </span>

                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Overall rating
                </p>
              </div>

              <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-500 flex items-center justify-center text-xl">
                ★
              </div>

            </div>

          </div>

          {/* FIVE STAR */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  5-Star Reviews
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-3">
                  {stats.fiveStarReviews}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Highest rated feedback
                </p>
              </div>

              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xl">
                ✓
              </div>

            </div>

          </div>

        </div>

        {/* =========================================
            FEEDBACK TABLE CARD
        ========================================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-5 border-b border-gray-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Feedback Responses
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  View and manage all submitted feedback.
                </p>
              </div>

              {/* SEARCH */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search feedback..."
                className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>

          </div>

          {/* COUNT */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredFeedback.length}
              </span>{" "}
              response
              {filteredFeedback.length !== 1 ? "s" : ""}
            </p>

          </div>

          {/* =========================================
              TABLE
          ========================================= */}
          <div className="overflow-x-auto">

            {loading ? (

              <div className="py-16 text-center">

                <p className="text-gray-500">
                  Loading feedback...
                </p>

              </div>

            ) : filteredFeedback.length === 0 ? (

              <div className="py-16 text-center">

                <p className="text-gray-700 font-medium">
                  No feedback found
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  There are no matching feedback responses.
                </p>

              </div>

            ) : (

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Name
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Rating
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredFeedback.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      {/* NAME */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                            {(item.studentName || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="font-medium text-gray-800">
                            {item.studentName}
                          </span>

                        </div>

                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {item.email}
                      </td>

                      {/* RATING */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <RatingStars
                            rating={item.rating}
                          />

                          <span className="text-xs text-gray-500">
                            {item.rating}/5
                          </span>

                        </div>

                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() =>
                            setSelectedFeedback(item)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-5"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            deleteFeedback(item._id)
                          }
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </main>

      {/* =========================================
          VIEW FEEDBACK MODAL
      ========================================= */}
      {selectedFeedback && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Feedback Details
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Submitted feedback information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="p-6 space-y-5">

              {/* NAME */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Name
                </p>

                <p className="mt-1 text-gray-800 font-medium">
                  {selectedFeedback.studentName}
                </p>
              </div>

              {/* EMAIL */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Email
                </p>

                <p className="mt-1 text-gray-700">
                  {selectedFeedback.email}
                </p>
              </div>

              {/* RATING */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Rating
                </p>

                <div className="flex items-center gap-2 mt-1">

                  <RatingStars
                    rating={selectedFeedback.rating}
                  />

                  <span className="text-sm text-gray-500">
                    {selectedFeedback.rating}/5
                  </span>

                </div>

              </div>

              {/* DATE */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Date
                </p>

                <p className="mt-1 text-gray-700">
                  {formatDate(
                    selectedFeedback.createdAt
                  )}
                </p>
              </div>

              {/* COMMENT */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Feedback
                </p>

                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">

                  <p className="text-gray-700 leading-relaxed">
                    {selectedFeedback.comment}
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">

              <button
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white font-medium"
              >
                Close
              </button>

              <button
                onClick={() =>
                  deleteFeedback(
                    selectedFeedback._id
                  )
                }
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Dashboard;