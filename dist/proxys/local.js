"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs-extra");
var crypto = require("crypto");
var lodash_1 = require("lodash");
var LocalProxy = (function () {
    function LocalProxy() {
    }
    LocalProxy.prototype.upload = function (file, options, done) {
        var filename = options.filename, original_name = options.original_name, root_dir = options.root_dir;
        var fileMatch = filename.match(/(.*\/)*([^.]+.*)/) || [];
        var _a = lodash_1.zipObject(['file_path', 'sub_dir', 'file_name'], fileMatch), sub_dir = _a.sub_dir, file_name = _a.file_name;
        var rootDir = root_dir || path.resolve(process.cwd(), 'uploadfile');
        rootDir = path.resolve(rootDir, sub_dir || '');
        var extname = path.extname(file_name);
        var newFilename = original_name
            ? file_name
            : crypto.createHash('md5').update(new Date().getTime().toString()).digest('hex') + extname;
        var filePath = path.resolve(rootDir, newFilename);
        !fs.existsSync(rootDir) && fs.mkdirpSync(rootDir);
        file.on('end', function () { return done(null, {
            key: sub_dir + newFilename,
            path: filePath,
            url: newFilename + ("?sub_dir=" + sub_dir.replace(/(\/)$/, ''))
        }); });
        file.pipe(fs.createWriteStream(filePath));
    };
    return LocalProxy;
}());
exports.default = new LocalProxy();
