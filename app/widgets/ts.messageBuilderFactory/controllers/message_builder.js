/** 
 * @abstract
 * @class builders.MessageBuilder
 *
 * Interface that every builder should implement.
 */

/** @method build
 * Build a message 
 *
 * @param {appcelerator: Titanium.UI.TableViewRow TableViewRow} row The parent row
 * @param {Object} message The message model object
 */
function build (row, message) { };


/**
 * @private
 * @method construct
 * @constructor
 *
 * Initialize the builder; Called when the widget is created with given arguments.
 * @param {Object} args Arguments to supply to the widget
 */
(function construct (args) { })(arguments[0] || {});




exports.build = build;
