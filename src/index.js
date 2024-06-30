const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 3031;

const profileRoutes = require("./routes/profile.route");
const tweetRoutes = require("./routes/tweet.route");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/profile", profileRoutes);
app.use("/tweets", tweetRoutes);

app.listen(PORT, () => {
  console.log("server berjalan di port", PORT, "...");
});

// link API: http://localhost:3031/