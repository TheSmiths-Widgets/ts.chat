var exec = require('child_process').exec;

function isXXXLine(line, type) {
    return line.match(new RegExp('\\[' + type + '\\]\\s+')) !== null;     
}

module.exports = {
    isDebugLine: function (line) {
        return isXXXLine(line, 'DEBUG');
    },

    isWarningLine: function (line) {
        return isXXXLine(line, 'WARN|WARNING');
    },

    isErrorLine: function (line) {
        return isXXXLine(line, 'ERROR');
    },

    isInfoLine: function (line) {
        return isXXXLine(line, 'INFO');
    },

    isTestLine: function (line, built) {
        var isJasmineLine = line.match(/\[TEST|PASS|FAIL\]\s\[.+\]\s(.+)/) !== null;
        var isCalabashLine = line.match(/building the -cal scheme/) === null;
        return isJasmineLine || (built && isCalabashLine);
    },

    isFailureLine: function (line) {
        var isJasmineFailure = isXXXLine(line, 'FAIL');
        var isCalabashFailure = line.match(/[0-9]+\s+scenario.+\([0-9]+\s+failed,?/);
        return isJasmineFailure || isCalabashFailure;
    },

    isDeviceConnected: function (line) {
        return isXXXLine(line, 'INFO') && line.match(/\[.+\]\s\w+\slaunched\./) !== null;
    },

    isBuiltSuccess: function (line) {
        return isXXXLine(line, 'INFO') && line.match(/Project built successfully in/) !== null;
    },

    isCalabashBuiltSuccess: function (line) {
       return  line.match(/^\*\* BUILD SUCCEEDED \*\*\s*$/) !== null;
    },

    formatJasmineLine: function (line) {
        return line
            .replace(/\[\S+,\s\S+,\s\S+\]\s/g, '')
            .replace(/\n/g, '')
            .replace(/\[TEST\]\s\[/, '[') + "\n";
    },

    formatCalabashLine: function (line) {
        var src = line.split(/\n|\r/);

        for (var length = src.length, i = 0; i < length; i++) {
            /* Avoid blank line */
            if (src[i].match(/^\s+$/)) { continue; }

            /* Feature */
            if (src[i].match(/^Feature:\s/)) src[i] = "\033[1;36m" + src[i] + "\033[0m";

            /* Failing scenar */
            if (src[i].match(/^cucumber[^\r\n]+#\s+Scenario/)) {
                src[i] = "\033[0;31m" + src[i] + "\033[0m";
                continue;
            }

            /* Scenario */
            var scenarReg = /^(\s+Scenario:[^\r\n#]+)/;
            if (src[i].match(scenarReg)) src[i] =  src[i].replace(scenarReg, "\033[0;36m$&\033[0m");
            
            /* Comments */
            var commentReg = /(#[^\r\n]+)/g;
            if (src[i].match(commentReg)) {
                src[i] = src[i].replace(commentReg, "\033[0;30m$&\033[0m");
            }

            /* Errors */
            if (src[i].match(/^\s{6,}[^\r\n]+$/)) {
                src[i] = "\033[0;31m" + src[i] + "\033[0m";
                src[i-1] = "\033[0;31m" + src[i-1] + "\033[0m";
            }

            /* Failure */
            if (src[i].match(/^Failing Scenarios:/)) src[i] = "\033[1;31m" + src[i] + "\033[0m";
        }

        return src.join('\n');
    },

    clean_env: function (callback) {
        exec('ps', function (err, stdout) {
            if (err) { 
                process.stdout.write('\033[1;30mFailed to clean environment\033[0m\n');
            } else {
                var re = /([0-9]+).+node.+(tishadow\sserver|ti)\s.+/g, 
                    pid;

                while ((pid = re.exec(stdout)) !== null) {
                    exec('kill -9 ' + pid[1]);
                }
		
                exec('ti clean && tishadow clear', callback);
            }   
        });
    },

    abort: function (msg, callback) {
        var err = new Error('\033[1;30m' + msg + '\033[0m');
        err.showStack = false;
        module.exports.clean_env();
        if (callback) return callback(err);

        /* No callback supplied */
        process.stdout.write('\033[0;31m' + msg + '\033[0m\n');
        process.exit(1);
    }

};
