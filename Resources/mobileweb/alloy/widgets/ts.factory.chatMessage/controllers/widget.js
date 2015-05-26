function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.factory.chatMessage/" + s : s.substring(0, index) + "/ts.factory.chatMessage/" + s.substring(index + 1);
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
    function getFactory(name, args) {
        var builder = Widget.createController(name, args);
        return {
            build: function(message) {
                var row = Ti.UI.createTableViewRow();
                row.applyProperties($.styles.row);
                builder.build(row, message);
                return row;
            }
        };
    }
    var Widget = new (require("alloy/widget"))("ts.factory.chatMessage");
    this.__widgetId = "ts.factory.chatMessage";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.styles = {
        row: $.createStyle({
            classes: [ "row" ]
        })
    };
    exports.getFactory = getFactory;
    exports.declareFactory = function() {
        Ti.API.warn("TODO!");
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;