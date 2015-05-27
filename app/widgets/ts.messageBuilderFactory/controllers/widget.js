/**
 * @class messageBuilderFactory
 * This widget can be use to generate a MessageBuilder; It is highly linked with the [ts.chat
 * widget](https://github.com/thesmiths-widgets/ts.chat)
 * as it act as a delegate to render message view.  
 *
 * The builder is a link between the model and the view; For a given model, there is a corresponding
 * builder; Thus, the chat widget remain the same, as it delegates the rendering to its builder
 * that can be customized and changed with the model.
 *
 *
 * Available builders :  
 * - **messenger-like**  
 */

 /**
 * @private
 * @property {Object} _styles A style preset to be used for every builder 
 * @property {Object} _styles.row A JSON representation of the tss associated to a row
 */
$._styles = {
    row: $.createStyle({ classes: ['row'] })
};

/** @method getBuilder
 * Get a new instance of a given builder. You can add your own builder and then require it through
 * this caller.
 *
 * @param {String} name Name of the builder. For the moment, only 'messenger-like' is available.
 * @param {Object} args Arguments to pass to the builder
 * @return {builders.MessageBuilder}
 */
function getBuilder (name, args) {
    var builder = Widget.createController(name, args);
    return {
        build: function (message) {
            var row = Ti.UI.createTableViewRow();
            row.applyProperties($._styles.row);
            builder.build(row, message);
            return row;
        }
    };
}




exports.getBuilder = getBuilder;
