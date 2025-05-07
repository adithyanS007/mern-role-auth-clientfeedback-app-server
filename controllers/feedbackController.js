import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import fs from 'fs';
import path from 'path';

export const createFeedback = async (req, res) => {
  try {
    const { desc, rating, user } = req.body;
    let image = "";

    if (req.file) {
      image = `/uploads/feedback-images/${req.file.filename}`;
    }

    const feedback = new Feedback({
      user,
      desc,
      rating,
      image,
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all feedbacks (admin use)
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email') // only name and email of user
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({success: true, feedbacks});
  } catch (err) {
    console.error("Error in getAllFeedbacks:", err); 
    return res.status(500).json({ message: 'Error fetching feedbacks', error: err.message });
  }
};

// Admin comment on feedback
export const commentOnFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComment } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { adminComment },
      { new: true }
    );

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    res.status(200).json({ message: "Comment added", feedback });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id)
      .populate('user', 'name email') // Populate the user info
      .exec();

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ success: true, feedback });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    return res.status(500).json({ message: 'Error fetching feedback', error: err.message });
  }
};


// ✅ Delete Feedback by ID
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Delete the image file if exists
    if (feedback.image) {
      const filePath = path.join(process.cwd(), feedback.image);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to delete image:", err.message);
      });
    }

    await feedback.deleteOne();

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};