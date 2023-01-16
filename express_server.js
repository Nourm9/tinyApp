const express = require("express");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const app = express();
const PORT = 8080;

const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(morgan("short"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["444-222-333"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);



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

const {
  urlsForUser,
  getUserByEmail,
  getUserById,
  generateRandomID,
  generateRandomString,
} = require("./helpers");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  return res.redirect("/login");
});

//  Login and Logout post routes
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    const user_id = req.session.user_id;
    const templateVars = { user: users[user_id] };
    res.redirect("/urls");
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let currentUser = getUserByEmail(email, users);
  let user_id = getUserById(currentUser.id, users);

  console.log("req.body password", password);

  let userObj = {
    user_id: {
      id: user_id,
      email,
      password: bcrypt.hashSync(password, saltRounds),
    },
  };

  if (!currentUser) {
    res.sendStatus(403).send("Email cannot be found");
  } else if (!bcrypt.compareSync(password, currentUser.password)) {
    res.sendStatus(401).send("Password was incorrect");
  } else {
    let user_id = getUserById(currentUser.id, users);
    users.user_id = userObj;
    req.session.user_id = user_id;
    console.log("req.sess:", req.session.user_id);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// registration route
app.get("/registration", (req, res) => {
  if (req.session.user_id) {
    const user_id = req.session.user_id;
    const templateVars = { user: user_id };
    res.redirect("/urls");
  } else {
    const templateVars = { user: null };
    res.render("registration", templateVars);
  }
});

app.post("/registration", (req, res) => {
  const user_id = generateRandomID();
  let error = null;
  const { id, email, password } = req.body;
  let currentUser = getUserByEmail(email, users);
  if (currentUser !== null) {
    res.sendStatus(400).send("Email already exists.");
  } else if (email === "" || password === "") {
    error = "please input correct email and password";
    res.status(401).send(error);
  } else {
    let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    users[user_id] = {
      id: user_id,
      email: req.body.email,
      password: hashedPassword,
    };
    req.session.user_id = user_id;
    res.redirect("/urls");
  }
});

// get routes for /urls to view and change urls
//  and urls /:id
app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;

  if (user_id) {
    const currentUserUrls = urlsForUser(user_id);
    const templateVars = { user: users[user_id], urls: currentUserUrls };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: user_id,
    };
    return res.redirect(`/urls/${id}`);
  }
  return res.redirect("/login");
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  // const user = getUserById(user_id, users);

  const templateVars = {
    user: users[user_id],
    id: user_id,
  };
  if (user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.status(401).send("Please login to use tinyApp").redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  const currentUserUrls = urlsForUser(user_id.id);

  if (user_id) {
    const templateVars = {
      user: users[user_id],
      id: req.params.id,
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
    };
    console.log(req.params.id);
    res.render("urls_show", templateVars);
  } else {
    res.status(401).send("please login in to use");
  }
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const user_id = req.session.user_id;
  urlID = req.params.id;
  const templateVars = {
    user: users[user_id],
  };

  if (user_id) {
    let currentUserUrls = urlsForUser(user_id);
    if (currentUserUrls) {
      // if current user urls does exist
      delete urlDatabase[req.params.id];
      return res.redirect("/urls");
    }
    if (!currentUserUrls) {
      // if current user's urls doesn't exist
      return res.status(401).send("This URL is not in your database");
    }
    // if neither current user or current user's urls doesn't exist
    res.status(401).send("please login to delete url");
    res.redirect("/login");
  }
});
