"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connect = exports.Store = void 0;
var busboy = require("busboy");
var bytes = require("bytes");
var Store = (function () {
    function Store(setting) {
        this.__Request = setting.request;
        this.__Options = setting.options || {
            type: 'local',
            max_size: '4MB',
            root_dir: 'uploadfiles'
        };
    }
    Store.prototype.asyncSave = function (errInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.__save(function (err, doc) {
                if (err) {
                    reject(errInfo(err, doc));
                }
                else {
                    var _a = _this.__Options, root_url_1 = _a.root_url, type = _a.type;
                    if (root_url_1 && type === 'local') {
                        var data = doc;
                        data = data.map(function (item) { return (__assign(__assign({}, item), { url: root_url_1 + "/" + item.url })); });
                        resolve(data);
                    }
                    else {
                        resolve(doc);
                    }
                }
            });
        });
    };
    Store.prototype.__save = function (done) {
        var _this = this;
        var _a = this.__Request, headers = _a.headers, query = _a.query;
        var Busboy = new busboy({
            headers: headers,
            limits: {
                fileSize: bytes(this.__Options.max_size)
            }
        });
        var dir = query.dir;
        var _filename = query.filename;
        var sub_dir = '';
        if (dir && this.__Options.type === 'local') {
            sub_dir = dir.replace(/^(\/)|(\/)$/g, '') + '/';
        }
        var files = [];
        var _errors = this.__Errors || { mimetype: 1, limit: 2 };
        var _proxys = this.__Proxys || {};
        Busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var _a = _this.__Options, mime_type = _a.mime_type, max_size = _a.max_size, type = _a.type, root_dir = _a.root_dir, original_name = _a.original_name;
            if (mime_type && mime_type.indexOf(mimetype) === -1) {
                return done(_errors.mimetype, [mimetype]);
            }
            var fileSize = 0;
            file.on('data', function (data) {
                fileSize += data.length;
            });
            file.on('limit', function () {
                return done(_errors.limit, [max_size]);
            });
            var proxy = _proxys[type || 'local'];
            proxy.upload(file, {
                filename: sub_dir + (_filename || filename),
                root_dir: root_dir,
                original_name: original_name
            }, function (err, result) {
                _filename = undefined;
                if (result) {
                    files.push(__assign(__assign({}, result), { size: fileSize }));
                }
            });
        });
        Busboy.on('finish', function () { return done(null, files); });
        this.__Request.pipe(Busboy);
    };
    return Store;
}());
exports.Store = Store;
function Connect(setting) {
    return function (target) {
        target.prototype.__Proxys = setting.proxys;
        target.prototype.__Errors = setting.errors;
    };
}
exports.Connect = Connect;
