const express = require("express");
const routes = express.Router();

const tweetControllers = require("../controllers/tweet.controllers");

routes.get("/", tweetControllers.readTweets);
routes.get("/:id", tweetControllers.readTweet);
routes.get("/comments/:id", tweetControllers.getCommentsByTweetId);
routes.post('/', tweetControllers.createTweet);
routes.patch('/:id', tweetControllers.updateTweet);
routes.delete('/:id', tweetControllers.deleteTweet);


module.exports = routes;
