import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authorization - verify who the user is
export const protectedRoute = (req, res, next) => {
  try {
    // get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Access token not found" });
    }

    // verify token validity
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);

          return res
            .status(403)
            .json({ message: "Access token expired or invalid" });
        }

        // find user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );

        if (!user) {
          return res.status(404).json({ message: "User does not exist." });
        }

        // attach user to req
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Error verifying JWT in authMiddleware", error);
    return res.status(500).json({ message: "Server error" });
  }

};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user has been assigned from the previously run protectedRoute function
    if (!req.user) {
      return res.status(401).json({ message: "Login required to continue." });
    }

    // Check if the current user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Account with role ${req.user.role} is not authorized to perform this action.` 
      });
    }

    // If valid, allow proceeding to the Controller
    next();
  };
};