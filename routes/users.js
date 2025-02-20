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
                    "INSERT INTO Users (username, email, password, token) VALUES ($username, $email, $password, $token)",
                    {
                        $username: req.body.username,
                        $email: req.body.email,
                        $password: hash,
                        $token: token,
                    
                    },
                    function (err) {
                        if (err) {
                            res.json({ error: "user not saved", err: err });
                        } else {
                            db.run(
                                "INSERT INTO Cities (cityname, token) VALUES ($cityname, $token)",
                                {
                                    $cityname: "Paris",
                                    $token: token
                                }, (err) => {
                                    if(err){
                                        console.log("insert city error",err)
                                    }else{
                                        res.json({
                                            status: "new user saved",
                                            username: req.body.username,
                                            token: token,
                                            cities: ["Paris"],
                                        });
                                    }
                                }
                            )
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
    }, (err, userRow) => {
        if(err) {
            console.log(err)
        }else if(!userRow){
            res.json({ error: "User not found"})
        }else if(userRow && bcrypt.compareSync(req.body.password, userRow.password)){
            db.all("SELECT * FROM Cities WHERE token=$token", {
                $token: userRow.token
            }, (err, cityRows) => {
                if(err){
                    console.log(err)
                }else{
                    let citiesList=[]
                    for(let city of cityRows){
                        citiesList.push(city.cityname)
                    }
                    res.json({
                        username: userRow.username,
                        token: userRow.token,
                        cities: citiesList,
                    })
                }
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
            db.all("SELECT * FROM Cities WHERE token=$token", {
                $token:req.body.token
            }, (err, cityRows)=> {
                if(err){
                    console.log(err)
                }else{
                    let citiesList=[]
                    for(let city of cityRows){
                        citiesList.push(city.cityname)
                    }
                    if(citiesList.includes(req.params.city)){
                        res.json({ reason: "City already in list" });
                        return;
                    }else{
                        db.run("INSERT INTO Cities (cityname, token) VALUES ($cityname, $token)", {
                            $cityname:req.params.city,
                            $token: req.body.token
                        }, (err)=>{
                            if(err){
                                console.log(err)
                            }else{
                                res.json({cities:citiesList})
                            }
                        })
                    }
                }
            })
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
            db.all("SELECT * FROM Cities WHERE token=$token", {
                $token:req.body.token
            }, (err, cityRows)=> {
                if(err){
                    console.log(err)
                }else{
                    let citiesList=[]
                    for(let city of cityRows){
                        citiesList.push(city.cityname)
                    }
                    if(citiesList.includes(req.params.city)){
                        db.run("DELETE FROM Cities WHERE cityname=$cityname AND token=$token", {
                            $cityname:req.params.city,
                            $token: req.body.token
                        }, (err)=>{
                            if(err){
                                console.log(err)
                            }else{
                                citiesList=citiesList.filter((city)=>city!==req.params.city)
                                console.log(citiesList)
                                res.json({cities:citiesList})
                            }
                        })
                    }else{
                        res.json({ reason: "City not in list" });
                        return;
                    }
                }
            })
        }
    })
});

module.exports = router;
