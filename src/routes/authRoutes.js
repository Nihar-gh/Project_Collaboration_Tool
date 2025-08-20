// import express from "express";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// // Signup
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     const user = await User.create({ name, email, password, role });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (user && (await user.matchPassword(password))) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "30d",
//       });

//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token,
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;


// import protect from "../middleware/authMiddleware.js";

// // Protected test route
// router.get("/profile", protect, (req, res) => {
//   res.json({
//     message: "Welcome to your profile",
//     user: req.user
//   });
// });
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== Signup ====================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    // Send Welcome Email
    await sendEmail(
      user.email,
      "Welcome to Project Collaboration Tool",
      `Hi ${user.name},\n\nWelcome to Project Collaboration Tool! Your account has been created successfully.\n\n- Team PCT`
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==================== Login ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      await sendEmail(
        user.email,
        "Login Alert - Project Collaboration Tool",
        `Hi ${user.name},\n\nYour account was just logged in at ${new Date().toLocaleString()}.\n\nIf this wasn't you, please reset your password immediately.\n\n- Team PCT`
      );
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==================== Protected Route Example ====================
// (Optional - keep for testing JWT middleware)
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Welcome to your profile",
    user: req.user,
  });
});

export default router;
