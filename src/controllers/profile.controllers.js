const db = require("../database/database.connection");
const bcrypt = require("bcrypt");

//http://localhost:3031/profile/login
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const trimmedPassword = password.trim();

    let userQuery = "";
    let queryParam = "";

    if (identifier.includes('@')) {
      // Jika input email
      userQuery = "email = LOWER(?)";
      queryParam = identifier.trim().toLowerCase();
    } else {
      // jika input username
      const trimmedUsername = identifier.trim().toLowerCase();
      userQuery = "username = LOWER(?)";
      queryParam = trimmedUsername.startsWith("@") ? trimmedUsername : `@${trimmedUsername}`;
    }

    const [data] = await db.execute(
      `SELECT * FROM profile WHERE ${userQuery}`,
      [queryParam]
    );

    if (data.length === 0) {
      return res.status(404).json({ message: `${identifier.includes('@') ? "Email" : "Username"} not found` });
    }

    const user = data[0];
    const match = await bcrypt.compare(trimmedPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    res.status(200).json({ id: user.userId, username: user.username, displayName: user.displayName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//http://localhost:3031/profile/register
const register = async (req, res) => {
  try {
    const { email, username, displayName, password, confirmPassword } = req.body;
    const trimmedEmail = email.trim().toLowerCase();
    let trimmedUsername = username.trim().toLowerCase();
    const trimmedDisplayName = displayName.trim()
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // regex email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !trimmedUsername || !trimmedDisplayName || !trimmedPassword) {
      return res.status(401).json({
        message: "Please fill the data completely",
        status: res.statusCode,
      });
    }

    if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
        status: res.statusCode,
      });
    }

    if (!trimmedUsername.startsWith("@")) {
      trimmedUsername = "@" + trimmedUsername;
    }

      const existingEmail = await db.query(
        "SELECT * FROM profile WHERE email = LOWER(?)",
        [trimmedEmail]
      );

      if (existingEmail && existingEmail[0].length > 0) {
        return res.status(401).json({
          message: "Email already exists",
          status: res.statusCode,
        });
      }

    const existingUsername = await db.query(
      "SELECT * FROM profile WHERE username = ?",
      [trimmedUsername]
    );

    if (existingUsername && existingUsername[0].length > 0) {
      return res.status(402).json({
        message: "Username already exists",
        status: res.statusCode,
      });
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return res.status(403).json({ message: "Passwords do not match" });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const [result] = await db.execute(
      "INSERT INTO profile (email, username, displayName, password) VALUES ( ?, ?, ?, ?)",
      [trimmedEmail, trimmedUsername, trimmedDisplayName, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  login,
  register,
};
