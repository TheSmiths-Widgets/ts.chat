var conversation = Alloy.createCollection('basic_conversation');

var NB_MESSAGES = 1000, offset = 0;
for (var i = 0; i < NB_MESSAGES; i++) {
    if(Math.random() > 0.8) { offset += 45; }
    var date = new Date(Date.now() - 1000 * 60 * (i + offset));
    conversation.add({
        content: NB_MESSAGES - i,
        author: "Author"+(i%2+1),
        date: date
    });
}
conversation.add([
    {
        content: L('someMessage'),
        author: "Author1",
        date: new Date
    },
    {
        content: L('someOtherMessage'),
        author: "Author2",
        date: new Date(conversation.at(15).get('date').getTime() - 10)
    }
]);

$.index.addEventListener('open', function (e) {
    $.chat.init({
        messageBuilder: Alloy.createWidget('ts.messageBuilderFactory').getBuilder('messenger_like', {
            user: "Author1"
        }),
        messages: conversation.slice(0, 30)
    });
});

$.chat.on('load', function (loadEvent) {
    setTimeout(function () {
        loadEvent.success(conversation.getOlder(loadEvent.lastMessage, loadEvent.number));
    }, 800);
});

$.chat.on('newmessage', function (newMessageEvent) {
    var message = new Backbone.Model({
        content: newMessageEvent.message,
        author: "Author1",
        date: newMessageEvent.date
    });
    conversation.add(message);
    newMessageEvent.success(message);
});


$.index.open();
