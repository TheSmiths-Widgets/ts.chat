/* Store some constant properties */
$._NATURE = {'OLD': 1, 'NEW': 2};

/* Prepare some other properties */
$._messages;
$._rows = [];
$._resizeThreshold = 0;

/**
 * @method init
 * Initialize the widget. Should be called before any further action. 
 * @param {Object} config The configuration of the module
 * @param {Number} config.batchSize How many message should be ask for each load
 * @param {Number} config.maxTypingHeight The max size of the typing area, if decimal less than 1, a
 *      corresponding percentage of the screen size will be used.
 * @param {thesmiths: ts.messagebuilder#!/api/MessageBuilder MessageBuilder} config.messageBuilder Used to build 
 * @param {Object[]} config.messages Initial set of messages
 */
function init (config) {
    if ($._messages !== undefined) { 
        throw("ts.chat have been init more than once"); 
    }

    /* Retrieve the configuration */
    $._config = _.extend({
        batchSize: 10,
        maxTypingHeight: Ti.Platform.displayCaps.platformHeight * 0.25,
    }, config);

    if (OS_ANDROID) { 
        /* On android, the stored size isn't the good one. Need to be weighted with the density */
        $._config.maxTypingHeight /= Ti.Platform.displayCaps.logicalDensityFactor; 
    }

    /* We might expect a messageBuilder to be provided */
    if ($._config.messageBuilder === undefined) { 
        throw("No builder provided. It will be hard to render messages :/");
    }

    /* Then, just add first messages to the view */
    $._messages = [];
    $.messages.setData(_buildMessages($._NATURE.OLD, $._config.messages));
    delete($._config.messages); //Don't need them here anymore as they are stocked elsewhere
    $.messages.scrollToIndex($._rows.length - 1, { animated: false });
}

/**
 * @method getOldest
 * Retrieve the oldest message and its corresponding row stored in the widget.
 * @return {object} The required data
 * @return {object} message The required message
 * @return {appcelerator: TableViewRow} row The corresponding row
 */
function getOldest() {
    return {
        message: $._messages.slice(-1).pop(),
        row: $._rows[0]
    };
}

/**
 * @method getMostRecent
 * Retrieve the most recent message and its corresponding row stored in the widget
 * @return {object} The required data 
 * @return {object} message The required message
 * @return {appcelerator: TableViewRow} row The corresponding row
 */
function getMostRecent() {
    return {
        message: $._messages[0],
        row: $._rows.slice(-1).pop()
    };
}

/**
 * @method receive
 * Receive messages from the outside.
 * @param {object[] | object} messages A new message or several new messages to add
 */
function receive (messages) {
    $.messages.appendRow(_buildMessages($._NATURE.NEW, _.flatten([messages])));
    $.messages.scrollToIndex($._rows.length - 1);
}

/** @private
 * @method _buildMessages
 * Build views corresponding to the given messages
 * @param {int} nature The nature of the message (old or new)
 * @param {Array} [messages] Messages to add. If no message are supplied, all the existing one
 * will be used to re-generate the views.
 * @return {appcelerator: TableVie} The corresponding TableViewRows that have been generated
 */
function _buildMessages (nature, messages) {
    var row, rows, template;

    /* Append the new messages if any */
    Array.prototype[nature === $._NATURE.OLD ? 'push' : 'unshift'].apply($._messages, messages);
    $._rows = messages && $._rows || [];
    messages = messages || $._messages;

    rows = _.map(messages, function (msg) {
        row = $._config.messageBuilder.build(msg);
        row.applyProperties($.createStyle({classes: ['row']}));
        $._rows[nature === $._NATURE.OLD ? 'unshift' : 'push'](row);
        return row;
    });

    if (nature === $._NATURE.OLD) { rows = rows.reverse(); }
    return rows;
}

/**
 * @private
 * @method _resizeTypingArea
 * Avoid the area to become too large while typing a message */
function _resizeTypingArea (changeEvent) {
    var typingAreaHeight = $.typingArea.rect.height,
        length = $.typingArea.value.length;

    if (typingAreaHeight > $._config.maxTypingHeight) {
        /* The area is bigger than the limit, let's resize */
        $.typingArea.height = $._config.maxTypingHeight;
        /* Keep an eye on the length that trigger this change */
        $._resizeThreshold = $._resizeThreshold || length;
    } else if (length < $._resizeThreshold) {
        /* The area is becoming smaller, let it handle its own size like a grown up */
        $.typingArea.setHeight(Ti.UI.SIZE);
    }
}


/**
 * Listener that handle a refresh / load event triggered when the user is scrolling to get older
 * messages.
 * @param {Object} refreshEvent The event comming from nl.fokkezb.pullToRefresh widget
 * */
function _loadOld (refreshEvent) {
    /**
     * Triggered when the user request older message
     * @event load
     *      @attr {Number} number The number of message requested by the widget
     *      @attr {Object} lastMessage The oldest message owned by the widget
     *      @attr {Function} success Call on success to transmit the requested bunch of messages
     *      @attr {Function} error Call one error to inform the widget that something went wrong
     */
    var loadEvent = {
        number: $._config.batchSize,
        lastMessage: getOldest().message,
        success: function (messages) {
            _buildMessages($._NATURE.OLD, messages);
            $.messages.setData($._rows);
            refreshEvent.hide();
            if (OS_IOS) { $.messages.scrollToIndex(messages.length, { animated: false }); }
        },
        error: refreshEvent.error
    };

    $.trigger('load', loadEvent);
};

function _send (clickEvent) {
    $.send.touchEnabled = false;
    var newmessageEvent = {
        message: $.typingArea.value,
        date: new Date,
        author: $._config.user,
        success: function (message) {
            receive([message]);
            $.typingArea.value = "";
            _resizeTypingArea();
            $.send.touchEnabled = true;
        },
        error: function (errorMessage) {
            $.send.touchEnabled = true;
            //IDC
        }
    };
    $.trigger('newmessage', newmessageEvent);
}

function _snatchFocus(clickEvent) {
    $.typingArea.blur();
}


(function fixes () {
    /* If we want things to work well, we need to know the typingWrapper's size available after layout */
    $.typingWrapper.addEventListener('postlayout', function postlayoutListener () {
        /* Just want to be called once */
        $.typingWrapper.removeEventListener('postlayout', postlayoutListener); 

        /* Resize accordingly to the parent size */
        $.messagesWrapper.height = $.parent.rect.height - $.typingWrapper.rect.height - 5;
    });

    /* Also, we want to see the button when the keyboard shows up. Little workaround on ios */
    if (OS_IOS) {
        $.main.scrollingEnabled = false;
        Ti.App.addEventListener('keyboardframechanged', function (e) {
            if (e.keyboardFrame.y < Ti.Platform.displayCaps.platformHeight) {
                /* Keyboard is showing up */
                $.main.scrollTo(0, e.keyboardFrame.height);
            } else {
                /* Keyboard is leaving the screen */
                $.main.scrollToBottom();
            }
        });
    }
})();

/* TODO Cleaning function */

/* Exports the API */
exports.init = init;
exports.receive = receive;
exports.loadOld = $.loader.refresh;
exports.getMostRecent = getMostRecent;
exports.getOldest = getOldest;
/* TODO exports.cleanup */
