## Chat Widget
[![Appcelerator
Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://appcelerator.com/titanium/)
[![Appcelerator
Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://appcelerator.com/alloy/)
[![License](http://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](http://choosealicense.com/licenses/apache-2.0/)


This widget is an example of chat widget where the content is separated from the widget in such a
way that any kind of model could be used with this widget. The widget uses
[builders](https://github.com/thesmiths-widgets/ts.messageBuilderFactory) to generate views
corresponding to a message; This builders act as delegates so that the widget can focus its concern
on displaying correctly those messages together.

Therefore, it handles the succession of messages in a *TableView* and gives easy ways to : 
- load older messages
- add new message to the list
- handle user inputs in a 'responsive' textArea

As a matter of fact, the widget is also a playground for new testing methods and tools. Then, It
follows a continuous integration process where builds and tests are made in the cloud with
[travis](https://travis-ci.org).

A detailed documentation may be found here :
[documentation](https://thesmiths-widgets.github.io/ts.chat)

### Previews
Screenshots taken on an iPhone 4s Simulator using the *messenger-like* builder.
![screenshot1](https://github.com/thesmiths-widgets/ts.chat/blob/doc/images/screenshot1.png)
![screenshot2](https://github.com/thesmiths-widgets/ts.chat/blob/doc/images/screenshot2.png)
![screenshot3](https://github.com/thesmiths-widgets/ts.chat/blob/doc/images/screenshot3.png)

### How to install it
Comming on GitTio.

### How to use it

#### Initialization
First of all, the widget might be initialized once the windows is opened. This could be performed in
the following way :

```javascript
    $.index.addEventListener('open', function (e) {
        $.chat.init({
            messageBuilder: messengerLike,
        });
    });

    // ... Do some awesome stuff

    $.index.open();
```

Others parameters might be supplied during the initialisation such as an initial set of messages.
Please, have a look to [the following documentation
page](https://thesmiths-widgets.github.io/#!/api/ts.chat-method-init) for more info.

#### Listen to events 
The widget may trigger two kind of events : `load` and `newmessage`. Both event are documented
[here](https://thesmiths-widgets.github.io/#!/api/ts.chat-event-load). 

The first one is fired each time the user is asking for older messages (i.e.: scrolling up); the
event contains some useful pieces of information such as the last message currently displayed as
well as callbacks to response to the widget. 

```javascript
    $.chat.on('load', function (loadEvent) {
        // Do some stuff do handle the request ...
        loadEvent.success(/* someOlderMessages */);
    });
```

The second one is fired when the user has pressed the *send* button. The event holds data such as
the content of the message and the date at which it has been send. Also, like the previous one, it
offers two callbacks to handle success and error response. As the widget does not know how to create
a message from a text content, the parent controller is supposed to supply an instance of the new
message as an argument of the success callback.

```javascript
    $.chat.on('newmessage', function (newMessageEvent) {
        // Do some stuff to handle the new message
        newMessageEvent.succcess(/* message */);
    });
```

#### Add new messages to the widget
It is also possible to manually add new messages to the chat widget (for instance, when a new
message is sent from an app, it may trigger a specific event to the app of the opposite user...).
To do such a thing, just use the `receive` function which handle either a message or an array of
messages. 

```javascript
    $.chat.receive(/* Tons of messages */);
```

### Dependencies 

#### Pull To Refresh
The widget uses the [pullToRefresh](https://github.com/FokkeZB/nl.fokkezb.pullToRefresh) widget by **Fokke Zandbergen**

#### Message Builder
It also requires you to supply a message builder in order to render views. More info about message
builders [right here](https://github.com/thesmiths-widgets/ts.messageBuilderFactory).

### TODO

- Give ways to change the style (colors, size, etc. ) from the outside.
- Add a *clean* function

[![wearesmiths](http://wearesmiths.com/media/logoGitHub.png)](http://wearesmiths.com)
