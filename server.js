var express = require("express");
var swig    = require("swig");
var restify = require('restify');
var async   = require("async");

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

  async.parallel(
    [
      function (asyncCallback) {
        return getImages(tag, asyncCallback);
      },
      function (asyncCallback) {
        return getNews(tag, asyncCallback);
      },
      function (asyncCallback) {
        return getAdverts(tag, asyncCallback);
      },
    ],
    function (err, results) {
      if(err) {
        console.error(err);
      }

      res.locals.images  = results[0];
      res.locals.news    = results[1];
      res.locals.adverts = results[2].adverts;

      return res.render("front.html");
    }
  );
});

app.set("port", process.env.PORT || 3000);

app.listen(
  app.get("port"),
  function () {
    console.log("Server ready");
  }
);

var apiBaseUrl = process.env.API_URL || "http://localhost:8080";
var perlApiBaseUrl = process.env.PERL_API_URL || "http://localhost:8081";

function getImages(query, callback) {
  var client = restify.createJsonClient({
    url: apiBaseUrl,
  });
   
  client.get("/images/" + encodeURIComponent(query), function (err, req, res, data) {
    return callback(null, data || {});
  });
}

function getNews(query, callback) {
  var client = restify.createJsonClient({
    url: perlApiBaseUrl,
  });
   
  client.get("/v1/article/" + encodeURIComponent(query), function (err, req, res, data) {
    return callback(null, data || {});
  });
}


function getAdverts(query, callback) {
  var client = restify.createJsonClient({
    url: apiBaseUrl,
  });
   
  client.get("/adverts/" + encodeURIComponent(query), function (err, req, res, data) {
    return callback(null, data || {});
  });
}
