const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
// const proxy = require("http-proxy-middleware");
// const path = require("path");

const app = express();

// Connect database
connectDB();

// Init middleware
// app.use(
//   "/api",
//   proxy({
//     target: "http://localhost:5000",
//     changeOrigin: true
//   })
// );

// app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(require("body-parser").json());

app.get("/", (req, res) => res.send("API running..."));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/todos", require("./routes/api/todos"));

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
