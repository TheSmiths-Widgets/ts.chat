!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : global.moment = factory();
}(this, function() {
    "use strict";
    function utils_hooks__hooks() {
        return hookCallback.apply(null, arguments);
    }
    function setHookCallback(callback) {
        hookCallback = callback;
    }
    function defaultParsingFlags() {
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false
        };
    }
    function isArray(input) {
        return "[object Array]" === Object.prototype.toString.call(input);
    }
    function isDate(input) {
        return "[object Date]" === Object.prototype.toString.call(input) || input instanceof Date;
    }
    function map(arr, fn) {
        var i, res = [];
        for (i = 0; i < arr.length; ++i) res.push(fn(arr[i], i));
        return res;
    }
    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }
    function extend(a, b) {
        for (var i in b) hasOwnProp(b, i) && (a[i] = b[i]);
        hasOwnProp(b, "toString") && (a.toString = b.toString);
        hasOwnProp(b, "valueOf") && (a.valueOf = b.valueOf);
        return a;
    }
    function create_utc__createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }
    function valid__isValid(m) {
        if (null == m._isValid) {
            m._isValid = !isNaN(m._d.getTime()) && m._pf.overflow < 0 && !m._pf.empty && !m._pf.invalidMonth && !m._pf.nullInput && !m._pf.invalidFormat && !m._pf.userInvalidated;
            m._strict && (m._isValid = m._isValid && 0 === m._pf.charsLeftOver && 0 === m._pf.unusedTokens.length && void 0 === m._pf.bigHour);
        }
        return m._isValid;
    }
    function valid__createInvalid(flags) {
        var m = create_utc__createUTC(0/0);
        null != flags ? extend(m._pf, flags) : m._pf.userInvalidated = true;
        return m;
    }
    function copyConfig(to, from) {
        var i, prop, val;
        "undefined" != typeof from._isAMomentObject && (to._isAMomentObject = from._isAMomentObject);
        "undefined" != typeof from._i && (to._i = from._i);
        "undefined" != typeof from._f && (to._f = from._f);
        "undefined" != typeof from._l && (to._l = from._l);
        "undefined" != typeof from._strict && (to._strict = from._strict);
        "undefined" != typeof from._tzm && (to._tzm = from._tzm);
        "undefined" != typeof from._isUTC && (to._isUTC = from._isUTC);
        "undefined" != typeof from._offset && (to._offset = from._offset);
        "undefined" != typeof from._pf && (to._pf = from._pf);
        "undefined" != typeof from._locale && (to._locale = from._locale);
        if (momentProperties.length > 0) for (i in momentProperties) {
            prop = momentProperties[i];
            val = from[prop];
            "undefined" != typeof val && (to[prop] = val);
        }
        return to;
    }
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(+config._d);
        if (false === updateInProgress) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }
    function isMoment(obj) {
        return obj instanceof Moment || null != obj && hasOwnProp(obj, "_isAMomentObject");
    }
    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        0 !== coercedNumber && isFinite(coercedNumber) && (value = coercedNumber >= 0 ? Math.floor(coercedNumber) : Math.ceil(coercedNumber));
        return value;
    }
    function compareArrays(array1, array2, dontConvert) {
        var i, len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0;
        for (i = 0; len > i; i++) (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) && diffs++;
        return diffs + lengthDiff;
    }
    function Locale() {}
    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace("_", "-") : key;
    }
    function chooseLocale(names) {
        var j, next, locale, split, i = 0;
        while (i < names.length) {
            split = normalizeLocale(names[i]).split("-");
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split("-") : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join("-"));
                if (locale) return locale;
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) break;
                j--;
            }
            i++;
        }
        return null;
    }
    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && "undefined" != typeof module && module && module.exports) try {
            oldLocale = globalLocale._abbr;
            require("./locale/" + name);
            locale_locales__getSetGlobalLocale(oldLocale);
        } catch (e) {}
        return locales[name];
    }
    function locale_locales__getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            data = "undefined" == typeof values ? locale_locales__getLocale(key) : defineLocale(key, values);
            data && (globalLocale = data);
        }
        return globalLocale._abbr;
    }
    function defineLocale(name, values) {
        if (null !== values) {
            values.abbr = name;
            locales[name] || (locales[name] = new Locale());
            locales[name].set(values);
            locale_locales__getSetGlobalLocale(name);
            return locales[name];
        }
        delete locales[name];
        return null;
    }
    function locale_locales__getLocale(key) {
        var locale;
        key && key._locale && key._locale._abbr && (key = key._locale._abbr);
        if (!key) return globalLocale;
        if (!isArray(key)) {
            locale = loadLocale(key);
            if (locale) return locale;
            key = [ key ];
        }
        return chooseLocale(key);
    }
    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + "s"] = aliases[shorthand] = unit;
    }
    function normalizeUnits(units) {
        return "string" == typeof units ? aliases[units] || aliases[units.toLowerCase()] : void 0;
    }
    function normalizeObjectUnits(inputObject) {
        var normalizedProp, prop, normalizedInput = {};
        for (prop in inputObject) if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            normalizedProp && (normalizedInput[normalizedProp] = inputObject[prop]);
        }
        return normalizedInput;
    }
    function makeGetSet(unit, keepTime) {
        return function(value) {
            if (null != value) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            }
            return get_set__get(this, unit);
        };
    }
    function get_set__get(mom, unit) {
        return mom._d["get" + (mom._isUTC ? "UTC" : "") + unit]();
    }
    function get_set__set(mom, unit, value) {
        return mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value);
    }
    function getSet(units, value) {
        var unit;
        if ("object" == typeof units) for (unit in units) this.set(unit, units[unit]); else {
            units = normalizeUnits(units);
            if ("function" == typeof this[units]) return this[units](value);
        }
        return this;
    }
    function zeroFill(number, targetLength, forceSign) {
        var output = "" + Math.abs(number), sign = number >= 0;
        while (output.length < targetLength) output = "0" + output;
        return (sign ? forceSign ? "+" : "" : "-") + output;
    }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        "string" == typeof callback && (func = function() {
            return this[callback]();
        });
        token && (formatTokenFunctions[token] = func);
        padded && (formatTokenFunctions[padded[0]] = function() {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        });
        ordinal && (formatTokenFunctions[ordinal] = function() {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        });
    }
    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) return input.replace(/^\[|\]$/g, "");
        return input.replace(/\\/g, "");
    }
    function makeFormatFunction(format) {
        var i, length, array = format.match(formattingTokens);
        for (i = 0, length = array.length; length > i; i++) array[i] = formatTokenFunctions[array[i]] ? formatTokenFunctions[array[i]] : removeFormattingTokens(array[i]);
        return function(mom) {
            var output = "";
            for (i = 0; length > i; i++) output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            return output;
        };
    }
    function formatMoment(m, format) {
        if (!m.isValid()) return m.localeData().invalidDate();
        format = expandFormat(format, m.localeData());
        formatFunctions[format] || (formatFunctions[format] = makeFormatFunction(format));
        return formatFunctions[format](m);
    }
    function expandFormat(format, locale) {
        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }
        var i = 5;
        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }
        return format;
    }
    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = "function" == typeof regex ? regex : function(isStrict) {
            return isStrict && strictRegex ? strictRegex : regex;
        };
    }
    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) return new RegExp(unescapeFormat(token));
        return regexes[token](config._strict, config._locale);
    }
    function unescapeFormat(s) {
        return s.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function addParseToken(token, callback) {
        var i, func = callback;
        "string" == typeof token && (token = [ token ]);
        "number" == typeof callback && (func = function(input, array) {
            array[callback] = toInt(input);
        });
        for (i = 0; i < token.length; i++) tokens[token[i]] = func;
    }
    function addWeekParseToken(token, callback) {
        addParseToken(token, function(input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }
    function addTimeToArrayFromToken(token, input, config) {
        null != input && hasOwnProp(tokens, token) && tokens[token](input, config._a, config, token);
    }
    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }
    function localeMonths(m) {
        return this._months[m.month()];
    }
    function localeMonthsShort(m) {
        return this._monthsShort[m.month()];
    }
    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for (i = 0; 12 > i; i++) {
            mom = create_utc__createUTC([ 2e3, i ]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp("^" + this.months(mom, "").replace(".", "") + "$", "i");
                this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(mom, "").replace(".", "") + "$", "i");
            }
            if (!strict && !this._monthsParse[i]) {
                regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
                this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
            }
            if (strict && "MMMM" === format && this._longMonthsParse[i].test(monthName)) return i;
            if (strict && "MMM" === format && this._shortMonthsParse[i].test(monthName)) return i;
            if (!strict && this._monthsParse[i].test(monthName)) return i;
        }
    }
    function setMonth(mom, value) {
        var dayOfMonth;
        if ("string" == typeof value) {
            value = mom.localeData().monthsParse(value);
            if ("number" != typeof value) return mom;
        }
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d["set" + (mom._isUTC ? "UTC" : "") + "Month"](value, dayOfMonth);
        return mom;
    }
    function getSetMonth(value) {
        if (null != value) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        }
        return get_set__get(this, "Month");
    }
    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }
    function checkOverflow(m) {
        var overflow;
        var a = m._a;
        if (a && -2 === m._pf.overflow) {
            overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || 24 === a[HOUR] && (0 !== a[MINUTE] || 0 !== a[SECOND] || 0 !== a[MILLISECOND]) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
            m._pf._overflowDayOfYear && (YEAR > overflow || overflow > DATE) && (overflow = DATE);
            m._pf.overflow = overflow;
        }
        return m;
    }
    function warn(msg) {
        false === utils_hooks__hooks.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + msg);
    }
    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function() {
            if (firstTime) {
                warn(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }
    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }
    function configFromISO(config) {
        var i, l, string = config._i, match = from_string__isoRegex.exec(string);
        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; l > i; i++) if (isoDates[i][1].exec(string)) {
                config._f = isoDates[i][0] + (match[6] || " ");
                break;
            }
            for (i = 0, l = isoTimes.length; l > i; i++) if (isoTimes[i][1].exec(string)) {
                config._f += isoTimes[i][0];
                break;
            }
            string.match(matchOffset) && (config._f += "Z");
            configFromStringAndFormat(config);
        } else config._isValid = false;
    }
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (null !== matched) {
            config._d = new Date(+matched[1]);
            return;
        }
        configFromISO(config);
        if (false === config._isValid) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }
    function createDate(y, m, d, h, M, s, ms) {
        var date = new Date(y, m, d, h, M, s, ms);
        1970 > y && date.setFullYear(y);
        return date;
    }
    function createUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        1970 > y && date.setUTCFullYear(y);
        return date;
    }
    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }
    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
    function getIsLeapYear() {
        return isLeapYear(this.year());
    }
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var adjustedMoment, end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();
        daysToDayOfWeek > end && (daysToDayOfWeek -= 7);
        end - 7 > daysToDayOfWeek && (daysToDayOfWeek += 7);
        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, "d");
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }
    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }
    function localeFirstDayOfWeek() {
        return this._week.dow;
    }
    function localeFirstDayOfYear() {
        return this._week.doy;
    }
    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return null == input ? week : this.add(7 * (input - week), "d");
    }
    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return null == input ? week : this.add(7 * (input - week), "d");
    }
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = createUTCDate(year, 0, 1).getUTCDay();
        var daysToAdd;
        var dayOfYear;
        d = 0 === d ? 7 : d;
        weekday = null != weekday ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (firstDayOfWeek > d ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;
        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }
    function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == input ? dayOfYear : this.add(input - dayOfYear, "d");
    }
    function defaults(a, b, c) {
        if (null != a) return a;
        if (null != b) return b;
        return c;
    }
    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) return [ now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() ];
        return [ now.getFullYear(), now.getMonth(), now.getDate() ];
    }
    function configFromArray(config) {
        var i, date, currentDate, yearToUse, input = [];
        if (config._d) return;
        currentDate = currentDateArray(config);
        config._w && null == config._a[DATE] && null == config._a[MONTH] && dayOfYearFromWeekInfo(config);
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
            config._dayOfYear > daysInYear(yearToUse) && (config._pf._overflowDayOfYear = true);
            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }
        for (i = 0; 3 > i && null == config._a[i]; ++i) config._a[i] = input[i] = currentDate[i];
        for (;7 > i; i++) config._a[i] = input[i] = null == config._a[i] ? 2 === i ? 1 : 0 : config._a[i];
        if (24 === config._a[HOUR] && 0 === config._a[MINUTE] && 0 === config._a[SECOND] && 0 === config._a[MILLISECOND]) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }
        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        null != config._tzm && config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        config._nextDay && (config._a[HOUR] = 24);
    }
    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;
        w = config._w;
        if (null != w.GG || null != w.W || null != w.E) {
            dow = 1;
            doy = 4;
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;
            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);
            if (null != w.d) {
                weekday = w.d;
                dow > weekday && ++week;
            } else weekday = null != w.e ? w.e + dow : dow;
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
    function configFromStringAndFormat(config) {
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        config._a = [];
        config._pf.empty = true;
        var i, parsedInput, tokens, token, skipped, string = "" + config._i, stringLength = string.length, totalParsedInputLength = 0;
        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                skipped.length > 0 && config._pf.unusedInput.push(skipped);
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            if (formatTokenFunctions[token]) {
                parsedInput ? config._pf.empty = false : config._pf.unusedTokens.push(token);
                addTimeToArrayFromToken(token, parsedInput, config);
            } else config._strict && !parsedInput && config._pf.unusedTokens.push(token);
        }
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        string.length > 0 && config._pf.unusedInput.push(string);
        true === config._pf.bigHour && config._a[HOUR] <= 12 && (config._pf.bigHour = void 0);
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
        configFromArray(config);
        checkOverflow(config);
    }
    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;
        if (null == meridiem) return hour;
        if (null != locale.meridiemHour) return locale.meridiemHour(hour, meridiem);
        if (null != locale.isPM) {
            isPm = locale.isPM(meridiem);
            isPm && 12 > hour && (hour += 12);
            isPm || 12 !== hour || (hour = 0);
            return hour;
        }
        return hour;
    }
    function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore;
        if (0 === config._f.length) {
            config._pf.invalidFormat = true;
            config._d = new Date(0/0);
            return;
        }
        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            null != config._useUTC && (tempConfig._useUTC = config._useUTC);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);
            if (!valid__isValid(tempConfig)) continue;
            currentScore += tempConfig._pf.charsLeftOver;
            currentScore += 10 * tempConfig._pf.unusedTokens.length;
            tempConfig._pf.score = currentScore;
            if (null == scoreToBeat || scoreToBeat > currentScore) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }
        extend(config, bestMoment || tempConfig);
    }
    function configFromObject(config) {
        if (config._d) return;
        var i = normalizeObjectUnits(config._i);
        config._a = [ i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond ];
        configFromArray(config);
    }
    function createFromConfig(config) {
        var res, input = config._i, format = config._f;
        config._locale = config._locale || locale_locales__getLocale(config._l);
        if (null === input || void 0 === format && "" === input) return valid__createInvalid({
            nullInput: true
        });
        "string" == typeof input && (config._i = input = config._locale.preparse(input));
        if (isMoment(input)) return new Moment(checkOverflow(input));
        isArray(format) ? configFromStringAndArray(config) : format ? configFromStringAndFormat(config) : configFromInput(config);
        res = new Moment(checkOverflow(config));
        if (res._nextDay) {
            res.add(1, "d");
            res._nextDay = void 0;
        }
        return res;
    }
    function configFromInput(config) {
        var input = config._i;
        if (void 0 === input) config._d = new Date(); else if (isDate(input)) config._d = new Date(+input); else if ("string" == typeof input) configFromString(config); else if (isArray(input)) {
            config._a = map(input.slice(0), function(obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else "object" == typeof input ? configFromObject(config) : "number" == typeof input ? config._d = new Date(input) : utils_hooks__hooks.createFromInputFallback(config);
    }
    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};
        if ("boolean" == typeof locale) {
            strict = locale;
            locale = void 0;
        }
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();
        return createFromConfig(c);
    }
    function local__createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }
    function pickBy(fn, moments) {
        var res, i;
        1 === moments.length && isArray(moments[0]) && (moments = moments[0]);
        if (!moments.length) return local__createLocal();
        res = moments[0];
        for (i = 1; i < moments.length; ++i) moments[i][fn](res) && (res = moments[i]);
        return res;
    }
    function min() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isBefore", args);
    }
    function max() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isAfter", args);
    }
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months = normalizedInput.month || 0, weeks = normalizedInput.week || 0, days = normalizedInput.day || 0, hours = normalizedInput.hour || 0, minutes = normalizedInput.minute || 0, seconds = normalizedInput.second || 0, milliseconds = normalizedInput.millisecond || 0;
        this._milliseconds = +milliseconds + 1e3 * seconds + 6e4 * minutes + 36e5 * hours;
        this._days = +days + 7 * weeks;
        this._months = +months + 3 * quarters + 12 * years;
        this._data = {};
        this._locale = locale_locales__getLocale();
        this._bubble();
    }
    function isDuration(obj) {
        return obj instanceof Duration;
    }
    function offset(token, separator) {
        addFormatToken(token, 0, 0, function() {
            var offset = this.utcOffset();
            var sign = "+";
            if (0 > offset) {
                offset = -offset;
                sign = "-";
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
        });
    }
    function offsetFromString(string) {
        var matches = (string || "").match(matchOffset) || [];
        var chunk = matches[matches.length - 1] || [];
        var parts = (chunk + "").match(chunkOffset) || [ "-", 0, 0 ];
        var minutes = +(60 * parts[1]) + toInt(parts[2]);
        return "+" === parts[0] ? minutes : -minutes;
    }
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - +res;
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        }
        return local__createLocal(input).local();
    }
    function getDateOffset(m) {
        return 15 * -Math.round(m._d.getTimezoneOffset() / 15);
    }
    function getSetOffset(input, keepLocalTime) {
        var localAdjust, offset = this._offset || 0;
        if (null != input) {
            "string" == typeof input && (input = offsetFromString(input));
            Math.abs(input) < 16 && (input = 60 * input);
            !this._isUTC && keepLocalTime && (localAdjust = getDateOffset(this));
            this._offset = input;
            this._isUTC = true;
            null != localAdjust && this.add(localAdjust, "m");
            if (offset !== input) if (!keepLocalTime || this._changeInProgress) add_subtract__addSubtract(this, create__createDuration(input - offset, "m"), 1, false); else if (!this._changeInProgress) {
                this._changeInProgress = true;
                utils_hooks__hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
            return this;
        }
        return this._isUTC ? offset : getDateOffset(this);
    }
    function getSetZone(input, keepLocalTime) {
        if (null != input) {
            "string" != typeof input && (input = -input);
            this.utcOffset(input, keepLocalTime);
            return this;
        }
        return -this.utcOffset();
    }
    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }
    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;
            keepLocalTime && this.subtract(getDateOffset(this), "m");
        }
        return this;
    }
    function setOffsetToParsedOffset() {
        this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(offsetFromString(this._i));
        return this;
    }
    function hasAlignedHourOffset(input) {
        input = input ? local__createLocal(input).utcOffset() : 0;
        return (this.utcOffset() - input) % 60 === 0;
    }
    function isDaylightSavingTime() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function isDaylightSavingTimeShifted() {
        if (this._a) {
            var other = this._isUTC ? create_utc__createUTC(this._a) : local__createLocal(this._a);
            return this.isValid() && compareArrays(this._a, other.toArray()) > 0;
        }
        return false;
    }
    function isLocal() {
        return !this._isUTC;
    }
    function isUtcOffset() {
        return this._isUTC;
    }
    function isUtc() {
        return this._isUTC && 0 === this._offset;
    }
    function create__createDuration(input, key) {
        var sign, ret, diffRes, duration = input, match = null;
        if (isDuration(input)) duration = {
            ms: input._milliseconds,
            d: input._days,
            M: input._months
        }; else if ("number" == typeof input) {
            duration = {};
            key ? duration[key] = input : duration.milliseconds = input;
        } else if (!(match = aspNetRegex.exec(input))) if (!(match = create__isoRegex.exec(input))) {
            if (null == duration) duration = {}; else if ("object" == typeof duration && ("from" in duration || "to" in duration)) {
                diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));
                duration = {};
                duration.ms = diffRes.milliseconds;
                duration.M = diffRes.months;
            }
        } else {
            sign = "-" === match[1] ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                d: parseIso(match[4], sign),
                h: parseIso(match[5], sign),
                m: parseIso(match[6], sign),
                s: parseIso(match[7], sign),
                w: parseIso(match[8], sign)
            };
        } else {
            sign = "-" === match[1] ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        }
        ret = new Duration(duration);
        isDuration(input) && hasOwnProp(input, "_locale") && (ret._locale = input._locale);
        return ret;
    }
    function parseIso(inp, sign) {
        var res = inp && parseFloat(inp.replace(",", "."));
        return (isNaN(res) ? 0 : res) * sign;
    }
    function positiveMomentsDifference(base, other) {
        var res = {
            milliseconds: 0,
            months: 0
        };
        res.months = other.month() - base.month() + 12 * (other.year() - base.year());
        base.clone().add(res.months, "M").isAfter(other) && --res.months;
        res.milliseconds = +other - +base.clone().add(res.months, "M");
        return res;
    }
    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) res = positiveMomentsDifference(base, other); else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }
        return res;
    }
    function createAdder(direction, name) {
        return function(val, period) {
            var dur, tmp;
            if (null !== period && !isNaN(+period)) {
                deprecateSimple(name, "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period).");
                tmp = val;
                val = period;
                period = tmp;
            }
            val = "string" == typeof val ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }
    function add_subtract__addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds, days = duration._days, months = duration._months;
        updateOffset = null == updateOffset ? true : updateOffset;
        milliseconds && mom._d.setTime(+mom._d + milliseconds * isAdding);
        days && get_set__set(mom, "Date", get_set__get(mom, "Date") + days * isAdding);
        months && setMonth(mom, get_set__get(mom, "Month") + months * isAdding);
        updateOffset && utils_hooks__hooks.updateOffset(mom, days || months);
    }
    function moment_calendar__calendar(time) {
        var now = time || local__createLocal(), sod = cloneWithOffset(now, this).startOf("day"), diff = this.diff(sod, "days", true), format = -6 > diff ? "sameElse" : -1 > diff ? "lastWeek" : 0 > diff ? "lastDay" : 1 > diff ? "sameDay" : 2 > diff ? "nextDay" : 7 > diff ? "nextWeek" : "sameElse";
        return this.format(this.localeData().calendar(format, this, local__createLocal(now)));
    }
    function clone() {
        return new Moment(this);
    }
    function isAfter(input, units) {
        var inputMs;
        units = normalizeUnits("undefined" != typeof units ? units : "millisecond");
        if ("millisecond" === units) {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        }
        inputMs = isMoment(input) ? +input : +local__createLocal(input);
        return inputMs < +this.clone().startOf(units);
    }
    function isBefore(input, units) {
        var inputMs;
        units = normalizeUnits("undefined" != typeof units ? units : "millisecond");
        if ("millisecond" === units) {
            input = isMoment(input) ? input : local__createLocal(input);
            return +input > +this;
        }
        inputMs = isMoment(input) ? +input : +local__createLocal(input);
        return +this.clone().endOf(units) < inputMs;
    }
    function isBetween(from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }
    function isSame(input, units) {
        var inputMs;
        units = normalizeUnits(units || "millisecond");
        if ("millisecond" === units) {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        }
        inputMs = +local__createLocal(input);
        return +this.clone().startOf(units) <= inputMs && inputMs <= +this.clone().endOf(units);
    }
    function absFloor(number) {
        return 0 > number ? Math.ceil(number) : Math.floor(number);
    }
    function diff(input, units, asFloat) {
        var delta, output, that = cloneWithOffset(input, this), zoneDelta = 6e4 * (that.utcOffset() - this.utcOffset());
        units = normalizeUnits(units);
        if ("year" === units || "month" === units || "quarter" === units) {
            output = monthDiff(this, that);
            "quarter" === units ? output /= 3 : "year" === units && (output /= 12);
        } else {
            delta = this - that;
            output = "second" === units ? delta / 1e3 : "minute" === units ? delta / 6e4 : "hour" === units ? delta / 36e5 : "day" === units ? (delta - zoneDelta) / 864e5 : "week" === units ? (delta - zoneDelta) / 6048e5 : delta;
        }
        return asFloat ? output : absFloor(output);
    }
    function monthDiff(a, b) {
        var anchor2, adjust, wholeMonthDiff = 12 * (b.year() - a.year()) + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months");
        if (0 > b - anchor) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
            adjust = (b - anchor) / (anchor2 - anchor);
        }
        return -(wholeMonthDiff + adjust);
    }
    function toString() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function moment_format__toISOString() {
        var m = this.clone().utc();
        return 0 < m.year() && m.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : formatMoment(m, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : formatMoment(m, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
    }
    function format(inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }
    function from(time, withoutSuffix) {
        return create__createDuration({
            to: this,
            from: time
        }).locale(this.locale()).humanize(!withoutSuffix);
    }
    function fromNow(withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }
    function locale(key) {
        var newLocaleData;
        if (void 0 === key) return this._locale._abbr;
        newLocaleData = locale_locales__getLocale(key);
        null != newLocaleData && (this._locale = newLocaleData);
        return this;
    }
    function localeData() {
        return this._locale;
    }
    function startOf(units) {
        units = normalizeUnits(units);
        switch (units) {
          case "year":
            this.month(0);

          case "quarter":
          case "month":
            this.date(1);

          case "week":
          case "isoWeek":
          case "day":
            this.hours(0);

          case "hour":
            this.minutes(0);

          case "minute":
            this.seconds(0);

          case "second":
            this.milliseconds(0);
        }
        "week" === units && this.weekday(0);
        "isoWeek" === units && this.isoWeekday(1);
        "quarter" === units && this.month(3 * Math.floor(this.month() / 3));
        return this;
    }
    function endOf(units) {
        units = normalizeUnits(units);
        if (void 0 === units || "millisecond" === units) return this;
        return this.startOf(units).add(1, "isoWeek" === units ? "week" : units).subtract(1, "ms");
    }
    function to_type__valueOf() {
        return +this._d - 6e4 * (this._offset || 0);
    }
    function unix() {
        return Math.floor(+this / 1e3);
    }
    function toDate() {
        return this._offset ? new Date(+this) : this._d;
    }
    function toArray() {
        var m = this;
        return [ m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond() ];
    }
    function moment_valid__isValid() {
        return valid__isValid(this);
    }
    function parsingFlags() {
        return extend({}, this._pf);
    }
    function invalidAt() {
        return this._pf.overflow;
    }
    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [ token, token.length ], 0, getter);
    }
    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([ year, 11, 31 + dow - doy ]), dow, doy).week;
    }
    function getSetWeekYear(input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return null == input ? year : this.add(input - year, "y");
    }
    function getSetISOWeekYear(input) {
        var year = weekOfYear(this, 1, 4).year;
        return null == input ? year : this.add(input - year, "y");
    }
    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }
    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }
    function getSetQuarter(input) {
        return null == input ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (input - 1) + this.month() % 3);
    }
    function parseWeekday(input, locale) {
        if ("string" == typeof input) if (isNaN(input)) {
            input = locale.weekdaysParse(input);
            if ("number" != typeof input) return null;
        } else input = parseInt(input, 10);
        return input;
    }
    function localeWeekdays(m) {
        return this._weekdays[m.day()];
    }
    function localeWeekdaysShort(m) {
        return this._weekdaysShort[m.day()];
    }
    function localeWeekdaysMin(m) {
        return this._weekdaysMin[m.day()];
    }
    function localeWeekdaysParse(weekdayName) {
        var i, mom, regex;
        this._weekdaysParse || (this._weekdaysParse = []);
        for (i = 0; 7 > i; i++) {
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([ 2e3, 1 ]).day(i);
                regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
                this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
            }
            if (this._weekdaysParse[i].test(weekdayName)) return i;
        }
    }
    function getSetDayOfWeek(input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (null != input) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, "d");
        }
        return day;
    }
    function getSetLocaleDayOfWeek(input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == input ? weekday : this.add(input - weekday, "d");
    }
    function getSetISODayOfWeek(input) {
        return null == input ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }
    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }
    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }
    function localeIsPM(input) {
        return "p" === (input + "").toLowerCase().charAt(0);
    }
    function localeMeridiem(hours, minutes, isLower) {
        return hours > 11 ? isLower ? "pm" : "PM" : isLower ? "am" : "AM";
    }
    function millisecond__milliseconds(token) {
        addFormatToken(0, [ token, 3 ], 0, "millisecond");
    }
    function getZoneAbbr() {
        return this._isUTC ? "UTC" : "";
    }
    function getZoneName() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }
    function moment__createUnix(input) {
        return local__createLocal(1e3 * input);
    }
    function moment__createInZone() {
        return local__createLocal.apply(null, arguments).parseZone();
    }
    function locale_calendar__calendar(key, mom, now) {
        var output = this._calendar[key];
        return "function" == typeof output ? output.call(mom, now) : output;
    }
    function longDateFormat(key) {
        var output = this._longDateFormat[key];
        if (!output && this._longDateFormat[key.toUpperCase()]) {
            output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(val) {
                return val.slice(1);
            });
            this._longDateFormat[key] = output;
        }
        return output;
    }
    function invalidDate() {
        return this._invalidDate;
    }
    function ordinal(number) {
        return this._ordinal.replace("%d", number);
    }
    function preParsePostFormat(string) {
        return string;
    }
    function relative__relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return "function" == typeof output ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }
    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? "future" : "past"];
        return "function" == typeof format ? format(output) : format.replace(/%s/i, output);
    }
    function locale_set__set(config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            "function" == typeof prop ? this[i] = prop : this["_" + i] = prop;
        }
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source);
    }
    function lists__get(format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }
    function list(format, index, field, count, setter) {
        if ("number" == typeof format) {
            index = format;
            format = void 0;
        }
        format = format || "";
        if (null != index) return lists__get(format, index, field, setter);
        var i;
        var out = [];
        for (i = 0; count > i; i++) out[i] = lists__get(format, i, field, setter);
        return out;
    }
    function lists__listMonths(format, index) {
        return list(format, index, "months", 12, "month");
    }
    function lists__listMonthsShort(format, index) {
        return list(format, index, "monthsShort", 12, "month");
    }
    function lists__listWeekdays(format, index) {
        return list(format, index, "weekdays", 7, "day");
    }
    function lists__listWeekdaysShort(format, index) {
        return list(format, index, "weekdaysShort", 7, "day");
    }
    function lists__listWeekdaysMin(format, index) {
        return list(format, index, "weekdaysMin", 7, "day");
    }
    function duration_abs__abs() {
        var data = this._data;
        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);
        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);
        return this;
    }
    function duration_add_subtract__addSubtract(duration, input, value, direction) {
        var other = create__createDuration(input, value);
        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;
        return duration._bubble();
    }
    function duration_add_subtract__add(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }
    function duration_add_subtract__subtract(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }
    function bubble() {
        var milliseconds = this._milliseconds;
        var days = this._days;
        var months = this._months;
        var data = this._data;
        var seconds, minutes, hours, years = 0;
        data.milliseconds = milliseconds % 1e3;
        seconds = absFloor(milliseconds / 1e3);
        data.seconds = seconds % 60;
        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;
        hours = absFloor(minutes / 60);
        data.hours = hours % 24;
        days += absFloor(hours / 24);
        years = absFloor(daysToYears(days));
        days -= absFloor(yearsToDays(years));
        months += absFloor(days / 30);
        days %= 30;
        years += absFloor(months / 12);
        months %= 12;
        data.days = days;
        data.months = months;
        data.years = years;
        return this;
    }
    function daysToYears(days) {
        return 400 * days / 146097;
    }
    function yearsToDays(years) {
        return 146097 * years / 400;
    }
    function as(units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;
        units = normalizeUnits(units);
        if ("month" === units || "year" === units) {
            days = this._days + milliseconds / 864e5;
            months = this._months + 12 * daysToYears(days);
            return "month" === units ? months : months / 12;
        }
        days = this._days + Math.round(yearsToDays(this._months / 12));
        switch (units) {
          case "week":
            return days / 7 + milliseconds / 6048e5;

          case "day":
            return days + milliseconds / 864e5;

          case "hour":
            return 24 * days + milliseconds / 36e5;

          case "minute":
            return 24 * days * 60 + milliseconds / 6e4;

          case "second":
            return 24 * days * 60 * 60 + milliseconds / 1e3;

          case "millisecond":
            return Math.floor(24 * days * 60 * 60 * 1e3) + milliseconds;

          default:
            throw new Error("Unknown unit " + units);
        }
    }
    function duration_as__valueOf() {
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * toInt(this._months / 12);
    }
    function makeAs(alias) {
        return function() {
            return this.as(alias);
        };
    }
    function duration_get__get(units) {
        units = normalizeUnits(units);
        return this[units + "s"]();
    }
    function makeGetter(name) {
        return function() {
            return this._data[name];
        };
    }
    function weeks() {
        return absFloor(this.days() / 7);
    }
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }
    function duration_humanize__relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds = round(duration.as("s"));
        var minutes = round(duration.as("m"));
        var hours = round(duration.as("h"));
        var days = round(duration.as("d"));
        var months = round(duration.as("M"));
        var years = round(duration.as("y"));
        var a = seconds < thresholds.s && [ "s", seconds ] || 1 === minutes && [ "m" ] || minutes < thresholds.m && [ "mm", minutes ] || 1 === hours && [ "h" ] || hours < thresholds.h && [ "hh", hours ] || 1 === days && [ "d" ] || days < thresholds.d && [ "dd", days ] || 1 === months && [ "M" ] || months < thresholds.M && [ "MM", months ] || 1 === years && [ "y" ] || [ "yy", years ];
        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }
    function duration_humanize__getSetRelativeTimeThreshold(threshold, limit) {
        if (void 0 === thresholds[threshold]) return false;
        if (void 0 === limit) return thresholds[threshold];
        thresholds[threshold] = limit;
        return true;
    }
    function humanize(withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);
        withSuffix && (output = locale.pastFuture(+this, output));
        return locale.postformat(output);
    }
    function iso_string__toISOString() {
        var Y = iso_string__abs(this.years());
        var M = iso_string__abs(this.months());
        var D = iso_string__abs(this.days());
        var h = iso_string__abs(this.hours());
        var m = iso_string__abs(this.minutes());
        var s = iso_string__abs(this.seconds() + this.milliseconds() / 1e3);
        var total = this.asSeconds();
        if (!total) return "P0D";
        return (0 > total ? "-" : "") + "P" + (Y ? Y + "Y" : "") + (M ? M + "M" : "") + (D ? D + "D" : "") + (h || m || s ? "T" : "") + (h ? h + "H" : "") + (m ? m + "M" : "") + (s ? s + "S" : "");
    }
    var hookCallback;
    var momentProperties = utils_hooks__hooks.momentProperties = [];
    var updateInProgress = false;
    var locales = {};
    var globalLocale;
    var aliases = {};
    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;
    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
    var formatFunctions = {};
    var formatTokenFunctions = {};
    var match1 = /\d/;
    var match2 = /\d\d/;
    var match3 = /\d{3}/;
    var match4 = /\d{4}/;
    var match6 = /[+-]?\d{6}/;
    var match1to2 = /\d\d?/;
    var match1to3 = /\d{1,3}/;
    var match1to4 = /\d{1,4}/;
    var match1to6 = /[+-]?\d{1,6}/;
    var matchUnsigned = /\d+/;
    var matchSigned = /[+-]?\d+/;
    var matchOffset = /Z|[+-]\d\d:?\d\d/gi;
    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/;
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
    var regexes = {};
    var tokens = {};
    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    addFormatToken("M", [ "MM", 2 ], "Mo", function() {
        return this.month() + 1;
    });
    addFormatToken("MMM", 0, 0, function(format) {
        return this.localeData().monthsShort(this, format);
    });
    addFormatToken("MMMM", 0, 0, function(format) {
        return this.localeData().months(this, format);
    });
    addUnitAlias("month", "M");
    addRegexToken("M", match1to2);
    addRegexToken("MM", match1to2, match2);
    addRegexToken("MMM", matchWord);
    addRegexToken("MMMM", matchWord);
    addParseToken([ "M", "MM" ], function(input, array) {
        array[MONTH] = toInt(input) - 1;
    });
    addParseToken([ "MMM", "MMMM" ], function(input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        null != month ? array[MONTH] = month : config._pf.invalidMonth = input;
    });
    var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split("_");
    var defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
    var deprecations = {};
    utils_hooks__hooks.suppressDeprecationWarnings = false;
    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var isoDates = [ [ "YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/ ], [ "YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/ ], [ "GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/ ], [ "GGGG-[W]WW", /\d{4}-W\d{2}/ ], [ "YYYY-DDD", /\d{4}-\d{3}/ ] ];
    var isoTimes = [ [ "HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/ ], [ "HH:mm:ss", /(T| )\d\d:\d\d:\d\d/ ], [ "HH:mm", /(T| )\d\d:\d\d/ ], [ "HH", /(T| )\d\d/ ] ];
    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;
    utils_hooks__hooks.createFromInputFallback = deprecate("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(config) {
        config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
    });
    addFormatToken(0, [ "YY", 2 ], 0, function() {
        return this.year() % 100;
    });
    addFormatToken(0, [ "YYYY", 4 ], 0, "year");
    addFormatToken(0, [ "YYYYY", 5 ], 0, "year");
    addFormatToken(0, [ "YYYYYY", 6, true ], 0, "year");
    addUnitAlias("year", "y");
    addRegexToken("Y", matchSigned);
    addRegexToken("YY", match1to2, match2);
    addRegexToken("YYYY", match1to4, match4);
    addRegexToken("YYYYY", match1to6, match6);
    addRegexToken("YYYYYY", match1to6, match6);
    addParseToken([ "YYYY", "YYYYY", "YYYYYY" ], YEAR);
    addParseToken("YY", function(input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    utils_hooks__hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
    };
    var getSetYear = makeGetSet("FullYear", false);
    addFormatToken("w", [ "ww", 2 ], "wo", "week");
    addFormatToken("W", [ "WW", 2 ], "Wo", "isoWeek");
    addUnitAlias("week", "w");
    addUnitAlias("isoWeek", "W");
    addRegexToken("w", match1to2);
    addRegexToken("ww", match1to2, match2);
    addRegexToken("W", match1to2);
    addRegexToken("WW", match1to2, match2);
    addWeekParseToken([ "w", "ww", "W", "WW" ], function(input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });
    var defaultLocaleWeek = {
        dow: 0,
        doy: 6
    };
    addFormatToken("DDD", [ "DDDD", 3 ], "DDDo", "dayOfYear");
    addUnitAlias("dayOfYear", "DDD");
    addRegexToken("DDD", match1to3);
    addRegexToken("DDDD", match3);
    addParseToken([ "DDD", "DDDD" ], function(input, array, config) {
        config._dayOfYear = toInt(input);
    });
    utils_hooks__hooks.ISO_8601 = function() {};
    var prototypeMin = deprecate("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function() {
        var other = local__createLocal.apply(null, arguments);
        return this > other ? this : other;
    });
    var prototypeMax = deprecate("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function() {
        var other = local__createLocal.apply(null, arguments);
        return other > this ? this : other;
    });
    offset("Z", ":");
    offset("ZZ", "");
    addRegexToken("Z", matchOffset);
    addRegexToken("ZZ", matchOffset);
    addParseToken([ "Z", "ZZ" ], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });
    var chunkOffset = /([\+\-]|\d\d)/gi;
    utils_hooks__hooks.updateOffset = function() {};
    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
    create__createDuration.fn = Duration.prototype;
    var add_subtract__add = createAdder(1, "add");
    var add_subtract__subtract = createAdder(-1, "subtract");
    utils_hooks__hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    var lang = deprecate("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(key) {
        return void 0 === key ? this.localeData() : this.locale(key);
    });
    addFormatToken(0, [ "gg", 2 ], 0, function() {
        return this.weekYear() % 100;
    });
    addFormatToken(0, [ "GG", 2 ], 0, function() {
        return this.isoWeekYear() % 100;
    });
    addWeekYearFormatToken("gggg", "weekYear");
    addWeekYearFormatToken("ggggg", "weekYear");
    addWeekYearFormatToken("GGGG", "isoWeekYear");
    addWeekYearFormatToken("GGGGG", "isoWeekYear");
    addUnitAlias("weekYear", "gg");
    addUnitAlias("isoWeekYear", "GG");
    addRegexToken("G", matchSigned);
    addRegexToken("g", matchSigned);
    addRegexToken("GG", match1to2, match2);
    addRegexToken("gg", match1to2, match2);
    addRegexToken("GGGG", match1to4, match4);
    addRegexToken("gggg", match1to4, match4);
    addRegexToken("GGGGG", match1to6, match6);
    addRegexToken("ggggg", match1to6, match6);
    addWeekParseToken([ "gggg", "ggggg", "GGGG", "GGGGG" ], function(input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });
    addWeekParseToken([ "gg", "GG" ], function(input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addFormatToken("Q", 0, 0, "quarter");
    addUnitAlias("quarter", "Q");
    addRegexToken("Q", match1);
    addParseToken("Q", function(input, array) {
        array[MONTH] = 3 * (toInt(input) - 1);
    });
    addFormatToken("D", [ "DD", 2 ], "Do", "date");
    addUnitAlias("date", "D");
    addRegexToken("D", match1to2);
    addRegexToken("DD", match1to2, match2);
    addRegexToken("Do", function(isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });
    addParseToken([ "D", "DD" ], DATE);
    addParseToken("Do", function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });
    var getSetDayOfMonth = makeGetSet("Date", true);
    addFormatToken("d", 0, "do", "day");
    addFormatToken("dd", 0, 0, function(format) {
        return this.localeData().weekdaysMin(this, format);
    });
    addFormatToken("ddd", 0, 0, function(format) {
        return this.localeData().weekdaysShort(this, format);
    });
    addFormatToken("dddd", 0, 0, function(format) {
        return this.localeData().weekdays(this, format);
    });
    addFormatToken("e", 0, 0, "weekday");
    addFormatToken("E", 0, 0, "isoWeekday");
    addUnitAlias("day", "d");
    addUnitAlias("weekday", "e");
    addUnitAlias("isoWeekday", "E");
    addRegexToken("d", match1to2);
    addRegexToken("e", match1to2);
    addRegexToken("E", match1to2);
    addRegexToken("dd", matchWord);
    addRegexToken("ddd", matchWord);
    addRegexToken("dddd", matchWord);
    addWeekParseToken([ "dd", "ddd", "dddd" ], function(input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        null != weekday ? week.d = weekday : config._pf.invalidWeekday = input;
    });
    addWeekParseToken([ "d", "e", "E" ], function(input, week, config, token) {
        week[token] = toInt(input);
    });
    var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");
    var defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");
    var defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
    addFormatToken("H", [ "HH", 2 ], 0, "hour");
    addFormatToken("h", [ "hh", 2 ], 0, function() {
        return this.hours() % 12 || 12;
    });
    meridiem("a", true);
    meridiem("A", false);
    addUnitAlias("hour", "h");
    addRegexToken("a", matchMeridiem);
    addRegexToken("A", matchMeridiem);
    addRegexToken("H", match1to2);
    addRegexToken("h", match1to2);
    addRegexToken("HH", match1to2, match2);
    addRegexToken("hh", match1to2, match2);
    addParseToken([ "H", "HH" ], HOUR);
    addParseToken([ "a", "A" ], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken([ "h", "hh" ], function(input, array, config) {
        array[HOUR] = toInt(input);
        config._pf.bigHour = true;
    });
    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    var getSetHour = makeGetSet("Hours", true);
    addFormatToken("m", [ "mm", 2 ], 0, "minute");
    addUnitAlias("minute", "m");
    addRegexToken("m", match1to2);
    addRegexToken("mm", match1to2, match2);
    addParseToken([ "m", "mm" ], MINUTE);
    var getSetMinute = makeGetSet("Minutes", false);
    addFormatToken("s", [ "ss", 2 ], 0, "second");
    addUnitAlias("second", "s");
    addRegexToken("s", match1to2);
    addRegexToken("ss", match1to2, match2);
    addParseToken([ "s", "ss" ], SECOND);
    var getSetSecond = makeGetSet("Seconds", false);
    addFormatToken("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });
    addFormatToken(0, [ "SS", 2 ], 0, function() {
        return ~~(this.millisecond() / 10);
    });
    millisecond__milliseconds("SSS");
    millisecond__milliseconds("SSSS");
    addUnitAlias("millisecond", "ms");
    addRegexToken("S", match1to3, match1);
    addRegexToken("SS", match1to3, match2);
    addRegexToken("SSS", match1to3, match3);
    addRegexToken("SSSS", matchUnsigned);
    addParseToken([ "S", "SS", "SSS", "SSSS" ], function(input, array) {
        array[MILLISECOND] = toInt(1e3 * ("0." + input));
    });
    var getSetMillisecond = makeGetSet("Milliseconds", false);
    addFormatToken("z", 0, 0, "zoneAbbr");
    addFormatToken("zz", 0, 0, "zoneName");
    var momentPrototype__proto = Moment.prototype;
    momentPrototype__proto.add = add_subtract__add;
    momentPrototype__proto.calendar = moment_calendar__calendar;
    momentPrototype__proto.clone = clone;
    momentPrototype__proto.diff = diff;
    momentPrototype__proto.endOf = endOf;
    momentPrototype__proto.format = format;
    momentPrototype__proto.from = from;
    momentPrototype__proto.fromNow = fromNow;
    momentPrototype__proto.get = getSet;
    momentPrototype__proto.invalidAt = invalidAt;
    momentPrototype__proto.isAfter = isAfter;
    momentPrototype__proto.isBefore = isBefore;
    momentPrototype__proto.isBetween = isBetween;
    momentPrototype__proto.isSame = isSame;
    momentPrototype__proto.isValid = moment_valid__isValid;
    momentPrototype__proto.lang = lang;
    momentPrototype__proto.locale = locale;
    momentPrototype__proto.localeData = localeData;
    momentPrototype__proto.max = prototypeMax;
    momentPrototype__proto.min = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set = getSet;
    momentPrototype__proto.startOf = startOf;
    momentPrototype__proto.subtract = add_subtract__subtract;
    momentPrototype__proto.toArray = toArray;
    momentPrototype__proto.toDate = toDate;
    momentPrototype__proto.toISOString = moment_format__toISOString;
    momentPrototype__proto.toJSON = moment_format__toISOString;
    momentPrototype__proto.toString = toString;
    momentPrototype__proto.unix = unix;
    momentPrototype__proto.valueOf = to_type__valueOf;
    momentPrototype__proto.year = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;
    momentPrototype__proto.weekYear = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;
    momentPrototype__proto.month = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;
    momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
    momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
    momentPrototype__proto.weeksInYear = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;
    momentPrototype__proto.date = getSetDayOfMonth;
    momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
    momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear = getSetDayOfYear;
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;
    momentPrototype__proto.utcOffset = getSetOffset;
    momentPrototype__proto.utc = setOffsetToUTC;
    momentPrototype__proto.local = setOffsetToLocal;
    momentPrototype__proto.parseZone = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal = isLocal;
    momentPrototype__proto.isUtcOffset = isUtcOffset;
    momentPrototype__proto.isUtc = isUtc;
    momentPrototype__proto.isUTC = isUtc;
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;
    momentPrototype__proto.dates = deprecate("dates accessor is deprecated. Use date instead.", getSetDayOfMonth);
    momentPrototype__proto.months = deprecate("months accessor is deprecated. Use month instead", getSetMonth);
    momentPrototype__proto.years = deprecate("years accessor is deprecated. Use year instead", getSetYear);
    momentPrototype__proto.zone = deprecate("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", getSetZone);
    var momentPrototype = momentPrototype__proto;
    var defaultCalendar = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
    };
    var defaultLongDateFormat = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY LT",
        LLLL: "dddd, MMMM D, YYYY LT"
    };
    var defaultInvalidDate = "Invalid date";
    var defaultOrdinal = "%d";
    var defaultOrdinalParse = /\d{1,2}/;
    var defaultRelativeTime = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    };
    var prototype__proto = Locale.prototype;
    prototype__proto._calendar = defaultCalendar;
    prototype__proto.calendar = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat = longDateFormat;
    prototype__proto._invalidDate = defaultInvalidDate;
    prototype__proto.invalidDate = invalidDate;
    prototype__proto._ordinal = defaultOrdinal;
    prototype__proto.ordinal = ordinal;
    prototype__proto._ordinalParse = defaultOrdinalParse;
    prototype__proto.preparse = preParsePostFormat;
    prototype__proto.postformat = preParsePostFormat;
    prototype__proto._relativeTime = defaultRelativeTime;
    prototype__proto.relativeTime = relative__relativeTime;
    prototype__proto.pastFuture = pastFuture;
    prototype__proto.set = locale_set__set;
    prototype__proto.months = localeMonths;
    prototype__proto._months = defaultLocaleMonths;
    prototype__proto.monthsShort = localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse = localeMonthsParse;
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;
    prototype__proto.weekdays = localeWeekdays;
    prototype__proto._weekdays = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin = localeWeekdaysMin;
    prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort = localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse = localeWeekdaysParse;
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;
    locale_locales__getSetGlobalLocale("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
            var b = number % 10, output = 1 === toInt(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return number + output;
        }
    });
    utils_hooks__hooks.lang = deprecate("moment.lang is deprecated. Use moment.locale instead.", locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate("moment.langData is deprecated. Use moment.localeData instead.", locale_locales__getLocale);
    var mathAbs = Math.abs;
    var asMilliseconds = makeAs("ms");
    var asSeconds = makeAs("s");
    var asMinutes = makeAs("m");
    var asHours = makeAs("h");
    var asDays = makeAs("d");
    var asWeeks = makeAs("w");
    var asMonths = makeAs("M");
    var asYears = makeAs("y");
    var duration_get__milliseconds = makeGetter("milliseconds");
    var seconds = makeGetter("seconds");
    var minutes = makeGetter("minutes");
    var hours = makeGetter("hours");
    var days = makeGetter("days");
    var months = makeGetter("months");
    var years = makeGetter("years");
    var round = Math.round;
    var thresholds = {
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    };
    var iso_string__abs = Math.abs;
    var duration_prototype__proto = Duration.prototype;
    duration_prototype__proto.abs = duration_abs__abs;
    duration_prototype__proto.add = duration_add_subtract__add;
    duration_prototype__proto.subtract = duration_add_subtract__subtract;
    duration_prototype__proto.as = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds = asSeconds;
    duration_prototype__proto.asMinutes = asMinutes;
    duration_prototype__proto.asHours = asHours;
    duration_prototype__proto.asDays = asDays;
    duration_prototype__proto.asWeeks = asWeeks;
    duration_prototype__proto.asMonths = asMonths;
    duration_prototype__proto.asYears = asYears;
    duration_prototype__proto.valueOf = duration_as__valueOf;
    duration_prototype__proto._bubble = bubble;
    duration_prototype__proto.get = duration_get__get;
    duration_prototype__proto.milliseconds = duration_get__milliseconds;
    duration_prototype__proto.seconds = seconds;
    duration_prototype__proto.minutes = minutes;
    duration_prototype__proto.hours = hours;
    duration_prototype__proto.days = days;
    duration_prototype__proto.weeks = weeks;
    duration_prototype__proto.months = months;
    duration_prototype__proto.years = years;
    duration_prototype__proto.humanize = humanize;
    duration_prototype__proto.toISOString = iso_string__toISOString;
    duration_prototype__proto.toString = iso_string__toISOString;
    duration_prototype__proto.toJSON = iso_string__toISOString;
    duration_prototype__proto.locale = locale;
    duration_prototype__proto.localeData = localeData;
    duration_prototype__proto.toIsoString = deprecate("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", iso_string__toISOString);
    duration_prototype__proto.lang = lang;
    addFormatToken("X", 0, 0, "unix");
    addFormatToken("x", 0, 0, "valueOf");
    addRegexToken("x", matchSigned);
    addRegexToken("X", matchTimestamp);
    addParseToken("X", function(input, array, config) {
        config._d = new Date(1e3 * parseFloat(input, 10));
    });
    addParseToken("x", function(input, array, config) {
        config._d = new Date(toInt(input));
    });
    utils_hooks__hooks.version = "2.10.2";
    setHookCallback(local__createLocal);
    utils_hooks__hooks.fn = momentPrototype;
    utils_hooks__hooks.min = min;
    utils_hooks__hooks.max = max;
    utils_hooks__hooks.utc = create_utc__createUTC;
    utils_hooks__hooks.unix = moment__createUnix;
    utils_hooks__hooks.months = lists__listMonths;
    utils_hooks__hooks.isDate = isDate;
    utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid = valid__createInvalid;
    utils_hooks__hooks.duration = create__createDuration;
    utils_hooks__hooks.isMoment = isMoment;
    utils_hooks__hooks.weekdays = lists__listWeekdays;
    utils_hooks__hooks.parseZone = moment__createInZone;
    utils_hooks__hooks.localeData = locale_locales__getLocale;
    utils_hooks__hooks.isDuration = isDuration;
    utils_hooks__hooks.monthsShort = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale = defineLocale;
    utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    var _moment = utils_hooks__hooks;
    return _moment;
});