var express = require("express");
var channelData = require("../channels/channels.json");
var controller = require("../ir-controller");
var router = express.Router();

router.get("/", function (req, res) {
  console.log(">> sending channel data", channelData);
  res.json(channelData);
});

router.get("/:channel", function (req, res) {
  const channel = controller.toLircChannel(req.params.channel);
  if (channel.length < 1) {
    res.send("You need to send channel query parameter such as ?channel=102");
    return;
  }

  controller.transmit("TEL", channel, (message) => {
    console.log(">> response", message);
    res.send("Successful send: " + message);
  });
});
module.exports = router;
