const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
  
    res.sendFile(__dirname+'/index.html')
})

app.post('/', function(req,res){
    const query = req.body.city;
    const apiKey = "cb1c24f84fa191bfc34d526f28a53b0f"
    const units = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;
    https.get(url, (response) => {
        console.log("Status code: " + res.statusCode)

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
    })
})

app.listen(3000,function(){
    console.log("Server running on port 3000!")
})