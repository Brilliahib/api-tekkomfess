const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const menfessRoutes = require("./routes/menfessRoutes");
const userRoutes = require("./routes/userRoute");
const cors = require("cors");

// Load variables from .env file
require("dotenv").config({ path: ".env.local" });

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api", menfessRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

app.get("/", (req, res) => {
  res.json({
    statusCode: 200,
    status: "success",
    message: "Welcome to API TekkomFess",
    author: "Muhammad Ahib Ibrilli",
    routes: [
      {
        path: "/api/menfess",
        description: "This endpoint to get or post menfess",
      },
      {
        path: "/api/menfess/:id",
        description: "This endpoint to get detail menfess",
      },
      {
        path: "/api/menfess/:id/comment",
        description: "This endpoint to post comment menfess",
      },
      {
        path: "/api/users",
        description: "This endpoint to get all users",
      },
      {
        path: "/api/users/:id",
        description: "This endpoint to get detail users",
      },
    ],
  });
});
