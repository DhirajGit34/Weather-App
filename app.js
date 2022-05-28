const express = require("express");
const app = express();
// for api call
const https = require("https");

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  // Catch data from input
  const query = req.body.cityName;
  const apiKey = "f20e3bf58d0f9c801fae93df37937281";
  const unit = "metric";
  // fetch data from externet server with API
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;
  // get request
  https.get(url, function (response) {
    // console.log(response.statusCode);

    response.on("data", function (data) {
      // conver to js object, As a JSON Format
      const weatherData = JSON.parse(data);
      // fetching tempeture
      const temp = weatherData.main.temp;
      // fetch weather describtion
      const weatherDescribtion = weatherData.weather[0].description;
      // icon
      const icon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      // sending to the browser
      res.write("<h1>The tempeture in "+ query+ " " + temp + " degrees celcius</h1>");
      res.write("<h3>The Weathre is Currently " + weatherDescribtion + "</h3>");
      res.write("<img src='" + imgURL + "'/>");
      res.send();
    });
  });
});

// server, Dynamic port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server Start");
});
