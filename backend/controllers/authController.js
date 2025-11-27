import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    console.log("Received data:", req.body);

    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required",
        missing: {
          email: !email,
          username: !username,
          password: !password
        }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp
      }
    });

  } catch (error) {
    console.log("Get Current User Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, avatar } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: decoded.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken"
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { username, avatar },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Delete user from database
    const deletedUser = await User.findByIdAndDelete(decoded.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.log("Delete Account Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account"
    });
  }
};

// UPDATE XP
export const updateXP = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { xp } = req.body;

    // Validate XP value
    if (typeof xp !== 'number' || xp < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid XP value"
      });
    }

    // Update user's XP in database
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { xp },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "XP updated successfully",
      xp: updatedUser.xp
    });

  } catch (error) {
    console.log("Update XP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update XP"
    });
  }
};

// GET LEADERBOARD
export const getLeaderboard = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch all users sorted by XP in descending order
    const users = await User.find()
      .select('_id username avatar xp')
      .sort({ xp: -1 })
      .limit(100); // Limit to top 100 users

    // Format the leaderboard data
    const leaderboard = users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      avatar_url: user.avatar || '🏴‍☠️',
      xp: user.xp || 0
    }));

    // Calculate current user's rank if userId is provided
    let currentUserRank = null;
    if (userId) {
      const userIndex = leaderboard.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        currentUserRank = userIndex + 1;
      } else {
        // User not in top 100, calculate their actual rank
        const user = await User.findById(userId);
        if (user) {
          const higherRankedCount = await User.countDocuments({ xp: { $gt: user.xp } });
          currentUserRank = higherRankedCount + 1;
        }
      }
    }

    return res.json({
      success: true,
      leaderboard,
      rank: currentUserRank
    });

  } catch (error) {
    console.log("Get Leaderboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });
  }
};

// GET LEADERBOARD STREAM (SSE)
export const getLeaderboardStream = async (req, res) => {
  try {
    const { userId } = req.query;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Function to send leaderboard data
    const sendLeaderboard = async () => {
      try {
        // Fetch all users sorted by XP in descending order
        const users = await User.find()
          .select('_id username avatar xp')
          .sort({ xp: -1 })
          .limit(100);

        // Format the leaderboard data
        const leaderboard = users.map((user) => ({
          id: user._id.toString(),
          username: user.username,
          avatar_url: user.avatar || '🏴‍☠️',
          xp: user.xp || 0
        }));

        // Calculate current user's rank if userId is provided
        let currentUserRank = null;
        if (userId) {
          const userIndex = leaderboard.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            currentUserRank = userIndex + 1;
          } else {
            const user = await User.findById(userId);
            if (user) {
              const higherRankedCount = await User.countDocuments({ xp: { $gt: user.xp } });
              currentUserRank = higherRankedCount + 1;
            }
          }
        }

        const data = {
          leaderboard,
          rank: currentUserRank
        };

        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error('Error sending leaderboard data:', error);
      }
    };

    // Send initial data
    await sendLeaderboard();

    // Send updates every 10 seconds
    const interval = setInterval(sendLeaderboard, 10000);

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });

  } catch (error) {
    console.log("Get Leaderboard Stream Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to stream leaderboard"
    });
  }
};