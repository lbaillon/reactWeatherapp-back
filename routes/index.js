var express = require('express');
var router = express.Router();

const API_KEY = process.env.API_KEY

//get Paris weather
router.get('/paris', (req, res) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${API_KEY}&units=metric`)
  .then(response => response.json())
  .then(parisData => res.json({
    cityName: parisData.name,
    main: parisData.weather[0].main,
    description: parisData.weather[0].description,
    tempMin: parisData.main.temp_min,
    tempMax: parisData.main.temp_max
  }))
})

module.exports = router;
