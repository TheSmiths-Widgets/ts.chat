/** 
 * @class builders.messengerLikeBuilder
 * @extends builders.MessageBuilder
 * Use to build message that looks like a bit like messenger style.
 *
 * @requires momentjs
 */

var moment = require(WPATH('moment'));

/** 
 * @private
 * @constructor
 * @method construct
 * Initialize the builder
 *
 * @param {Object} args Supplied arguments
 * @param {String} args.user 
 */
(function construct (args) {
    if (args.user === undefined) {
        throw("Expecting a username to be supplied in order to build messages");
    }

    /**
    * @private
    * @property {String} _user The current user of the app.
    */
    $._user = args.user;

    /**
    * @private 
    * @property {Object} _styles Styles used to stylish the different views
    * @property {Object} _styles.outerBubble The external container style
    * @property {Object} _styles.contentReceived The content style for received messages
    * @property {Object} _styles.contentSent The content style for sent messages
    * @property {Object} _styles.bubbleReceived The inner container style for received messages
    * @property {Object} _styles.bubbleSent The inner container style for sent messages
    * @property {Object} _styles.date Date helper style
    */
    $._styles = {
        outerBubble: $.createStyle({ classes: ['outerBubble'] }),
        contentReceived: $.createStyle({ classes: ['message', 'messageReceived'] }),
        contentSent: $.createStyle({ classes: ['message', 'messageSent'] }),
        bubbleReceived: $.createStyle({ classes: ['bubble', 'bubbleReceived'] }),
        bubbleSent: $.createStyle({ classes: ['bubble', 'bubbleSent' ] }),
        date: $.createStyle({ classes: ['date'] })
    };
    $._styles.outerBubbleReceived = $._styles.outerBubbleSent = $._styles.outerBubble;

    /* We'll also handle some date so that we can display a date helper sometimes */
    /**
    * @private 
    * @property {Number} _LONG_ENOUGH Minimal interval of time between two date display (in ms)
    */
    $._LONG_ENOUGH = 1000 * 30 * 60; /* 30 minutes */

    /**
    * @private 
    * @property {Number} _previousOld The date of the last oldest message rendered
    */
    $._previousOld = 0;

    /**
    * @private
    * @property {Number} _previousNew The date of the most recent message rendered
    */
    $._previousNew = 0;

})(arguments[0] || {});

/**
 * @method build
 * Build a simple message; Messages here are Backbone models which contains at least
 * 3 properties : author, date and content.
 *
 * @param {appcelerator: Titanium.UI.TableViewRow TableViewRow} row The parent row
 * @param {Object} message The message to build. Should be an instance of the model.
 * */
function build (row, message) {
    var views = {},
        template = (message.get('author') === $._user) ? "Sent" : "Received",
        elapsed, 
        isOld;

    /* Create all view used to display a single message*/
    views.bubble = Ti.UI.createView();
    views.outerBubble = Ti.UI.createView();
    views.content = Ti.UI.createLabel({ text: message.get('content') });

    /* Apply some styles to them */
    for (vKey in views) { views[vKey].applyProperties($._styles[vKey + template]); }

    /* Wrap'em all*/
    views.bubble.add(views.content);
    views.outerBubble.add(views.bubble);

    /* Handle date */   
    elapsed = $._previousOld - message.get('date').getTime();
    if (elapsed > 0) {
        /* The message is an older one */
        isOld = true;
        $._previousOld -= elapsed;
    } else {
        /* The message is a new one */
        $._previousNew += (elapsed = $._previousOld - elapsed - $._previousNew);

        /* For the very first message which is both the oldest and the mostRecent */
        isOld = !$._previousOld;
        $._previousOld = $._previousOld || $._previousNew;
    }

    if (elapsed > $._LONG_ENOUGH) {

        if (isOld) {
            views.date = Ti.UI.createLabel({ text: moment(new Date($._previousOld)).format('llll') });
            views.date.applyProperties($._styles.date);
            /* The order matter */
            row.add(views.outerBubble);
            row.add(views.date);
        } else {
            views.date = Ti.UI.createLabel({ text: moment(new Date($._previousNew - elapsed)).format('llll') });
            views.date.applyProperties($._styles.date);
            /* The order matter */
            row.add(views.date);
            row.add(views.outerBubble);
        }
    } else {
        row.add(views.outerBubble);
    }
}




exports.build = build;
