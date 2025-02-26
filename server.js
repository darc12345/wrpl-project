// import express from "express";

// const app = express();
// const port = 3000;

// // Set EJS as the view engine
// app.set("view engine", "ejs");

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });

// app.get("/open-job-form", (req, res) => {
//   res.render("forms/job-info-form"); // Adjust the path based on your folder structure
// });

// app.get("/contact-page", (req, res) => {
//   res.render("forms/contact-form"); // Adjust the path based on your folder structure
// });




// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/open-job-form", (req, res) => {
  res.render("forms/job-info-form");
});

app.get("/contact-page", (req, res) => {
  res.render("forms/contact-form");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});