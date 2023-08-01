require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

    res.sendFile(__dirname + "/index.html");

});


app.post("/", function(req, res){
    
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit; 

    https.get(url, function(response){
        console.log(response.statusCode);  // it will display status code
    
      // tap into responses data using .on() methond
        response.on("data", function(data){
        // console.log(data); it will give hexadecimal data

        // convert into string 
            const weatherData = JSON.parse(data) // JSON.stringify(object) do the oppostie 
            // console.log(weatherData);
            const temp = weatherData.main.temp
            const weatherDesciption = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" +icon+ "@2x.png"
            // console.log(temp);
            // console.log(weatherDesciption)
            res.write("<p>The Weather is currently " + weatherDesciption + "</p>")
            res.write("<h1>The temperature in " + query + " is " + temp + "degrees Celcius.</h1>")
            res.write("<img src=" + imageURL + ">");
            res.send();

      })

    })

});

app.listen(3000, function(){
    console.log("Server is running on port 3000.")
});