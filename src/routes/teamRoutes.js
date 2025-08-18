import express from "express";
import Team from "../models/Team.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Team
router.post("/create", protect, async (req, res) => {
  try {
    const team = await Team.create({
      name: req.body.name,
      createdBy: req.user._id,
      members: [req.user._id], // creator is auto member
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join Team
router.post("/join/:teamId", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!team.members.includes(req.user._id)) {
      team.members.push(req.user._id);
      await team.save();
    }

    res.json({ message: "Joined team successfully", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get My Teams
router.get("/my-teams", protect, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate("members", "name email role");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
