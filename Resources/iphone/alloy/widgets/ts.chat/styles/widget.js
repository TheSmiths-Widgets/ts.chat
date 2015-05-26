function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.chat/" + s : s.substring(0, index) + "/ts.chat/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isId: true,
    priority: 100000.0002,
    key: "main",
    style: {
        contentHeight: Ti.UI.FILL,
        contentWidth: Ti.UI.FILL,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL
    }
}, {
    isId: true,
    priority: 100000.0003,
    key: "messages",
    style: {
        layout: "vertical",
        separatorColor: "transparent",
        top: "0",
        width: Ti.UI.FILL
    }
}, {
    isId: true,
    priority: 100000.0004,
    key: "messagesWrapper",
    style: {
        top: "0"
    }
}, {
    isId: true,
    priority: 100000.0005,
    key: "typingWrapper",
    style: {
        backgroundColor: "#FFFFFF",
        bottom: "0",
        height: Ti.UI.SIZE,
        layout: "vertical",
        width: Ti.UI.FILL
    }
}, {
    isId: true,
    priority: 100000.0006,
    key: "separator",
    style: {
        backgroundColor: "#CCCCCC",
        height: "1dp",
        width: Ti.UI.FILL
    }
}, {
    isId: true,
    priority: 100000.0007,
    key: "typingArea",
    style: {
        backgroundColor: "#FFFFFF",
        color: "#161616",
        focused: "false",
        font: {
            fontSize: "14dp"
        },
        height: Ti.UI.SIZE,
        hintText: "Type your message here...",
        suppressReturn: "false",
        width: Ti.UI.FILL
    }
}, {
    isId: true,
    priority: 100000.0008,
    key: "send",
    style: {
        backgroundColor: "#1DB7FF",
        color: "#FFFFFF",
        height: "50dp",
        right: "0%",
        top: "10",
        width: Ti.UI.FILL
    }
} ];