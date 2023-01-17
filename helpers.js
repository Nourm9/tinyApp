const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const urlsForUser = function (id) {
  const userURL = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURL[url] = urlDatabase[url];
    }
  }
  return userURL;
};

const getUserById = (id, userDB) => {
  const userIds = Object.keys(userDB);
  if (!id) {
    return null;
  }

  for (let key of userIds) {
    if (key === id) return userDB[key];
  }
};

const getUserByEmail = function (email, database) {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return null;
};

const generateRandomString = () => {
  let shortUrl = Math.random().toString(30).slice(7);
  return shortUrl;
};

const generateRandomID = () => {
  let id = Math.random().toString(30).slice(7);
  return id;
};





module.exports = {
  urlsForUser,
  getUserByEmail,
  getUserById,
  generateRandomID,
  generateRandomString,
  urlDatabase
}

