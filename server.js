import express from "express";

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/open-job-form", (req, res) => {
  res.render("forms/job-info-form"); // Adjust the path based on your folder structure
});

app.get("/contact-page", (req, res) => {
  res.render("forms/contact-form"); // Adjust the path based on your folder structure
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
