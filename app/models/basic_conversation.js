exports.definition = {
	config: {
		columns: {
		    "content": "String",
		    "date": "Date",
		    "author": "String"
		},
		adapter: {
			type: "properties",
			collection_name: "basic_conversation"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
            initialize: function (models) {
                this.comparator = function (msg) { return -msg.get('date').getTime(); }
                Backbone.Collection.prototype.initialize.call(this, models);
            },

            getOlder: function (message, number) {
                return this.filter(function (msg) {
                    return msg.get('date') < message.get('date');
                }).slice(0, number);
            }
		});

		return Collection;
	}
};
