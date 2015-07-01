var express = require("express");
var swig    = require("swig");
var restify = require('restify');

var app = express();

app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.use(express.static("static"));

if(app.get("env") === "development") {
  console.log("Turning caching off in development");
  app.set("view cache", false);
  swig.setDefaults({ cache: false });
}

app.get("/:tag?", function (req, res) {
  var tag = req.params.tag || "cats";

  return getImages(tag, function (err, data) {
    res.locals.images = data;

    return res.render("front.html");
  });
});

app.set("port", process.env.PORT || 3000);

app.listen(
  app.get("port"),
  function () {
    console.log("Server ready");
  }
);

var apiBaseUrl = process.env.API_URL || "http://localhost:8080";

function getImages(query, callback) {
  var client = restify.createJsonClient({
    url: apiBaseUrl,
  });
   
  client.get("/echo/" + encodeURIComponent(query), function (err, req, res, data) {
    return callback(err, data);
  });
}
