const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

app.get("/", (res) => {
  res.json({
    statusCode: 200,
    status: "success",
    message: "Welcome to API TekkomFess",
  });
});
