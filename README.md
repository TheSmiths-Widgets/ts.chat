## Chat Widget
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
<style>
    .preview { 
        text-align: center;
        width: 100%;
    }
    .preview img {
        display: inline-block;
        margin: 0 1%;
        width: 30%;
    }
</style>
<div class="preview">
    ![screenshot1](screenshot1.png)
    ![screenshot2](screenshot2.png)
    ![screenshot3](screenshot3.png)
</div>

### How to install it
Comming on GitTio.

### How to use it


