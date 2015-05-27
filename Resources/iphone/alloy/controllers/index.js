function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.chat = Alloy.createWidget("ts.chat", "widget", {
        id: "chat",
        __parentSymbol: $.__views.index
    });
    $.__views.chat.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var conversation = Alloy.createCollection("basic_conversation");
    var NB_MESSAGES = 1e3, offset = 0;
    for (var i = 0; NB_MESSAGES > i; i++) {
        Math.random() > .8 && (offset += 45);
        var date = new Date(Date.now() - 6e4 * (i + offset));
        conversation.add({
            content: NB_MESSAGES - i,
            author: "Author" + (i % 2 + 1),
            date: date
        });
    }
    conversation.add([ {
        content: L("someMessage"),
        author: "Author1",
        date: new Date()
    }, {
        content: L("someOtherMessage"),
        author: "Author2",
        date: new Date(conversation.at(15).get("date").getTime() - 10)
    } ]);
    $.index.addEventListener("open", function() {
        $.chat.init({
            messageBuilder: Alloy.createWidget("ts.messageBuilderFactory").getBuilder("messenger_like", {
                user: "Author1"
            }),
            messages: conversation.slice(0, 30)
        });
    });
    $.chat.on("load", function(loadEvent) {
        setTimeout(function() {
            loadEvent.success(conversation.getOlder(loadEvent.lastMessage, loadEvent.number));
        }, 800);
    });
    $.chat.on("newmessage", function(newMessageEvent) {
        var message = new Backbone.Model({
            content: newMessageEvent.message,
            author: newMessageEvent.author,
            date: newMessageEvent.date
        });
        conversation.add(message);
        newMessageEvent.success(message);
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;