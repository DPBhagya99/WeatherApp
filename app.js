const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.CityName;
    const apikey = "c6ef3f292f9b4b789f795335240306";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${query}`;

    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const tempInCelsius = weatherData.current.temp_c;  
            const description = weatherData.current.condition.text;  
            const iconUrl = `https:${weatherData.current.condition.icon}`; 
            const wind = weatherData.current.wind_kph;
            const windDirection = weatherData.current.wind_dir;
            


            console.log(weatherData);
            console.log(tempInCelsius);
            console.log(description);
            console.log(wind);
            console.log(windDirection);
            

            const htmlResponse = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Weather App</title>
                    <link rel="stylesheet" type="text/css" href="/styles.css">
                </head>
                <body>
                    <form action="/" method="post">
                        <label for="CityInput">Place : </label>
                        <input id="CityInput" type="text" name="CityName">
                        <button type="submit">Go</button>
                    </form>
                    <div class='output'>
                        <p>The weather is currently ${description}.</p>
                        <h1>The temperature in ${query} is ${tempInCelsius}° Celsius.</h1>
                        <img src="${iconUrl}">
                        <p>The wind speed is ${wind} and direction is ${windDirection}</p>
                    </div>
                </body>
                </html>
            `;

            res.send(htmlResponse);

           
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});
