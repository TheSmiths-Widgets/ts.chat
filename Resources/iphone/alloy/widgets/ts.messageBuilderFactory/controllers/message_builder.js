function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.messageBuilderFactory/" + s : s.substring(0, index) + "/ts.messageBuilderFactory/" + s.substring(index + 1);
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
    function build() {}
    new (require("alloy/widget"))("ts.messageBuilderFactory");
    this.__widgetId = "ts.messageBuilderFactory";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "message_builder";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    !function() {}(arguments[0] || {});
    exports.build = build;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;