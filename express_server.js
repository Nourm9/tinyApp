const express = require("express");
const app = express();
const PORT = 8080;

const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/login", (req, res) => {
  res.cookie("username", "1234");
  res.redirect("/urls");
})
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let username = null;
  if (req.cookies) {
    username = req.cookies["username"];
  }
  console.log(req.cookies);
  const templateVars = { username: username, urls: urlDatabase };
  res.render("urls_index", templateVars);
})

app.get("/hello", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    hello: "Hello world!",
  };
  res.render("hello", templateVars);
})



app.get("/urls/:id", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});
