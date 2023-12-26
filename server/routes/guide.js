var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");

function getIds(req) {
  const { channel = [] } = req.query;

  if (!channel) {
    return undefined;
  }
  const ids = !Array.isArray(channel) ? [channel] : channel;
  return ids?.map((ch) => `&channel=${ch}`).join("");
}

router.get("/", async function (req, res) {
  try {
    const { channel = [] } = req.query;
    console.log(">> request query channel", channel, req.query);
    const qry = getIds(req);
    if (!qry) {
      res.json({});
      return;
    }
    const path = `https://www.freesat.co.uk/tv-guide/api/0?${qry}`;
    console.log(">> about to fetch", path);
    const response = await fetch(path);
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      console.log(">> bad response", response);
      res.sendStatus(500);
    }
  } catch (err) {
    console.log(">> error", err);
    res.sendStatus(500);
  }
});

module.exports = router;
