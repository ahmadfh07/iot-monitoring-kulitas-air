require("./utils/db");
const Data = require("./models/data");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const timeout = require("connect-timeout");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(timeout("5s"));

app.get("/", async (req, res, next) => {
  const perPage = 10;
  const datas = await Data.find();
  if (datas.length !== 0) {
    const numOfResults = await Data.countDocuments();
    const numberOfPages = Math.ceil(numOfResults / perPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect("/?page=" + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect("/?page=" + encodeURIComponent("1"));
    }

    Data.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ _id: -1 })
      .exec((err, datas) => {
        Data.countDocuments().exec((err, count) => {
          if (err) return next(err);
          res.render("index", {
            title: "Home",
            layout: "layouts/main-layout",
            datas,
            current: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
  } else {
    res.render("index", {
      title: "Home",
      layout: "layouts/main-layout",
      datas,
    });
  }
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

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
