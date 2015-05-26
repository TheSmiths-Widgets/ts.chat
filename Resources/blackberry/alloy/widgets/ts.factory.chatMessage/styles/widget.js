function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.factory.chatMessage/" + s : s.substring(0, index) + "/ts.factory.chatMessage/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isClass: true,
    priority: 10000.0017,
    key: "row",
    style: {
        layout: "vertical",
        selectedBackgroundColor: "transparent",
        touchEnabled: false
    }
} ];