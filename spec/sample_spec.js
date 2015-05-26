/* Add Alloy in the global scope so that required module can have access */
this.Alloy = require("alloy"); this.Backbone = Alloy.Backbone; this._ = Alloy._;

/* Firstly, create a small test model */
var conversation = Alloy.createCollection('basic_conversation'),
    widget, 
    options = {
        smallAmount: 30,
        nbMessages: 1000,
        hugeAmount: 1000
    };

var offset = 0;
for (var i = 0; i < options.nbMessages; i++) {
    if(Math.random() > 0.8) { offset += 45; }
    var date = new Date(Date.now() - 1000 * 60 * (i + offset));
    conversation.add({
        content: options.nbMessages - i,
        author: "Author"+(i%2+1),
        date: date
    });
}

/* We'll also need a message builder */
var messageBuilder = Alloy.createWidget('ts.factory.chatMessage').getFactory('messenger_like', {
    user: "Author1"
});

describe("Widget initialization", function () {
    beforeEach(function () {
        widget = Alloy.createWidget('ts.chat');
    });

    afterEach(function () {
        widget = null;
    });

    it("can be initialized with no message", function () {
        expect(function () {
            widget.init({messageBuilder: messageBuilder});
        }).not.toThrow();
        
        expect(widget._messages.length).toEqual(0);
        expect(widget._rows.length).toEqual(0);
    });

    it("can be initialized with a small amount of messages", function () {
        expect(function () {
            widget.init({
                messageBuilder: messageBuilder,
                messages: conversation.models.slice(0, options.smallAmount)
            });
        }).not.toThrow();
    
        expect(widget._messages.length).toEqual(options.smallAmount);
        expect(widget.getMostRecent().message.get('content')).toEqual(options.nbMessages);
        expect(widget.getOldest().message.get('content')).toEqual(options.nbMessages - options.smallAmount + 1);
        expect(widget._rows.length).toEqual(options.smallAmount);
    });

    it("can be initialized with a huge amount of messages... why not ?", function () {
        expect(function () {
            widget.init({
                messageBuilder: messageBuilder,
                messages: conversation.models.slice(0, options.hugeAmount)
            });
        }).not.toThrow();

        expect(widget._messages.length).toEqual(options.hugeAmount);
        expect(widget.getMostRecent().message.get('content')).toEqual(options.nbMessages);
        expect(widget.getOldest().message.get('content')).toEqual(options.nbMessages - options.hugeAmount + 1);
        expect(widget._rows.length).toEqual(options.hugeAmount);
    });

    it("can't be initialized more than once", function () {
        expect(function () {
            widget.init({messageBuilder: messageBuilder});
            widget.init({messageBuilder: messageBuilder});
        }).toThrow();
    });
});




describe("New message reception/emitting", function () {
    var message = new Backbone.Model({
            author: "a Smith",
            date: new Date(),
            content: "42 is the answer. So is 14."}),
        fakeListener;

    beforeEach(function () {
        widget = Alloy.createWidget('ts.chat');
        widget.init({
            messageBuilder: messageBuilder,
            messages: conversation.slice(0, options.smallAmount)
        });
        fakeListener = {
            handler: function (loadEvent) { 
                loadEvent.success([message, message, message]);
            }
        };
        spyOn(fakeListener, 'handler').andCallThrough();
        widget.on('load', fakeListener.handler);
    });
    afterEach(function () {
        widget = null;
    });

    it("Can receive a new message", function () {
        widget.receive(message);
        expect(widget._messages.length).toEqual(options.smallAmount + 1);
        expect(widget.getMostRecent().message.get('content')).toEqual(message.get('content'));
    });

    it("Can receive more than one message at once", function () {
        widget.receive([message, message, message]);
        expect(widget._messages.length).toEqual(options.smallAmount + 3);
        expect(widget.getMostRecent().message.get('content')).toEqual(message.get('content'));
    });

    it("Can trigger a load event to ask for older message", function () {
        runs(widget.loadOld);

        waitsFor(function () {
            return widget._messages.length > options.smallAmount;
        }, "No event Emitted", 800);
        
        runs(function () {
            expect(fakeListener.handler).toHaveBeenCalled();
            expect(fakeListener.handler.mostRecentCall.args[0].lastMessage.get('content'))
                .toEqual(options.nbMessages - options.smallAmount + 1);
        });
    });
});
