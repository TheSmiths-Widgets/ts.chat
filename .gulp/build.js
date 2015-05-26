module.exports = function (gulp, plugins) {
    gulp.task('build:appify', function (done) {
        var failure = false;
        process.env.PLATFORM = process.env.PLATFORM || (plugins.utils.env.android ? 'android' : 'ios');

        /* Start TiShadow Server */
        plugins.exec('tishadow server').stdout.on('data', function (data) {
            if (data.match(/\[INFO\]/) === null) process.stdout.write(data);

            /* Watch for the server starts */
            var ip = data.match(/\[DEBUG\] connect to ((\d+\.?){4}):\d+/);
            if (ip !== null) {
                plugins.exec('ti build --appify -p ' + process.env.PLATFORM + ' --log-level warn -o ' + ip[1]);
            }

            /* Watch for the simulator to be ready */
            if (data.match(/\[INFO\] \[\S+, \S+, \S+\] \S+ launched\./) !== null) {
                done();
            }

            /* Watch for fail tests */
            failure = failure || (data.match(/\[FAIL\] \[\S+, \S+, \S+\].+ spec\(s\) failed\./) !== null);

            /* Watch for jasmine to end */
            if (data.match(/\[TEST\] \[\S+, \S+, \S+\] Runner Finished/) !== null) {
                if (failure) return plugins.utils.abort('Jasmine tests failed', plugins.utils.env.jasmine);
                plugins.utils.env.jasmine();
    	          plugins.utils.clean_env();
            }
        });
    });


    gulp.task('build:calabash', ['clean'], function (done) {
        process.env.PLATFORM = process.env.PLATFORM || (plugins.utils.env.android ? 'android' : 'ios');
        if (process.env.PLATFORM === 'ios') {
            /* Determine a valid simulator for ios (to avoid the default one used by calabash.
            * This is deprecated, but for now, don't have time to look deeper inside cucumber
            * to discover how to supply a valid simulator (which handle i18n) */
            var instr_listener = function (data) {
                var re = /(iPhone 6 \([\d\.]+ Simulator\))/;
                if (data.toString().match(re) !== null) {
                    instr_process.stdout.removeListener('data', instr_listener);
                    process.env['DEVICE_TARGET'] = data.toString().match(re)[1];

                    /* Retrieve the appname from the tiapp */
                    (new plugins.xml2js.Parser()).parseString(plugins.fs.readFileSync('tiapp.xml'), function (err, result) {
                        if (err) plugins.utils.abort(err.message);

                        process.env['TARGET'] = result['ti:app'].name[0];
                    });
                    plugins.exec('ti build -p ' + process.env.PLATFORM + ' --log-level warn --build-only', done);
                }
            };
            var instr_process = plugins.exec('instruments -s devices');
            instr_process.stdout.on('data', instr_listener);
        } else {
    	    done();
        }
    });
};
