const express = require("express");
const app = express();
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  // just checking if the cookie is being sent as
  // browser didnot show any cookie
  console.log(req.cookies);
  res.send("Hello World!");
});
app.use("/auth", auth);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
