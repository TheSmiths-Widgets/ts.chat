function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ts.messageBuilderFactory/" + s : s.substring(0, index) + "/ts.messageBuilderFactory/" + s.substring(index + 1);
    return path;
}

module.exports = [];