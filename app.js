const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
  
    res.sendFile(__dirname+'/index.html')
})

app.post('/', function(req,res){
    const query = req.body.city;
    const apiKey = "cb1c24f84fa191bfc34d526f28a53b0f"
    const units = req.body.units == "fahrenheit" ? "imperial" : "metric";
    console.log(units)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;
    https.get(url, (response) => {
        console.log("Status code: " + response.statusCode)

        if(response.statusCode===200){
            response.on('data', (data) => {
                const weatherData = JSON.parse(data);
                let temp = weatherData.main.temp;
                let description = weatherData.weather[0].description;
                let id = weatherData.weather[0].icon;

                const imgUrl = `https://openweathermap.org/img/wn/${id}@2x.png`
                res.write(`<p>The temperature in ${query} is : ${temp}, ${description}</p>`)
                res.write("<img src=" + imgUrl+">")
                res.send()
            })
        }else{
            res.send("<h1>ERROR: BAD REQUEST 404</h1>");
        }
    })
})

app.listen(8080,function(){
    console.log("Server running on port 8080!")
})
