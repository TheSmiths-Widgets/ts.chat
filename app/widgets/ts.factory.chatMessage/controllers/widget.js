$.styles = {
    row: $.createStyle({ classes: ['row'] })
};

function getFactory (name, args) {
    var builder = Widget.createController(name, args);
    return {
        build: function (message, template) {
            var row = Ti.UI.createTableViewRow();
            row.applyProperties($.styles.row);
            builder.build(row, message);
            return row;
        }
    };
}

exports.getFactory = getFactory;
exports.declareFactory = function () { Ti.API.warn("TODO!"); };

