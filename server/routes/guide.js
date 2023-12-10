var express = require("express");
var router = express.Router();
var fetch = require('node-fetch');

router.get("/", async function (req, res) {

   const response = await fetch("https://www.freesat.co.uk/tv-guide/api/0?&channel=712&channel=710")
   const data = await response.json();
   console.log(">> sending guide data",data);
   res.json(data);
});

module.exports = router;
