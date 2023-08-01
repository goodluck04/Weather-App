require('dotenv').config()
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();


// to use static file like css,images,etc we have use .static() method
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// app.use(bodyParser);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/singnup.html")
    // console.console.log("singnup");
});

app.post("/", function(req, res){
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // console.log(firstName, lastName, email);
    

    const data = {
        members:[ {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }]
    }
    // make compact JSON
    const jsonData = JSON.stringify(data)

    

    const url = "https://us17.api.mailchimp.com/3.0/lists/b887c23e6d";

    const apikey = process.env.API_KEY
    const options = {
        method: "POST",
        auth: "goodluck:" + apikey
    }

    const request = https.request(url,options, function(response){
        
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
       
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })

    })
  
    request.write(jsonData);
    request.end();

});

// failure redired
app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT ||3000, function(){
    console.log("The server is running on port 3000.");
});

