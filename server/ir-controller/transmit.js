lirc_node = require("lirc_node");
lirc_node.init();
var transmit = (remoteName, keys, callback) => {
  console.log("Sending command!", remoteName, keys);
console.log(lirc_node.remotes);
  lirc_node.irsend.send_once(remoteName, keys, function () {
    callback(`Command sent to ${remoteName}, keys: ${keys}`);
  });
};

module.exports = transmit;