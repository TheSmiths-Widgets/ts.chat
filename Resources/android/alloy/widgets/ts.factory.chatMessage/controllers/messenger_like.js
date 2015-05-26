function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.factory.chatMessage/" + s : s.substring(0, index) + "/ts.factory.chatMessage/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function build(row, message) {
        var elapsed, isOld, views = {}, template = message.get("author") === $._user ? "Sent" : "Received";
        views.bubble = Ti.UI.createView();
        views.outerBubble = Ti.UI.createView();
        views.content = Ti.UI.createLabel({
            text: message.get("content")
        });
        for (vKey in views) views[vKey].applyProperties($._styles[vKey + template]);
        views.bubble.add(views.content);
        views.outerBubble.add(views.bubble);
        elapsed = $._previousOld - message.get("date").getTime();
        if (elapsed > 0) {
            isOld = true;
            $._previousOld -= elapsed;
        } else {
            $._previousNew += elapsed = $._previousOld - elapsed - $._previousNew;
            isOld = !$._previousOld;
            $._previousOld = $._previousOld || $._previousNew;
        }
        if (elapsed > $._LONG_ENOUGH) if (isOld) {
            views.date = Ti.UI.createLabel({
                text: moment(new Date($._previousOld)).format("llll")
            });
            views.date.applyProperties($._styles.date);
            row.add(views.outerBubble);
            row.add(views.date);
        } else {
            views.date = Ti.UI.createLabel({
                text: moment(new Date($._previousNew - elapsed)).format("llll")
            });
            views.date.applyProperties($._styles.date);
            row.add(views.date);
            row.add(views.outerBubble);
        } else row.add(views.outerBubble);
    }
    new (require("alloy/widget"))("ts.factory.chatMessage");
    this.__widgetId = "ts.factory.chatMessage";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "messenger_like";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var moment = require("moment");
    !function(args) {
        if (void 0 === args.user) throw "Expecting a username to be supplied in order to build messages";
        $._user = args.user;
        $._styles = {
            outerBubble: $.createStyle({
                classes: [ "outerBubble" ]
            }),
            contentReceived: $.createStyle({
                classes: [ "message", "messageReceived" ]
            }),
            contentSent: $.createStyle({
                classes: [ "message", "messageSent" ]
            }),
            bubbleReceived: $.createStyle({
                classes: [ "bubble", "bubbleReceived" ]
            }),
            bubbleSent: $.createStyle({
                classes: [ "bubble", "bubbleSent" ]
            }),
            date: $.createStyle({
                classes: [ "date" ]
            })
        };
        $._styles.outerBubbleReceived = $._styles.outerBubbleSent = $._styles.outerBubble;
        $._LONG_ENOUGH = 18e5;
        $._previousOld = 0;
        $._previousNew = 0;
    }(arguments[0] || {});
    exports.build = build;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;