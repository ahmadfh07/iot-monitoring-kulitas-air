require("./utils/db");
const Data = require("./models/data");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const datas = await Data.find();
  res.render("index", {
    title: "Home",
    layout: "layouts/main-layout",
    datas,
  });
});

app.post("/input", (req, res) => {
  Data.insertMany(req.body, (error, result) => {
    res.redirect("/");
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main-layout",
  });
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening at http://localhost:${port}`);
});
