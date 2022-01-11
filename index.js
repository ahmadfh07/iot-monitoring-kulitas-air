require("./utils/db");
const Data = require("./models/data");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const timeout = require("connect-timeout");
const bodyParser = require("body-parser");

const port = 3000;
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(timeout("5s"));

//socket.io
io.on("connection", function (socket) {
  console.log(socket.id);
  Data.watch().on("change", (data) => {
    io.emit("changes", data.fullDocument);
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

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

//changestream diletakkan setelah input agar bisa terus memantau
//pipeline : [{ $match: { operationType: { $in: ["insert"] } } }]

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main-layout",
  });
});

app.get("/tdsdown", async (req, res) => {
  const perPage = 10;
  const datas = await Data.find();
  if (datas.length !== 0) {
    const numOfResults = await Data.countDocuments();
    const numberOfPages = Math.ceil(numOfResults / perPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect("/tdsdown?page=" + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect("/tdsdown?page=" + encodeURIComponent("1"));
    }

    Data.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ tds: -1 })
      .exec((err, datas) => {
        Data.countDocuments().exec((err, count) => {
          if (err) return next(err);
          res.render("index", {
            title: "Home",
            layout: "layouts/main-layout",
            datas,
            current: page,
            pages: Math.ceil(count / perPage),
            option: "tdsdown",
          });
        });
      });
  } else {
    res.render("index", {
      title: "Home",
      layout: "layouts/main-layout",
      datas,
      option: "tdsdown",
    });
  }
});

app.get("/tdsup", async (req, res) => {
  const perPage = 10;
  const datas = await Data.find();
  if (datas.length !== 0) {
    const numOfResults = await Data.countDocuments();
    const numberOfPages = Math.ceil(numOfResults / perPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect("/tdsup?page=" + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect("/tdsup?page=" + encodeURIComponent("1"));
    }

    Data.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ tds: 1 })
      .exec((err, datas) => {
        Data.countDocuments().exec((err, count) => {
          if (err) return next(err);
          res.render("index", {
            title: "Home",
            layout: "layouts/main-layout",
            datas,
            current: page,
            pages: Math.ceil(count / perPage),
            option: "tdsup",
          });
        });
      });
  } else {
    res.render("index", {
      title: "Home",
      layout: "layouts/main-layout",
      datas,
      option: "tdsup",
    });
  }
});

app.get("/redonly", async (req, res) => {
  const perPage = 10;
  const datas = await Data.find({ tds: { $gt: 500 } });
  if (datas.length !== 0) {
    const numOfResults = await Data.countDocuments();
    const numberOfPages = Math.ceil(numOfResults / perPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect("/redonly?page=" + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect("/redonly?page=" + encodeURIComponent("1"));
    }

    Data.find({ tds: { $gt: 500 } })
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
            pages: Math.ceil(datas.length / perPage),
            option: "redonly",
          });
        });
      });
  } else {
    res.render("index", {
      title: "Home",
      layout: "layouts/main-layout",
      datas,
      option: "redonly",
    });
  }
});

app.get("/greenonly", async (req, res) => {
  const perPage = 10;
  const datas = await Data.find();
  if (datas.length !== 0) {
    const numOfResults = await Data.countDocuments();
    const numberOfPages = Math.ceil(numOfResults / perPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect("/greenonly?page=" + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect("/greenonly?page=" + encodeURIComponent("1"));
    }

    Data.find({ tds: { $lte: 500 } })
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
            pages: Math.ceil(datas.length / perPage),
            option: "greenonly",
          });
        });
      });
  } else {
    res.render("index", {
      title: "Home",
      layout: "layouts/main-layout",
      datas,
      option: "greenonly",
    });
  }
});

app.post("/datebetween", async (req, res) => {
  const perPage = 10;
  const dateOne = new Date(req.body.dateOne).toISOString();
  const dateTwo = new Date(req.body.dateTwo).toISOString();
  const datas = await Data.find();
  if (datas.length !== 0) {
    const numOfResults = await Data.countDocuments();
    const numberOfPages = Math.ceil(numOfResults / perPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect("/tdsup?page=" + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect("/tdsup?page=" + encodeURIComponent("1"));
    }

    Data.find({ createdAt: { $gte: dateOne, $lt: dateTwo } })
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
            pages: Math.ceil(datas.length / perPage),
            option: "datebetween",
          });
        });
      });
  } else {
    res.render("index", {
      title: "Home",
      layout: "layouts/main-layout",
      datas,
      option: "datebetween",
    });
  }
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

httpServer.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
