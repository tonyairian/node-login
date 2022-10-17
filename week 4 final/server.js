const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const bodyparser = require("body-parser");
const uuid = require("uuid");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "hbs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: false,
  })
);

const userDetails = {
  email: "scrappy@7",
  password: "cholo",
};

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/", (req, res) => {
  let products = [
    {
      name: "iphone 14",
      category: "Mobile",
      description: "Product from apple",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtgb5wIkhTpA02A1Y9ssAcg4dK82WML5BgwA&usqp=CAU",
    },
    {
      name: "Galaxy S22 Ultra",
      category: "Mobile",
      description: "Product from Samsung",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9afMVfYU_6SDW6W7cyiH2g_GsnqyvDLcTvQ&usqp=CAU",
    },
    {
      name: "Pixel 7",
      category: "Mobile",
      description: "Product from Google",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3nxe-piYbwxx_vBhHVpOa56U1GG5LoY8cbA&usqp=CAU",
    },
  ];

  if (req.session.user) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.render("home", { products });
  } else {
    res.redirect("/login");
  }
});
app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);
  if (email == userDetails.email && password == userDetails.password) {
    req.session.user = req.body.email;
    // req.session.user =true;
    console.log(req.session.user);
    res.redirect("/");
  } else {
    req.session.loginErr = true;
    res.redirect("/login");
  }
});

app.listen(port, () => {
  console.log("server running at port " + port);
});
