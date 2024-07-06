const db = require("../database/database.connection");

//http://localhost:3031/tweets/
const readTweets = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is available in the request
    const query = `
      SELECT tweets.*, profile.username, profile.displayName, COUNT(comments.commentId) AS commentCount
      FROM tweets
      LEFT JOIN comments ON tweets.twtId = comments.twtId
      LEFT JOIN profile ON tweets.userId = profile.userId
      GROUP BY tweets.timestamp DESC;
    `;
    const [data] = await db.query(query);

    // Retrieve interactions for each tweet
    const tweetsWithInteractions = await Promise.all(
      data.map(async (tweet) => {
        const interactions = await checkUserInteractions(userId, tweet.twtId);
        return {
          ...tweet,
          interactions,
        };
      })
    );

    res.status(200).json({
      message: "get all tweets success",
      status: res.statusCode,
      tweets: tweetsWithInteractions,
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

//http://localhost:3031/tweets/
const createTweet = async (req, res) => {
  try {
    const {userId, tweet} = req.body;
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
    const { tweet, userId } = req.body; // Assuming userId is passed in the body

    if (!tweet || !userId) {
      return res.status(400).json({
        message: "Tweet content or userId not provided",
        statusCode: res.statusCode,
      });
    }

    // Fetch the tweet from the database to check userId
    const fetchQuery = 'SELECT userId FROM tweets WHERE twtId = ?';
    const [rows] = await db.query(fetchQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Tweet not found",
        statusCode: res.statusCode,
      });
    }

    const tweetUserId = rows[0].userId;

    // Check if the userId from the body matches the tweet's userId
    if (userId !== tweetUserId) {
      return res.status(403).json({
        message: "Unauthorized to update this tweet",
        statusCode: res.statusCode,
      });
    }

    // Update the tweet
    const updateQuery = 'UPDATE tweets SET tweet = ? WHERE twtId = ?';
    await db.query(updateQuery, [tweet, id]);

    res.status(200).json({
      message: "Tweet updated successfully",
      status: res.statusCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update tweet",
      statusCode: res.statusCode,
      serverMessage: err.message,
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

      // Decrease retweet count in tweets table
      const decreaseRetweetQuery = `
        UPDATE tweets
        SET retweets = retweets - 1
        WHERE twtId = ?;
      `;
      await db.query(decreaseRetweetQuery, [twtId]);

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

      // Decrease bookmark count in tweets table
      const decreaseBookmarkQuery = `
        UPDATE tweets
        SET bookmarks = bookmarks - 1
        WHERE twtId = ?;
      `;
      await db.query(decreaseBookmarkQuery, [twtId]);

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


// Helper function to check if user has liked, retweeted, or bookmarked a tweet
const checkUserInteractions = async (userId, twtId) => {
  try {
    // Check if user has liked the tweet
    const checkLikeQuery = `
      SELECT * FROM isliked
      WHERE userId = ? AND twtId = ?;
    `;
    const [liked] = await db.query(checkLikeQuery, [userId, twtId]);
    const userLiked = liked.length > 0;

    // Check if user has retweeted the tweet
    const checkRetweetQuery = `
      SELECT * FROM isretweeted
      WHERE userId = ? AND twtId = ?;
    `;
    const [retweeted] = await db.query(checkRetweetQuery, [userId, twtId]);
    const userRetweeted = retweeted.length > 0;

    // Check if user has bookmarked the tweet
    const checkBookmarkQuery = `
      SELECT * FROM isbookmarked
      WHERE userId = ? AND twtId = ?;
    `;
    const [bookmarked] = await db.query(checkBookmarkQuery, [userId, twtId]);
    const userBookmarked = bookmarked.length > 0;

    return {
      isLiked: userLiked,
      isRetweeted: userRetweeted,
      isBookmarked: userBookmarked,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// http://localhost:3031/tweets/interactions/:id
const getTweetInteractions = async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming userId is available in the request
    const twtId = req.params.id; // Assuming twtId is passed as a route parameter

    // Call the helper function to get user interactions
    const interactions = await checkUserInteractions(userId, twtId);

    res.status(200).json({
      message: "User interactions retrieved successfully",
      status: res.statusCode,
      interactions,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to retrieve user interactions",
      statusCode: res.status,
      serverMessage: err,
    });
  }
};

module.exports = {
  readTweets,
  getCommentsByTweetId,
  createTweet,
  updateTweet,
  deleteTweet,
  likeTweet,
  retweetTweet,
  bookmarkTweet,
  getTweetInteractions
};