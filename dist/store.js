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
var path = require("path");
var busboy = require("busboy");
var bytes = require("bytes");
var lodash_1 = require("lodash");
var Upload = (function () {
    function Upload(setting) {
        this.__Request = setting.request;
        this.__Store = setting.store || {
            type: 'local',
            max_size: '4MB',
        };
    }
    Upload.prototype.save = function (done) {
        var _this = this;
        var Busboy = new busboy({
            headers: this.__Request.headers,
            limits: {
                fileSize: bytes(this.__Store.max_size)
            }
        });
        var dir = this.__Request.query.dir;
        var sub_dir = '';
        if (dir && this.__Store.type === 'local') {
            sub_dir = dir.replace(/^(\/)|(\/)$/g, '') + '/';
        }
        var files = [];
        Busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            if (_this.__Store.mime_type && _this.__Store.mime_type.indexOf(mimetype) === -1) {
                return done(_this.__Error.mimetype, [mimetype]);
            }
            var fileSize = 0;
            file.on('data', function (data) {
                fileSize += data.length;
            });
            file.on('limit', function () {
                return done(_this.__Error.limit, [_this.__Store.max_size]);
            });
            var proxy = _this.__Proxy[_this.__Store.type];
            proxy.upload(file, {
                filename: sub_dir + filename,
                root_dir: _this.__Store.root_dir
            }, function (err, result) {
                if (result) {
                    files.push(__assign({}, result, { size: fileSize }));
                }
            });
        });
        Busboy.on('finish', function () { return done(null, files); });
        this.__Request.pipe(Busboy);
    };
    return Upload;
}());
exports.Upload = Upload;
function UploadSetting(error, proxy) {
    return function (target) {
        target.prototype.__Error = error;
        target.prototype.__Proxy = proxy;
    };
}
exports.UploadSetting = UploadSetting;
function parseResult(doc, store, root_url) {
    var data = [];
    doc.forEach(function (item, i) {
        var info = lodash_1.pick(item, ['key', 'url', 'size']);
        if (store.type === 'local' && store.root_url) {
            info.url = store.root_url.replace(/^(\@)/, root_url + "/") + '/' + item.url;
        }
        data.push(info);
    });
    return data;
}
exports.parseResult = parseResult;
function paeseStore(setting, root) {
    if (!setting)
        return;
    for (var store in setting) {
        var item = setting[store];
        if (item.root_dir) {
            setting[store].root_dir = path.resolve(process.cwd(), item.root_dir.replace(/^(\@)/, root + "/"));
        }
    }
}
exports.paeseStore = paeseStore;
