import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // usually under 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

// export const signUp = async (req, res) => {
//   try {
//     const { username, password, email, firstName, lastName } = req.body;

//     if (!username || !password || !email || !firstName || !lastName) {
//       return res.status(400).json({
//         message:
//           "Username, password, email, firstName, and lastName are required",
//       });
//     }

//     // check if username already exists
//     const duplicate = await User.findOne({ username });

//     if (duplicate) {
//       return res.status(409).json({ message: "Username already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

//     // create new user
//     await User.create({
//       username,
//       hashedPassword,
//       email,
//       displayName: `${firstName} ${lastName}`,
//     });

//     // return
//     return res.sendStatus(204);
//   } catch (error) {
//     console.error("Error calling signUp", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: "Username, password, email, firstName, and lastName are required",
      });
    }

    // 1. Kiểm tra username đã tồn tại chưa
    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // 2. Thêm: Kiểm tra email đã tồn tại chưa (Tránh lỗi văng 500 từ MongoDB)
    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.sendStatus(204);
  } catch (error) {
    // In ra lỗi cụ thể để dễ debug ở backend console
    console.error("Error calling signUp:", error.message || error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    // get inputs
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password." });
    }

    // get hashedPassword from db to compare with input password
    // const user = await User.findOne({ username });
    const user = await User.findOne({ username }).select("+hashedPassword");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // check password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // if match, create accessToken with JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      // @ts-ignore
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // create refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // create new session to store refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // return refresh token in a cookie
    // Dev: secure=false, sameSite="lax" for cookie to work on localhost HTTP
    // Production: change to secure=true, sameSite="none" when deploying with HTTPS
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // return access token in res
    return res
      .status(200)
      .json({ message: `User ${user.displayName} logged in!`, accessToken });
  } catch (error) {
    console.error("Error calling signIn", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    // get refresh token from cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // delete refresh token in Session
      await Session.deleteOne({ refreshToken: token });

      // clear cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error calling signOut", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// create new access token from refresh token
export const refreshToken = async (req, res) => {
  try {
    // get refresh token from cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token does not exist." });
    }

    // compare with refresh token in db
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res
        .status(403)
        .json({ message: "Invalid token or token has expired" });
    }

    // check if expired
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token has expired." });
    }

    // create new access token
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error calling refreshToken", error);
    return res.status(500).json({ message: "Server error" });
  }
};