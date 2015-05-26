/******* Imports ********/
var gulp = require('gulp'),
    _ = require('underscore'),
    plugins = {
        exec: require('child_process').exec,
        spawn: require('child_process').spawn,
        path: require('path'),
        fs: require('fs'),
        _: _,
        moment: require('moment'),
        utils: _.extend(require('gulp-util'), require('gulp-additional-utils')),
        xml2js: require('xml2js'),
        cloudinary: require('cloudinary')
    },
    GULP_DIR = './.gulp';
plugins.utils.env.config = JSON.parse(plugins.fs.readFileSync(plugins.path.join(process.cwd(), 'app', 'config.json')));  

/** Require all tasks defined in several gulpfiles **/
var gulpfiles = plugins.fs.readdirSync(GULP_DIR);
_.each(gulpfiles, function (gulpfile) {
    require(GULP_DIR + '/' + plugins.path.basename(gulpfile, '.js'))(gulp, plugins);
});
