var express = require("express");
var router = express.Router();
const db = require("../db");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
    db.all(
        "SELECT * FROM Users WHERE email=$email",
        {
            $email: req.body.email,
        },
        (err, rows) => {
            if (err) {
                console.log(err);
            } else if (rows.length > 0) {
                res.json({ error: "User already exists", rows: rows });
            } else {
                const hash = bcrypt.hashSync(req.body.password, 10);
                const token = uid2(32);
                db.run(
                    "INSERT INTO Users (username, email, password, token, cities) VALUES ($username, $email, $password, $token, $cities)",
                    {
                        $username: req.body.username,
                        $email: req.body.email,
                        $password: hash,
                        $token: token,
                        $cities: JSON.stringify(["Paris"]),
                    },
                    function (err) {
                        if (err) {
                            res.json({ error: "user not saved", err: err });
                        } else {
                            res.json({
                                status: "new user saved",
                                username: req.body.username,
                                token: token,
                                cities: ["Paris"],
                            });
                        }
                    }
                );
            }
        }
    );
});

router.post("/signin", async (req, res) => {
    db.get("SELECT * FROM Users WHERE email=$email", {
        $email: req.body.email
    }, (err, row) => {
        if(err) {
            console.log(err)
        }else if(!row){
            res.json({ error: "User not found"})
        }else if(row && bcrypt.compareSync(req.body.password, row.password)){
            res.json({
                username: row.username,
                token: row.token,
                cities: row.cities,
            })
        }else {
            res.json({ error: "Wrong password" })
        }
    })
});

router.post("/cities/:city", async (req, res) => {
    db.get("SELECT * FROM users WHERE token=$token", {
        $token: req.body.token
    }, (err, row) => {
        if(err){
            console.log(err)
        }else if (!row) {
            res.json({ reason: "User not found" });
            return;
        }else{
            let cities = JSON.parse(row.cities)
            if (cities.includes(req.params.city)){
                res.json({ reason: "City already in list" });
                return;
            }else{
                cities.push(req.params.city)
                db.run("UPDATE Users SET cities=$cities WHERE token=$token", {
                    $token: req.body.token,
                    $cities:JSON.stringify(cities)
                }, (err) =>{
                    if(err){
                        console.log(err)
                    }else{
                        res.json({citiesList: cities})
                    }
                })
            }
        }
    })
});

router.delete("/cities/:city", async (req, res) => {
    db.get("SELECT * FROM users WHERE token=$token", {
        $token: req.body.token
    }, (err, row) => {
        if(err){
            console.log(err)
        }else if (!row) {
            res.json({ reason: "User not found" });
            return;
        }else{
            let cities = JSON.parse(row.cities)
            if (cities.includes(req.params.city)){
                const updatedCities = cities.filter((city)=> city!==req.params.city)
                db.run("UPDATE Users SET cities=$cities WHERE token=$token",{
                    $token: req.body.token,
                    $cities:JSON.stringify(updatedCities)
                }, (err)=> {
                    if(err){
                        console.log(err)
                    }else{
                        res.json({citiesList: updatedCities})
                    } 
                })
            }else{
                res.json({ reason: "City not in list" })
            }
        }
    })
});

module.exports = router;
