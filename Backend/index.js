const mongoose = require("mongoose");
const express = require("express");
const Feedback = require("./db.model");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PASSWORD = process.env.PASSWORD;

// ----------------------- MongoDB Connection -----------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ----------------------- Submit Feedback -----------------------

app.post("/submit", async (req, res) => {
  try {
    const { studentName, email, rating, comment } = req.body;

    const feedback = await Feedback.create({
      studentName,
      email,
      rating,
      comment,
    });

    console.log("Feedback saved:", feedback);

    res.status(201).json(feedback);
  } catch (err) {
    console.log("Submit Error:", err);
    res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
});

// ----------------------- Verify Admin Password -----------------------

app.get("/getPass/:pass", (req, res) => {
  const pass = req.params.pass;

  if (pass === PASSWORD) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// ----------------------- Get Feedback Statistics -----------------------

app.get("/getFB", async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();

    const averageResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    const fiveStarReviews = await Feedback.countDocuments({
      rating: 5,
    });

    const averageRating =
      averageResult.length > 0
        ? Number(averageResult[0].averageRating.toFixed(1))
        : 0;

    res.json({
      totalFeedback,
      averageRating,
      fiveStarReviews,
    });
  } catch (err) {
    console.log("Statistics Error:", err);

    res.status(500).json({
      message: "Failed to get feedback statistics",
    });
  }
});

// ----------------------- Get All Feedback -----------------------

app.get("/getFBInfo", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({
      createdAt: -1,
    });

    res.json(feedback);
  } catch (err) {
    console.log("Feedback Error:", err);

    res.status(500).json({
      message: "Failed to get feedback",
    });
  }
});

// ----------------------- Delete Feedback -----------------------

app.delete("/deleteFB/:id", async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(
      req.params.id
    );

    if (!deletedFeedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    res.json({
      message: "Feedback deleted successfully",
    });
  } catch (err) {
    console.log("Delete Error:", err);

    res.status(500).json({
      message: "Failed to delete feedback",
    });
  }
});

// ----------------------- Get Single Feedback -----------------------

app.get("/getFB/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    res.json(feedback);
  } catch (err) {
    console.log("Single Feedback Error:", err);

    res.status(500).json({
      message: "Failed to get feedback",
    });
  }
});

// ----------------------- Start Server -----------------------

app.listen(5000, () => {
  console.log("Server is running on PORT 5000");
});