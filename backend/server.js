const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json()); // to accept json data
var cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  res.send("API Running!");
});

app.get("/api/chat", (req, res) => {
    res.send("API Running for chats!");
  });

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on PORT ${PORT}...`));
