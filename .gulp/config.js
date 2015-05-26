module.exports = function (gulp, plugins) {
    /****** Config Tasks ******/
    gulp.task('config:tiapp', function (done) {
        var target = plugins.utils.env.test && 'test' || plugins.utils.env.production && 'production' || 'development';

        (new plugins.xml2js.Parser()).parseString(plugins.fs.readFileSync('tiapp.xml'), function (err, result) {
            if (err) return plugins.utils.abort(err.message, done);

            plugins._.each(
                plugins._.extend(plugins.utils.env.config.global, plugins.utils.env.config['env:'+target]), 
                function (value, key) {
                    if (plugins._.has(result['ti:app'], key)) {
                        result['ti:app'][key] = value;
                    } else if (key == "properties") {
                        result.property = result.property || [];
                        var existingProperties = plugins._.map(result['ti:app'].property, function(property) {
                                return property.$.name;
                        });
                        plugins._.each(value, function (property, name) {
                            if (plugins._.contains(existingProperties, name)) {
                                plugins._.find(
                                    result['ti:app'].property, 
                                    function (p) { return p.$.name == name; }
                                )._ = property;
                            } else {
                                result['ti:app'].property.push({_: property,'$': {name: name, type: 'string'}});
                            }
                        });
                    } else {
                        plugins.utils.log(plugins.utils.colors.bold.yellow('Key "' + 
                            key + '" not found in tiapp.xml; Ignored.'));
                    }
                }
            );
            var xml = (new plugins.xml2js.Builder()).buildObject(result);

            /* Root appear sometimes ? */
            if (xml.match(/<root>/) !== null)
                xml = xml.replace('<root>\n','').replace('\n</root>', '').replace(/\n\s\s/g, '\n');
            plugins.fs.writeFile('tiapp.xml', xml, done);
        });;
    });
};
