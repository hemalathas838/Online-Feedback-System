import React, { useState } from "react";
import axios from "axios";

const Form = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    studentName: "",
    email: "",
    rating: 0,
    comment: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRating = (rating) => {
    setForm({
      ...form,
      rating,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!form.comment.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:5000/submit", {
        studentName: form.studentName,
        email: form.email,
        rating: form.rating,
        comment: form.comment,
      });

      setSubmitted(true);

      setForm({
        studentName: "",
        email: "",
        rating: 0,
        comment: "",
      });
    } catch (err) {
      console.error(err);
      setError("Unable to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Success Page */
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg border border-slate-200 p-10 text-center">

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <span className="text-4xl text-green-600">✓</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Thank You
          </h1>

          <p className="text-slate-600 mb-7">
            Your feedback has been submitted successfully.
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Submit Another Response
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">

      <div className="max-w-2xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            Share Your Feedback
          </h1>

          <p className="mt-3 text-slate-500 text-lg">
            Your opinion helps us improve our services.
          </p>

        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

          {/* Card Header */}
          <div className="bg-slate-800 px-8 py-7">

            <h2 className="text-2xl font-semibold text-white">
              Feedback Form
            </h2>

            <p className="mt-1 text-slate-300">
              Please share your experience with us.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="p-8">

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Name
              </label>

              <input
                type="text"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

            </div>

            {/* Email */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

            </div>

            {/* Rating */}
            <div className="mb-7">

              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Rating
              </label>

              <div className="flex items-center gap-1">

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    aria-label={`${star} star rating`}
                    className={`text-3xl transition-transform hover:scale-110 ${
                      form.rating >= star
                        ? "text-amber-400"
                        : "text-slate-300"
                    }`}
                  >
                    ★
                  </button>
                ))}

                {form.rating > 0 && (
                  <span className="ml-3 text-sm font-medium text-slate-500">
                    {form.rating} out of 5
                  </span>
                )}

              </div>

            </div>

            {/* Feedback */}
            <div className="mb-7">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Feedback Message
              </label>

              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows="6"
                maxLength="500"
                placeholder="Tell us about your experience..."
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <div className="text-right text-xs text-slate-400 mt-1">
                {form.comment.length}/500
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Form;