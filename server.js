var express = require("express");
var swig    = require("swig");

var app = express();

app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.use(express.static("static"));

app.get("/", function (req, res) {
  return res.render("front.html");
});

app.set("port", process.env.PORT || 3000);

app.listen(
  app.get("port"),
  function () {
    console.log("Server ready");
  }
);
