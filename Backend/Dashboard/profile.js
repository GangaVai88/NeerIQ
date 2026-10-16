const User = require("../models/users");

const getProfile = async (req, res, next) => {
  try {
    // req.user is set by the verifyToken middleware and contains { id, email }
    const user = await User.findById(req.user.id).select(
      "username email dateCreated"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile fetched successfully.",
      profile: {
        username: user.username,
        email: user.email,
        dateCreated: user.dateCreated,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile };

