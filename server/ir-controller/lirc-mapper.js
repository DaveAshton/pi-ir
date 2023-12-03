
var toLircChannel = (channel, prefix = "KEY_") => {
    if (!channel) {
        return [];
    } 
    return channel.split("").map(char => `${prefix}${char}`)
}

module.exports = toLircChannel; 