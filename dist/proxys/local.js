"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var crypto = require("crypto");
var fs = require("fs-extra");
var lodash_1 = require("lodash");
var Proxy = (function () {
    function Proxy() {
    }
    Proxy.prototype.upload = function (file, options, done) {
        var filename = options.filename, original_name = options.original_name, root_dir = options.root_dir;
        var fileMatch = filename.match(/(.*\/)*([^.]+.*)/) || [];
        var _a = lodash_1.zipObject(['file_path', 'sub_dir', 'file_name'], fileMatch), sub_dir = _a.sub_dir, file_name = _a.file_name;
        var rootDir = path.resolve(process.cwd(), root_dir || 'uploadfile', sub_dir || '');
        var extname = path.extname(filename);
        var newFileName = original_name
            ? file_name
            : crypto.createHash('md5').update(Date.now().toString()).digest('hex') + extname;
        !fs.existsSync(rootDir) && fs.mkdirpSync(rootDir);
        var filePath = path.resolve(rootDir, newFileName);
        file.on('end', function () {
            return done(null, {
                key: (sub_dir || '') + newFileName,
                path: filePath,
                url: newFileName + (sub_dir ? "?sub_dir=" + sub_dir.replace(/(\/)$/, '') : '')
            });
        });
        file.pipe(fs.createWriteStream(filePath));
    };
    return Proxy;
}());
exports.default = Proxy;
