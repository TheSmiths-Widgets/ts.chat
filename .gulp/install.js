module.exports = function (gulp, plugins) {
    gulp.task('install:android_sdk', ['install:create_emulator'], function() {
        plugins.utils.log(plugins.utils.colors.cyan.bold("Yeay ! Android SDK have been successfully installed."));
    });

    gulp.task('install:create_emulator', ['install:update_arm'], function (done) {
        plugins.exec('echo no | android create avd --force -n test -t "Google Inc.:Google APIs:"' + process.env.ANDROID_VERSION + ' -b default/armeabi-v7a -d "Nexus 4"', done).stdout.pipe(process.stdout);
    });

    gulp.task('install:update_arm', ['install:update_addOnGoogle'], function (done) {
        plugins.exec('echo yes | android -s update sdk --no-ui --all --filter sys-img-armeabi-v7a-android-' + process.env.ANDROID_VERSION, done).stdout.pipe(process.stdout);
    });

    gulp.task('install:update_addOnGoogle', ['install:update_android'], function (done) {
        plugins.exec('echo yes | android -s update sdk --no-ui --all --filter addon-google_apis-google-' + process.env.ANDROID_VERSION, done).stdout.pipe(process.stdout);
    });

    gulp.task('install:update_android', ['install:update_extraSupport'], function (done) {
        plugins.exec('echo yes | android -s update sdk --no-ui --all --filter android-' + process.env.ANDROID_VERSION, done).stdout.pipe(process.stdout);
    });

    gulp.task('install:update_extraSupport', ['install:update_buildTools'], function (done) {
        plugins.exec('echo yes | android -s update sdk --no-ui --all --filter extra-android-support', done).stdout.pipe(process.stdout);
    });

    gulp.task('install:update_buildTools', ['install:update_tools'], function (done) {
        plugins.exec('echo yes | android -s update sdk --no-ui --all --filter build-tools-22.0.0', done).stdout.pipe(process.stdout);
    });

    gulp.task('install:update_tools', ['install:update_platformTools'], function (done) {
        plugins.exec('echo yes | android -s update sdk --no-ui --all --filter tools', done).stdout.pipe(process.stdout);
    });

    gulp.task('install:update_platformTools', ['install:configPath'], function (done) {
        plugins.exec('echo yes | android -s update sdk --no-ui --all --filter platform-tools', done).stdout.pipe(process.stdout);
    });

    gulp.task('install:configPath', ['install:getSDK'], function (done) {
        plugins.exec('titanium config android.sdkPath $ANDROID_HOME', function (err) {
            if (err) return plugins.utils.abort(err.message, done);
            process.env.ANDROID_VERSION = process.env.ANDROID_VERSION || '19';
            plugins.utils.log(plugins.utils.colors.cyan.bold("Processing install for android " + process.env.ANDROID_VERSION));
            done();
        });
    });

    gulp.task('install:getSDK', ['ensure:android'], function (done) {
        plugins.exec("wget http://dl.google.com/android/android-sdk_r24.1.2-macosx.zip", function (err){
            if (err) return plugins.utils.abort(err.message, done);
            plugins.exec("unzip -q android-sdk_r24.1.2-macosx.zip", done).stdout.pipe(process.stdout);
        }).stdout.pipe(process.stdout);
    });

    gulp.task('start:emulator', ['ensure:android'], function (done) {
        plugins.exec('emulator -avd test -no-audio -no-window &');

        /* Wait for the emulator to start */
        var waitForEmulatorToStart = function (nbTries, maxTries, callback) {
            plugins.utils.log("Waiting for the emulator to start...");
            plugins.exec('adb -e shell getprop init.svc.bootanim', function(err, stdout) {
                if (nbTries < maxTries && (stdout === null || stdout.match(/stopped/) === null)) {
                    setTimeout(waitForEmulatorToStart, 1000 * 30, nbTries + 1, maxTries, callback);
                } else if (nbTries >= maxTries) {
                    plugins.utils.abort("Emulator didn't start...", done);
                } else {
                    plugins.utils.log(plugins.utils.colors.cyan("Emulator has started."));
                    unlockScreen(1, 3, callback);
                }
            });
        };

        var unlockScreen = function (nbTries, maxTries, callback) {
            plugins.utils.log("Unlocking screen...");
            plugins.exec('adb -e shell input keyevent 82', function (err, stdout) {
                plugins.exec('adb -e shell dumpsys window windows | grep mCurrentFocus', function (err, stdout) {
                    if (nbTries < maxTries && stdout.match(/Keyguard/) !== null) {
                        setTimeout(unlockScreen, 1000 * 10, nbTries + 1,  maxTries, callback);
                    } else if (nbTries >= maxTries) {
                        plugins.utils.abort("Unable to unlock screen", done);
                    } else {
                        plugins.utils.log(plugins.utils.colors.cyan("Screen unlocked."));
                        callback();
                    }
                });
            });
        };

        waitForEmulatorToStart(1, 30, function () {
                done();
                process.exit();
        });
    });

    gulp.task('ensure:android', function () {
        if (process.env.PLATFORM !== "android") {
          plugins.utils.log(plugins.utils.colors.yellow.bold("Android is not the target platform; task skipped..."));
          process.exit();
        }
    });
};
