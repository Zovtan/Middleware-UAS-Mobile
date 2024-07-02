const db = require("../database/database.connection");

const readTweets = async (req, res) => {
  try {
    const query = `
      SELECT tweets.*, profile.username, profile.displayName, COUNT(comments.comment_id) AS commentCount
      FROM tweets
      LEFT JOIN comments ON tweets.twtId = comments.twtId
      LEFT JOIN profile ON tweets.userId = profile.userId
      GROUP BY tweets.twtId;
    `;
    const [data] = await db.query(query);
    res.status(200).json({
      message: "get all tweets success",
      status: res.statusCode,
      tweets: data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "get all tweets fail",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};

const readTweet = async (req, res) => {
  try {
    const id = req.params.id;
    const query = `
      SELECT tweets.*, profile.username, profile.displayName, COUNT(comments.comment_id) AS commentCount
      FROM tweets
      LEFT JOIN comments ON tweets.twtId = comments.twtId
      LEFT JOIN profile ON tweets.userId = profile.userId
      WHERE tweets.twtId = ?
      GROUP BY tweets.twtId;
    `;
    const [data] = await db.query(query, [id]);
    res.status(200).json({
      message: "get tweet success",
      status: res.statusCode,
      tweet: data[0],
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "get tweet fail",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};


const getCommentsByTweetId = async (req, res) => {
  try {
    const id = req.params.id;
    const query = `
      SELECT * FROM comments
      WHERE twtId = ?;
    `;
    const [data] = await db.query(query, [id]);
    res.status(200).json({
      message: "get comments success",
      status: res.statusCode,
      comments: data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "get comments fail",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};

const createTweet = async (req, res) => {
  try {
    const { userId, tweet, image } = req.body;
    const query = `
      INSERT INTO tweets (userId, tweet, timestamp, likes, retweets, qtweets, views, bookmarks)
      VALUES (?, ?, CURRENT_TIMESTAMP, 0, 0, 0, 0, 0);
    `;
    await db.query(query, [userId, tweet]);
    res.status(201).json({
      message: "Tweet created successfully",
      status: res.statusCode,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to create tweet",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};

const updateTweet = async (req, res) => {
  try {
    const id = req.params.id;
    const { tweet } = req.body;

    if (!tweet) {
      return res.status(400).json({
        message: "No tweet content provided to update",
        statusCode: res.statusCode,
      });
    }

    const query = `
      UPDATE tweets
      SET tweet = ?
      WHERE twtId = ?;
    `;
    await db.query(query, [tweet, id]);

    res.status(200).json({
      message: "Tweet updated successfully",
      status: res.statusCode,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to update tweet",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const id = req.params.id;
    const query = `
      DELETE FROM tweets
      WHERE twtId = ?;
    `;
    await db.query(query, [id]);
    res.status(200).json({
      message: "Tweet deleted successfully",
      status: res.statusCode,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to delete tweet",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};


module.exports = {
  readTweet,
  readTweets,
  getCommentsByTweetId,
  createTweet,
  updateTweet,
  deleteTweet,
};