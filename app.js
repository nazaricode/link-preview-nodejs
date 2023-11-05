const { default: axios } = require("axios");
var bodyParser = require("body-parser");
const express = require("express"),
  cors = require("cors");
require("dotenv").config();
const { getPreviewFromContent } = require("link-preview-js");
const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", async (_, res) => {
  res.status(200).json({ message: "Hello there!" });
});

app.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || url == "" || !isValidHttpUrl(url)) {
      return res.status(401).json({ message: "url is not valid" });
    }

    const response = await axios.get(url);
    getPreviewFromContent({ ...response, url }).then((data) => {
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(401).json({ message: "url is not valid" });
  }
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + server.address().port);
});
