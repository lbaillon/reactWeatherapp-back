var express = require("express");
var router = express.Router();

const API_KEY = process.env.API_KEY;

//get Paris weather
router.get("/paris", (req, res) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${API_KEY}&units=metric`
    )
        .then((response) => response.json())
        .then((parisData) =>
            res.json({
                cityName: parisData.name,
                main: parisData.weather[0].main,
                description: parisData.weather[0].description,
                tempMin: parisData.main.temp_min,
                tempMax: parisData.main.temp_max,
            })
        );
});

// get any town weather
router.get("/:city", (req, res) => {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${API_KEY}&units=metric`
        )
            .then((response) => response.json())
            .then((cityData) =>{
                    res.json({
                        cityName: cityData.name,
                        main: cityData.weather[0].main,
                        description: cityData.weather[0].description,
                        tempMin: cityData.main.temp_min,
                        tempMax: cityData.main.temp_max,
                    })
            }).catch((error) => {
                console.log(error)
                res.status(404);
                res.json({reason: "City not found"})
            })           
});



module.exports = router;
