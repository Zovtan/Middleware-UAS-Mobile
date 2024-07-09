const express = require("express");
const routes = express.Router();
const profileControllers = require("../controllers/profile.controllers");

routes.post("/login", profileControllers.login);
routes.post("/register", profileControllers.register);

module.exports = routes;
