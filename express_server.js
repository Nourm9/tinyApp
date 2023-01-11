const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

function generateRandomString() {
  let shortUrl = Math.random().toString(30).slice(7);
  return shortUrl;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

app.get("/hello", (req, res) => {
  const templateVars = { hello: "Hello world!" };
  res.render("hello", templateVars);
})

app.get("/urls/new", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.render("urls_new");
  res.redirect("/urls");
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  urlDatabase[req.params.id] = req.body.urlname;
  res.redirect("/urls")

});



app.post("/urls/:id/delete", (req, res) => {

  let url = req.params.id;

  delete urlDatabase[url];
  res.redirect("/urls");
});







