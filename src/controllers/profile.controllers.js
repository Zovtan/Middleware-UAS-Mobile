const db = require("../database/database.connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const readProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const query = "SELECT * FROM profile WHERE userId = ?;";
    const [data] = await db.query(query, [id]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Profile not found",
        status: res.statusCode,
      });
    }

    res.status(200).json({
      message: "Get profile success",
      status: res.statusCode,
      profile: data[0], // Assuming userId is unique and only one profile is expected
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Get profile fail",
      status: res.statusCode,
      serverMessage: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, username, phone, password } = req.body;

    const trimmedPassword = password.trim();

    let userQuery = "";
    let queryParam = "";

    if (email) {
      userQuery = "email = LOWER(?)";
      queryParam = email.trim();
    } else if (username) {
      const trimmedUsername = username.trim();
      userQuery = "username = LOWER(?)";
      queryParam = trimmedUsername.startsWith("@") ? trimmedUsername : `@${trimmedUsername}`;
    } else if (phone) {
      userQuery = "phone = ?";
      queryParam = phone.trim();
    } else {
      return res.status(400).json({ message: "Email, username, or phone must be provided" });
    }

    const [data] = await db.execute(
      `SELECT * FROM profile WHERE ${userQuery}`,
      [queryParam]
    );

    if (data.length === 0) {
      return res.status(404).json({ message: `${email ? "Email" : username ? "Username" : "Phone number"} not found` });
    }

    const user = data[0];
    const match = await bcrypt.compare(trimmedPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    const token = jwt.sign(
      { id: user.userId, email: user.email },
      "lalilulelo",
      {
        expiresIn: "5h",
      }
    );

    res.status(200).json({ token, id: user.userId, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const register = async (req, res) => {
  try {
    const { email, phone, username, password, confirmPassword } = req.body;
    const trimmedEmail = email ? email.trim() : null;
    const trimmedPhone = phone ? phone.trim() : null;
    let trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    const lowercaseEmail = trimmedEmail ? trimmedEmail.toLowerCase() : null;
    const lowercaseUsername = trimmedUsername ? trimmedUsername.toLowerCase() : null;


    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if ((!lowercaseEmail && !trimmedPhone) || !lowercaseUsername || !trimmedPassword) {
      return res.status(401).json({
        message: "Please fill the data completely, either email or phone must be provided",
        status: res.statusCode,
      });
    }

    if (lowercaseEmail && !emailRegex.test(lowercaseEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
        status: res.statusCode,
      });
    }

    if (!lowercaseUsername.startsWith("@")) {
      lowercaseUsername = "@" + lowercaseUsername;
    }

    if (lowercaseEmail) {
      const existingEmail = await db.query(
        "SELECT * FROM profile WHERE email = LOWER(?)",
        [lowercaseEmail]
      );

      if (existingEmail && existingEmail[0].length > 0) {
        return res.status(402).json({
          message: "Email already exists",
          status: res.statusCode,
        });
      }
    }

    if (trimmedPhone) {
      const existingPhone = await db.query(
        "SELECT * FROM profile WHERE phone = ?",
        [trimmedPhone]
      );

      if (existingPhone && existingPhone[0].length > 0) {
        return res.status(402).json({
          message: "Phone number already exists",
          status: res.statusCode,
        });
      }
    }

    const existingUsername = await db.query(
      "SELECT * FROM profile WHERE username = ?",
      [lowercaseUsername]
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

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const [result] = await db.execute(
      "INSERT INTO profile (email, phone, username, password) VALUES (?, ?, ?, ?)",
      [lowercaseEmail ? lowercaseEmail : null, trimmedPhone || null, lowercaseUsername, hashedPassword]
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
  readProfile,
  login,
  register,
};
