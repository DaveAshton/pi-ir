var express = require("express");
var controller = require("../ir-controller");
var router = express.Router();

router.get("/", function (req, res) {
  const channels = controller.toLircChannel(req.query.channel);
  if (channels.length < 1) {
    res.send("You need to send channel query parameter such as ?channel=102");
    return;
  }

  controller.transmit("TEL", channels, (message) => {
    console.log(">> response", message);
    res.send("Successful send: " + message);
  });
});

module.exports = router;
