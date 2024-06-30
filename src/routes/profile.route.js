const express = require("express");
const routes = express.Router();
const profileControllers = require("../controllers/profile.controllers");
const authenticateToken = require("../middlewares/auth.js");

routes.post("/login", profileControllers.login);
routes.post("/register", profileControllers.register);
routes.get("/:id", authenticateToken, profileControllers.readProfile);

module.exports = routes;
