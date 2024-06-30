const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const token = req.headers["auth"];
  if (!token) {
    return res.status(400).json({
      message: "unauthorized",
    });
  }

  jwt.verify(token, "lalilulelo", (err, user) => {
    if (err) {
      return res.status(400).json({
        message: "access denied",
      });
    }
    next();
  });
};

module.exports = authenticateToken;
