const express = require("express");
const app = express();
const PORT = 8080;

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const getUserByEmail = function (email, database) {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return null;
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const generateRandomString = () => {
  let shortUrl = Math.random().toString(30).slice(7);
  return shortUrl;
};

const generateRandomID = () => {
  let id = Math.random().toString(30).slice(7);
  return id;
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

//  Login and Logout post routes
app.get("/login", (req, res) => {
  if (req.cookies["user_id"]) {
    const user_id = req.cookies["user_id"];

    const templateVars = { user: user_id };
    res.render("login", templateVars);
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});
app.post("/login", (req, res) => {
  const { id, email, password } = req.body;
  let user_id = generateRandomID();
  let currentUser = getUserByEmail(email, users);

  if (!currentUser) {
    res.sendStatus(403).send("Email cannot be found");
  } else if (currentUser.password !== password) {
    res.sendStatus(401).send("Password was incorrect");
  } else {
    res.cookie("user_id", user_id);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  const { email, password } = req.body;
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// registration route
app.get("/registration", (req, res) => {
  const user_id = req.cookies["user_id"];
  const templateVars = { user: user_id };

  res.render("registration", templateVars);
});

app.post("/registration", (req, res) => {
  const user_id = generateRandomID();
  const { id, email, password } = req.body;
  let currentUser = getUserByEmail(email, users);
  if (currentUser !== null) {
    res.sendStatus(400).send("Email already exists.");
  } else if (email === "" || password === "") {
    res.sendStatus(401);
  } else {
    users[user_id] = {
      id: user_id,
      email: req.body.email,
      password: req.body.password,
    };
    res.cookie("user_id", user_id);
    res.redirect("/urls");
  }
});

// get routes for /urls to view and change urls
//  and urls /:id
app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];
  const templateVars = { user: users[user_id], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.cookies["user_id"];
  const templateVars = {
    user: user_id,
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});
