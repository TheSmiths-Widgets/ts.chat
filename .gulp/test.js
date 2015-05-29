module.exports = function (gulp, plugins) {
    gulp.task('test:jasmine', ['build:appify'], function (done) {
        plugins.utils.env.jasmine = done;
        plugins.exec('tishadow spec');
    });


    gulp.task('test:calabash', ['build:calabash'], function (done) {
        var calabash = plugins.spawn('ti', ['calabash', '-p', process.env.PLATFORM, '-l', 'en']),
            failure = false,
            waitForPrint = true;

        calabash.stdout.on('data', function (data) {
            waitForPrint = waitForPrint && data.toString().match(/^Feature:/m) === null;
            if (!waitForPrint) process.stdout.write(data);
            failure = failure || data.toString().match(/[0-9]+\s+scenario.+\([0-9]+\s+failed,?/) !== null;
        });

        calabash.on('exit', function (err) {
            if (failure) return plugins.utils.abort('Calabash Tests Failed', done);

            plugins.utils.log(plugins.utils.colors.bold.green('\u221A Calabash Tests Passed'));

            /* Tests went well, export all screenshots */
            var screenshotsPath = process.cwd();
            if (process.env.PLATFORM === 'ios') screenshotsPath = plugins.path.join(screenshotsPath, 'build', 'iphone');

            var screenshots = plugins._.filter(plugins.fs.readdirSync(screenshotsPath), function (filename) {
                return filename.match(/screenshot.+\.png$/) !== null;
            });

            var uploadDone = plugins._.after(screenshots.length, function () {
                plugins.utils.clean_env();
                done();
            });

            var tag = [
                plugins.moment().format("YYYY-MM-DD"), 
                plugins.path.basename(process.cwd()),
                process.env.TRAVIS_COMMIT, 
                process.env.PLATFORM].join('/'); 

            plugins._.each(screenshots, function (screenshot) {
                plugins.cloudinary.uploader.upload(plugins.path.join(screenshotsPath, screenshot), function(result) {
                    plugins.utils.log('Uploading ' + screenshot + '...');
    		            plugins.utils.log(result.url);
    		            uploadDone();
                }, { folder: tag, use_filename: true });
            });
        });
    });
};
