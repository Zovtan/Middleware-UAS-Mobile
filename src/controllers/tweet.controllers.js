const db = require("../database/database.connection");

//http://localhost:3031/tweets/
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

//http://localhost:3031/tweets/:id
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

//http://localhost:3031/tweets/comments/:id
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

//http://localhost:3031/tweets/post
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

//http://localhost:3031/tweets/:id
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

//http://localhost:3031/tweets/:id
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

// http://localhost:3031/tweets/like/:id
const likeTweet = async (req, res) => {
  try {
    const userId = req.body.userId;
    const twtId = req.params.id;

    // Check if the user has already liked the tweet
    const checkQuery = `
      SELECT * FROM isliked
      WHERE userId = ? AND twtId = ?;
    `;
    const [liked] = await db.query(checkQuery, [userId, twtId]);

    if (liked.length > 0) {
      // User has already liked the tweet, so unlike it
      const unlikeQuery = `
        DELETE FROM isliked
        WHERE userId = ? AND twtId = ?;
      `;
      await db.query(unlikeQuery, [userId, twtId]);

      // Decrease like count in tweets table
      const decreaseLikeQuery = `
        UPDATE tweets
        SET likes = likes - 1
        WHERE twtId = ?;
      `;
      await db.query(decreaseLikeQuery, [twtId]);

      res.status(200).json({
        message: "Tweet unliked successfully",
        status: res.statusCode,
      });
    } else {
      // User has not liked the tweet, so like it
      const likeQuery = `
        INSERT INTO isliked (userId, twtId)
        VALUES (?, ?);
      `;
      await db.query(likeQuery, [userId, twtId]);

      // Increase like count in tweets table
      const increaseLikeQuery = `
        UPDATE tweets
        SET likes = likes + 1
        WHERE twtId = ?;
      `;
      await db.query(increaseLikeQuery, [twtId]);

      res.status(200).json({
        message: "Tweet liked successfully",
        status: res.statusCode,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to like/unlike tweet",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};

// http://localhost:3031/tweets/retweet/:id
const retweetTweet = async (req, res) => {
  try {
    const userId = req.body.userId;
    const twtId = req.params.id;

    // Check if the user has already retweeted the tweet
    const checkQuery = `
      SELECT * FROM isretweeted
      WHERE userId = ? AND twtId = ?;
    `;
    const [retweeted] = await db.query(checkQuery, [userId, twtId]);

    if (retweeted.length > 0) {
      // User has already retweeted the tweet, so unretweet it
      const unretweetQuery = `
        DELETE FROM isretweeted
        WHERE userId = ? AND twtId = ?;
      `;
      await db.query(unretweetQuery, [userId, twtId]);

      res.status(200).json({
        message: "Tweet unretweeted successfully",
        status: res.statusCode,
      });
    } else {
      // User has not retweeted the tweet, so retweet it
      const retweetQuery = `
        INSERT INTO isretweeted (userId, twtId)
        VALUES (?, ?);
      `;
      await db.query(retweetQuery, [userId, twtId]);

      // Increase retweet count in tweets table
      const increaseRetweetQuery = `
        UPDATE tweets
        SET retweets = retweets + 1
        WHERE twtId = ?;
      `;
      await db.query(increaseRetweetQuery, [twtId]);

      res.status(200).json({
        message: "Tweet retweeted successfully",
        status: res.statusCode,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to retweet/unretweet tweet",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};

// http://localhost:3031/tweets/bookmark/:id
const bookmarkTweet = async (req, res) => {
  try {
    const userId = req.body.userId;
    const twtId = req.params.id;

    // Check if the user has already bookmarked the tweet
    const checkQuery = `
      SELECT * FROM isbookmarked
      WHERE userId = ? AND twtId = ?;
    `;
    const [bookmarked] = await db.query(checkQuery, [userId, twtId]);

    if (bookmarked.length > 0) {
      // User has already bookmarked the tweet, so remove bookmark
      const unbookmarkQuery = `
        DELETE FROM isbookmarked
        WHERE userId = ? AND twtId = ?;
      `;
      await db.query(unbookmarkQuery, [userId, twtId]);

      res.status(200).json({
        message: "Tweet bookmark removed successfully",
        status: res.statusCode,
      });
    } else {
      // User has not bookmarked the tweet, so add bookmark
      const bookmarkQuery = `
        INSERT INTO isbookmarked (userId, twtId)
        VALUES (?, ?);
      `;
      await db.query(bookmarkQuery, [userId, twtId]);

      // Increase bookmark count in tweets table
      const increaseBookmarkQuery = `
        UPDATE tweets
        SET bookmarks = bookmarks + 1
        WHERE twtId = ?;
      `;
      await db.query(increaseBookmarkQuery, [twtId]);

      res.status(200).json({
        message: "Tweet bookmarked successfully",
        status: res.statusCode,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to add/remove tweet bookmark",
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
  likeTweet,
  retweetTweet,
  bookmarkTweet,
};