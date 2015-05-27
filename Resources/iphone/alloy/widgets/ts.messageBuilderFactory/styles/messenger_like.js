function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.messageBuilderFactory/" + s : s.substring(0, index) + "/ts.messageBuilderFactory/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isClass: true,
    priority: 10000.0009,
    key: "outerBubble",
    style: {
        height: Ti.UI.SIZE,
        left: "5dp",
        right: "5dp",
        width: Ti.UI.FILL
    }
}, {
    isClass: true,
    priority: 10000.001,
    key: "bubble",
    style: {
        borderRadius: "10",
        bottom: "5dp",
        height: Ti.UI.SIZE,
        top: "5dp",
        width: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.0011,
    key: "bubbleReceived",
    style: {
        backgroundColor: "#1DB7FF",
        right: "0dp"
    }
}, {
    isClass: true,
    priority: 10000.0012,
    key: "bubbleSent",
    style: {
        backgroundColor: "#DDDDDD",
        left: "0dp"
    }
}, {
    isClass: true,
    priority: 10000.0013,
    key: "message",
    style: {
        bottom: "10dp",
        font: {
            fontFamily: "'Helvetica Neue', Helvetica, Arial",
            fontSize: "12dp"
        },
        height: Ti.UI.SIZE,
        left: "10dp",
        right: "10dp",
        top: "10dp",
        width: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.0014,
    key: "messageReceived",
    style: {
        color: "#FFFFFF"
    }
}, {
    isClass: true,
    priority: 10000.0015,
    key: "messageSent",
    style: {
        color: "#141414"
    }
}, {
    isClass: true,
    priority: 10000.0016,
    key: "date",
    style: {
        color: "#888888",
        font: {
            fontFamily: "Arial, sans-serif",
            fontSize: "10dp"
        },
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        width: Ti.UI.FILL
    }
} ];