var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/users");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
    const email = await User.findOne({ email: req.body.email });
    if (email) {
        res.json({ error: "User already exists" });
    } else {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            token: uid2(32),
            cities: ["Paris"],
        });
        const newDoc = await newUser.save();
        res.json({ username: newDoc.username, token: newDoc.token, cities: newDoc.cities});
    }
});

router.post("/signin", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.json({ error: "User not found" });
        return;
    } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res.json({ username: user.username, token: user.token, cities: user.cities });
    } else {
        res.json({ error: "Wrong password" });
    }
});

router.post("/cities/:city", async (req, res) => {
    const user = await User.findOne({token: req.body.token})
    if (!user) {
        res.json({reason: "User not found"})
        return
    } else if (user.cities.includes(req.params.city)){
        res.json({reason: "City already in list"})
        return
    } else {
        await User.updateOne(
            {token: req.body.token},
            {$push: {cities: req.params.city}}
        )
        const updatedUSer = await User.findOne({token: req.body.token})
        res.json({citiesList: updatedUSer.cities})
    }
})

router.delete("/cities/:city", async (req, res) => {
    const user = await User.findOne({token: req.body.token})
    const cityName =req.params.city
    console.log("city to delete: ", cityName)
    console.log(user.cities)
    if (!user) {
        res.json({reason: "User not found"})
        return
    }else if (user.cities.includes(cityName)){
        await User.updateOne(
            {token: req.body.token},
            {$pull: {cities: cityName }}
        )
        const updatedUSer = await User.findOne({token: req.body.token})
        res.json({citiesList: updatedUSer.cities})
    }else {
        res.json({reason: "City not in list"})
        return
    }
})


module.exports = router;
