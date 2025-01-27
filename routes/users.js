var express = require('express');
var router = express.Router();
require('../models/connection');

const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    password: hash,
    token: uid2(32)
})
  const newDoc = await newUser.save()
  res.json({result: true, user: newDoc})
} )

module.exports = router;
