# Component boilerstrap by TheSmiths


Specifications for the chat :

- A chat is an ordered set of messages, ordered by post date Desc
- A message is an object with at least a content string of a given size (150 characters for exemple, or unlimited).
- A message can have supplementary options / attributes.
- The widget should handle predefined options 'date' and 'author' in a particular way. 
- Other options are just appended at the end in the form key / value 

- Model might supply methods to retrieve and store messages :
    - fetchNext (options)
        options:
            start {int} <optional> If supplied, should be the index of the first message
            since {Date} <optional> If supplied, the index of the first message since the
            supplied date
            number {int} <optional> If supplied, return at least number message. Default to idc
    - add (message) 
        message {Message} The message to add 
