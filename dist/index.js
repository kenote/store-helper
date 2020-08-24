"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localProxy = exports.Connect = exports.Store = void 0;
var store_1 = require("./store");
Object.defineProperty(exports, "Store", { enumerable: true, get: function () { return store_1.Store; } });
Object.defineProperty(exports, "Connect", { enumerable: true, get: function () { return store_1.Connect; } });
var local_1 = require("./proxys/local");
Object.defineProperty(exports, "localProxy", { enumerable: true, get: function () { return local_1.default; } });
