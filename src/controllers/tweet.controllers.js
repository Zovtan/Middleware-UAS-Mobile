const db = require("../database/database.connection");

const readTweets = async (req, res) => {
  try {
    const query = `
      SELECT tweets.*, COUNT(comments.comment_id) AS commentCount
      FROM tweets
      LEFT JOIN comments ON tweets.twtId = comments.twtId
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
      SELECT tweets.*, COUNT(comments.comment_id) AS commentCount
      FROM tweets
      LEFT JOIN comments ON tweets.twtId = comments.twtId
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

module.exports = {
  readTweet,
  readTweets,
  getCommentsByTweetId,
};
