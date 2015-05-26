var moment = require('moment');

/* Retrieve expected configuration */
(function construct (args) {
    if (args.user === undefined) {
        throw("Expecting a username to be supplied in order to build messages");
    }

    $._user = args.user;

    /* Handle available styling for each message */
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
    $._LONG_ENOUGH = 1000 * 30 * 60; /* 30 minutes */
    $._previousOld = 0;
    $._previousNew = 0;

})(arguments[0] || {});

/**
 * Build a message accordingly with the given template 
 *
 * @param {appcelerator: Titanium.UI.TableViewRow} The parent row
 * @param {Object} message The message to build. Should be an instance of the model.
 * @param {string} template The template of the message that select a correct style.
 *
 * @return {appcelerator: Titanium.UI.TableViewRow} The built row
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
