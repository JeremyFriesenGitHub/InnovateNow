const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const ROOT_DIR = "html";
const USERS_FILE = "users.json"; // File to store user data

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain",
};

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext];
    }
  }
  return MIME_TYPES["txt"];
}

function loadUsers() {
  try {
    const userData = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(userData);
  } catch (error) {
    return { users: [] };
  }
}

function saveUsers(users) {
  const data = JSON.stringify(users, null, 2);
  fs.writeFileSync(USERS_FILE, data);
}



http
  .createServer(function (request, response) {
    var urlObj = url.parse(request.url, true, false);

    console.log("\n============================");
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var receivedData = "";

    request.on("data", function (chunk) {
      receivedData += chunk;
    });

    request.on("end", function () {
      if (request.method === "POST") {
        var dataObj = JSON.parse(receivedData);

        if (urlObj.pathname === "/login") {
          var users = loadUsers();
          var user = users.users.find(
            (u) =>
              u.username === dataObj.username && u.password === dataObj.password
          );

          var returnObj = {};
          if (user) {
            returnObj.text = "Login successful";
            returnObj.redirect = "/credentials.html"; // Redirect to credentials.html
          } else {
            returnObj.text = "Login failed";
          }

          response.writeHead(200, { "Content-Type": MIME_TYPES["json"] });
          response.end(JSON.stringify(returnObj));
        } else if (urlObj.pathname === "/register") {
          // ... (previous registration code)
        } else {
          var returnObj = {};
          returnObj.text = "Unknown request";
          response.writeHead(200, { "Content-Type": MIME_TYPES["json"] });
          response.end(JSON.stringify(returnObj));
        }
      } else if (request.method === "GET") {
        var filePath = ROOT_DIR + urlObj.pathname;
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/login.html";

        // Add a new else if block for credentials.html
        else if (urlObj.pathname === "/credentials.html") {
          filePath = ROOT_DIR + "/credentials.html";
        }

        fs.readFile(filePath, function (err, data) {
          if (err) {
            console.log("ERROR: " + JSON.stringify(err));
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
          }

          var contentType = get_mime(filePath);
          if (contentType) {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(data);
          } else {
            console.log("Invalid Content-Type");
            response.writeHead(500);
            response.end("Internal Server Error");
          }
        });
      }
    });
  })
  .listen(3001);

console.log("Server Running at PORT 3001  CNTL-C to quit");
console.log("To Test");
console.log("http://localhost:3001/login.html");
console.log("To Register");
console.log("http://localhost:3001/registration.html");
