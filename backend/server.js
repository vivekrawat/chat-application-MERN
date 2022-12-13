const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

var cors = require("cors");

dotenv.config();
const app = express();
connectDB()

app.use(express.json()); // to accept json data
app.use(cors());
app.use("/api/user", userRoutes)

app.use(notFound)
app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("API Running!");
});

app.get("/api/chat", (req, res) => {
    res.send("API Running for chats!");
  });

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on PORT ${PORT}...`));
