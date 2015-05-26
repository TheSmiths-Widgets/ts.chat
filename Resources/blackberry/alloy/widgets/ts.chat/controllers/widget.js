function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.chat/" + s : s.substring(0, index) + "/ts.chat/" + s.substring(index + 1);
    return path;
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
    function init(config) {
        if (void 0 !== $._messages) throw "ts.chat have been init more than once";
        $._config = _.extend({
            batchSize: 10,
            maxTypingHeight: .25 * Ti.Platform.displayCaps.platformHeight
        }, config);
        if (void 0 === $._config.messageBuilder) throw "No builder provided. It will be hard to render messages :/";
        $._messages = [];
        $.messages.setData(_buildMessages($._NATURE.OLD, $._config.messages));
        delete $._config.messages;
        $.messages.scrollToIndex($._rows.length - 1, {
            animated: false
        });
    }
    function getOldest() {
        return {
            message: $._messages.slice(-1).pop(),
            row: $._rows[0]
        };
    }
    function getMostRecent() {
        return {
            message: $._messages[0],
            row: $._rows.slice(-1).pop()
        };
    }
    function receive(messages) {
        $.messages.appendRow(_buildMessages($._NATURE.NEW, _.flatten([ messages ])));
        $.messages.scrollToIndex($._rows.length - 1);
    }
    function _buildMessages(nature, messages) {
        var row, rows;
        Array.prototype[nature === $._NATURE.OLD ? "push" : "unshift"].apply($._messages, messages);
        $._rows = messages && $._rows || [];
        messages = messages || $._messages;
        rows = _.map(messages, function(msg) {
            row = $._config.messageBuilder.build(msg);
            row.applyProperties($.createStyle({
                classes: [ "row" ]
            }));
            $._rows[nature === $._NATURE.OLD ? "unshift" : "push"](row);
            return row;
        });
        nature === $._NATURE.OLD && (rows = rows.reverse());
        return rows;
    }
    function _resizeTypingArea() {
        var typingAreaHeight = $.typingArea.rect.height, length = $.typingArea.value.length;
        if (typingAreaHeight > $._config.maxTypingHeight) {
            $.typingArea.height = $._config.maxTypingHeight;
            $._resizeThreshold = $._resizeThreshold || length;
        } else length < $._resizeThreshold && $.typingArea.setHeight(Ti.UI.SIZE);
    }
    function _loadOld(refreshEvent) {
        var loadEvent = {
            number: $._config.batchSize,
            lastMessage: getOldest().message,
            success: function(messages) {
                _buildMessages($._NATURE.OLD, messages);
                $.messages.setData($._rows);
                refreshEvent.hide();
            },
            error: refreshEvent.error
        };
        $.trigger("load", loadEvent);
    }
    function _send() {
        $.send.touchEnabled = false;
        var newmessageEvent = {
            message: $.typingArea.value,
            date: new Date(),
            author: $._config.user,
            success: function(message) {
                receive([ message ]);
                $.typingArea.value = "";
                _resizeTypingArea();
                $.send.touchEnabled = true;
            },
            error: function() {
                $.send.touchEnabled = true;
            }
        };
        $.trigger("newmessage", newmessageEvent);
    }
    function _snatchFocus() {
        $.typingArea.blur();
    }
    new (require("alloy/widget"))("ts.chat");
    this.__widgetId = "ts.chat";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.main = Ti.UI.createScrollView({
        contentHeight: Ti.UI.FILL,
        contentWidth: Ti.UI.FILL,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "main"
    });
    $.__views.main && $.addTopLevelView($.__views.main);
    $.__views.messagesWrapper = Ti.UI.createView({
        top: "0",
        id: "messagesWrapper"
    });
    $.__views.main.add($.__views.messagesWrapper);
    $.__views.messages = Ti.UI.createTableView({
        layout: "vertical",
        separatorColor: "transparent",
        top: "0",
        width: Ti.UI.FILL,
        id: "messages"
    });
    _snatchFocus ? $.__views.messages.addEventListener("singletap", _snatchFocus) : __defers["$.__views.messages!singletap!_snatchFocus"] = true;
    $.__views.loader = Alloy.createWidget("nl.fokkezb.pullToRefresh", "widget", {
        id: "loader",
        children: [ $.__views.messages ],
        __parentSymbol: $.__views.messagesWrapper
    });
    $.__views.loader.setParent($.__views.messagesWrapper);
    _loadOld ? $.__views.loader.on("release", _loadOld) : __defers["$.__views.loader!release!_loadOld"] = true;
    $.__views.typingWrapper = Ti.UI.createView({
        backgroundColor: "#FFFFFF",
        bottom: "0",
        height: Ti.UI.SIZE,
        layout: "vertical",
        width: Ti.UI.FILL,
        id: "typingWrapper"
    });
    $.__views.main.add($.__views.typingWrapper);
    $.__views.separator = Ti.UI.createLabel({
        backgroundColor: "#CCCCCC",
        height: "1dp",
        width: Ti.UI.FILL,
        id: "separator"
    });
    $.__views.typingWrapper.add($.__views.separator);
    $.__views.typingArea = Ti.UI.createTextArea({
        backgroundColor: "#FFFFFF",
        color: "#161616",
        focused: "false",
        font: {
            fontSize: "14dp"
        },
        height: Ti.UI.SIZE,
        hintText: "Type your message here...",
        suppressReturn: "false",
        width: Ti.UI.FILL,
        id: "typingArea"
    });
    $.__views.typingWrapper.add($.__views.typingArea);
    _resizeTypingArea ? $.__views.typingArea.addEventListener("change", _resizeTypingArea) : __defers["$.__views.typingArea!change!_resizeTypingArea"] = true;
    $.__views.send = Ti.UI.createButton({
        backgroundColor: "#1DB7FF",
        color: "#FFFFFF",
        height: "50dp",
        right: "0%",
        top: "10",
        width: Ti.UI.FILL,
        id: "send",
        title: L("send")
    });
    $.__views.typingWrapper.add($.__views.send);
    _send ? $.__views.send.addEventListener("click", _send) : __defers["$.__views.send!click!_send"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $._NATURE = {
        OLD: 1,
        NEW: 2
    };
    $._messages;
    $._rows = [];
    $._resizeThreshold = 0;
    !function() {
        $.typingWrapper.addEventListener("postlayout", function postlayoutListener() {
            $.typingWrapper.removeEventListener("postlayout", postlayoutListener);
            $.messagesWrapper.height = $.parent.rect.height - $.typingWrapper.rect.height - 5;
        });
    }();
    exports.init = init;
    exports.receive = receive;
    exports.loadOld = $.loader.refresh;
    exports.getMostRecent = getMostRecent;
    exports.getOldest = getOldest;
    __defers["$.__views.messages!singletap!_snatchFocus"] && $.__views.messages.addEventListener("singletap", _snatchFocus);
    __defers["$.__views.loader!release!_loadOld"] && $.__views.loader.on("release", _loadOld);
    __defers["$.__views.typingArea!change!_resizeTypingArea"] && $.__views.typingArea.addEventListener("change", _resizeTypingArea);
    __defers["$.__views.send!click!_send"] && $.__views.send.addEventListener("click", _send);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;