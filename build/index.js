/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ts/SaveHandler/SaveHandler.ts":
/*!*******************************************!*\
  !*** ./src/ts/SaveHandler/SaveHandler.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SaveHandler = void 0;
var Logger_1 = __webpack_require__(/*! ../utils/Logger */ "./src/ts/utils/Logger.ts");
var Settings_1 = __webpack_require__(/*! ../utils/Settings */ "./src/ts/utils/Settings.ts");
var SaveHandler = (function () {
    function SaveHandler() {
    }
    SaveHandler.loadData = function () {
        Logger_1.Logger.log("SaveHandler", "Loading save file...");
        var data = localStorage.getItem("saveFile");
        if (data === null) {
            Logger_1.Logger.log("SaveHandler", "No save data found!");
            return false;
        }
        this.save = JSON.parse(this.decode(data));
        return true;
    };
    SaveHandler.saveData = function () {
        var data = this.encode(JSON.stringify(this.save));
        ;
        localStorage.setItem("saveFile", data);
    };
    SaveHandler.getData = function () {
        return this.save;
    };
    SaveHandler.initialize = function () {
        Logger_1.Logger.log("SaveHandler", "Initializing new save file...");
        this.save = {
            settings: Settings_1.Settings.default(),
        };
        this.saveData();
        return this.save;
    };
    SaveHandler.encode = function (data) {
        Logger_1.Logger.log("SaveHandler", "Encoding save data...");
        return data;
    };
    SaveHandler.decode = function (data) {
        Logger_1.Logger.log("SaveHandler", "Decoding save data...");
        return data;
    };
    return SaveHandler;
}());
exports.SaveHandler = SaveHandler;


/***/ }),

/***/ "./src/ts/main.ts":
/*!************************!*\
  !*** ./src/ts/main.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mainFunction = void 0;
var SaveHandler_1 = __webpack_require__(/*! ./SaveHandler/SaveHandler */ "./src/ts/SaveHandler/SaveHandler.ts");
var Settings_1 = __webpack_require__(/*! ./utils/Settings */ "./src/ts/utils/Settings.ts");
var mainFunction = function () {
    SaveHandler_1.SaveHandler.initialize();
    if (!SaveHandler_1.SaveHandler.loadData()) {
        SaveHandler_1.SaveHandler.initialize();
    }
    var data = SaveHandler_1.SaveHandler.getData();
    Settings_1.Settings.set(data.settings);
    console.log(Settings_1.Settings.default());
};
exports.mainFunction = mainFunction;


/***/ }),

/***/ "./src/ts/utils/Logger.ts":
/*!********************************!*\
  !*** ./src/ts/utils/Logger.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
var Settings_1 = __webpack_require__(/*! ./Settings */ "./src/ts/utils/Settings.ts");
var Logger = (function () {
    function Logger() {
    }
    Logger.log = function (context, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (Settings_1.Settings.get() && Settings_1.Settings.get().logging.enabled)
            console.log.apply(console, __spreadArray(["[".concat(context, "]"), message], args, false));
    };
    Logger.error = function (context, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (Settings_1.Settings.get() && Settings_1.Settings.get().logging.enabled)
            console.error.apply(console, __spreadArray(["[".concat(context, "]"), message], args, false));
    };
    Logger.warning = function (context, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (Settings_1.Settings.get() && Settings_1.Settings.get().logging.enabled)
            console.warn.apply(console, __spreadArray(["[".concat(context, "]"), message], args, false));
    };
    Logger.debug = function (context, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (Settings_1.Settings.get() && Settings_1.Settings.get().logging.enabled && Settings_1.Settings.get().logging.verbose)
            console.debug.apply(console, __spreadArray(["[".concat(context, "]"), message], args, false));
    };
    return Logger;
}());
exports.Logger = Logger;


/***/ }),

/***/ "./src/ts/utils/Settings.ts":
/*!**********************************!*\
  !*** ./src/ts/utils/Settings.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Settings = void 0;
var SaveHandler_1 = __webpack_require__(/*! ../SaveHandler/SaveHandler */ "./src/ts/SaveHandler/SaveHandler.ts");
var Settings = (function () {
    function Settings() {
    }
    Settings.default = function () {
        return {
            general: {
                title: "General settings",
                settings: {
                    noTabHistory: {
                        value: false,
                        default: false,
                        name: "Disable tab history",
                        description: "Doesn't save changing between tabs in the browser history, so the back button leaves this page instead"
                    },
                }
            },
            gameplay: {
                title: "Gameplay settings",
                settings: {
                    noOfflineTime: {
                        value: false,
                        default: false,
                        name: "Disable offline time"
                    },
                }
            },
            debug: {
                title: "Debug settings",
                settings: {
                    logging: {
                        value: true,
                        default: true,
                        name: "Enable logging"
                    },
                    verbose: {
                        value: true,
                        default: true,
                        name: "Verbose logging"
                    }
                }
            }
        };
    };
    Settings.get = function () {
        return this.settings;
    };
    Settings.set = function (settings) {
        if (this.settings) {
            this.settings = __assign(__assign({}, this.settings), settings);
        }
        else {
            this.settings = settings;
        }
    };
    Settings.reset = function () {
        this.settings = undefined;
        SaveHandler_1.SaveHandler.saveData();
    };
    return Settings;
}());
exports.Settings = Settings;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var main_1 = __webpack_require__(/*! ./main */ "./src/ts/main.ts");
document.addEventListener("DOMContentLoaded", main_1.mainFunction);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUM7UUFDN0IsQ0FBQztJQUNMLENBQUM7SUFFYSxjQUFLLEdBQW5CO1FBRUksSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIseUJBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBQ0wsZUFBQztBQUFELENBQUM7QUE3RFksNEJBQVE7Ozs7Ozs7VUNIckI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7O0FDdEJBLG1FQUFzQztBQUd0QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsbUJBQVksQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy90cy9TYXZlSGFuZGxlci9TYXZlSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvTG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91dGlscy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNhdmVGaWxlIH0gZnJvbSBcIi4uL3R5cGVzL1NhdmVGaWxlXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuLi91dGlscy9Mb2dnZXJcIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vdXRpbHMvU2V0dGluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXZlSGFuZGxlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBzYXZlOiBTYXZlRmlsZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWREYXRhKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkxvYWRpbmcgc2F2ZSBmaWxlLi4uXCIpO1xyXG4gICAgICAgIGxldCBkYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXZlRmlsZVwiKTtcclxuICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJObyBzYXZlIGRhdGEgZm91bmQhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2F2ZSA9IEpTT04ucGFyc2UodGhpcy5kZWNvZGUoZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzYXZlRGF0YSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHRoaXMuc2F2ZSkpOztcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNhdmVGaWxlXCIsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RGF0YSgpOiBTYXZlRmlsZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUoKTogU2F2ZUZpbGUge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkluaXRpYWxpemluZyBuZXcgc2F2ZSBmaWxlLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuc2F2ZSA9IHtcclxuICAgICAgICAgICAgc2V0dGluZ3M6IFNldHRpbmdzLmRlZmF1bHQoKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc2F2ZURhdGEoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zYXZlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGVuY29kZShkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkVuY29kaW5nIHNhdmUgZGF0YS4uLlwiKTtcclxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZW5jb2RpbmcgbG9naWNcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBkZWNvZGUoZGF0YTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJEZWNvZGluZyBzYXZlIGRhdGEuLi5cIik7XHJcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRlY29kaW5nIGxvZ2ljXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IFNhdmVIYW5kbGVyIH0gZnJvbSBcIi4vU2F2ZUhhbmRsZXIvU2F2ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi91dGlscy9TZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1haW5GdW5jdGlvbiA9ICgpID0+IHtcclxuICAgIFNhdmVIYW5kbGVyLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICBpZiAoIVNhdmVIYW5kbGVyLmxvYWREYXRhKCkpIHtcclxuICAgICAgICBTYXZlSGFuZGxlci5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRhdGEgPSBTYXZlSGFuZGxlci5nZXREYXRhKCk7XHJcbiAgICBTZXR0aW5ncy5zZXQoZGF0YS5zZXR0aW5ncyk7XHJcbiAgICBjb25zb2xlLmxvZyhTZXR0aW5ncy5kZWZhdWx0KCkpXHJcbn1cclxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi9TZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvZyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkubG9nZ2luZy5lbmFibGVkKSBjb25zb2xlLmxvZyhgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBlcnJvcihjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkubG9nZ2luZy5lbmFibGVkKSBjb25zb2xlLmVycm9yKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHdhcm5pbmcoY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmxvZ2dpbmcuZW5hYmxlZCkgY29uc29sZS53YXJuKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlYnVnKGNvbnRleHQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChTZXR0aW5ncy5nZXQoKSAmJiBTZXR0aW5ncy5nZXQoKS5sb2dnaW5nLmVuYWJsZWQgJiYgU2V0dGluZ3MuZ2V0KCkubG9nZ2luZy52ZXJib3NlKSBjb25zb2xlLmRlYnVnKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBTYXZlSGFuZGxlciB9IGZyb20gJy4uL1NhdmVIYW5kbGVyL1NhdmVIYW5kbGVyJztcclxuaW1wb3J0IHR5cGUgeyBTZXR0aW5ncyBhcyBTZXR0aW5nc1R5cGUgfSBmcm9tICcuLi90eXBlcy9TZXR0aW5ncyc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3Mge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dGluZ3M6IFNldHRpbmdzVHlwZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHQoKTogU2V0dGluZ3NUeXBlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZW5lcmFsOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJHZW5lcmFsIHNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vVGFiSGlzdG9yeToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgdGFiIGhpc3RvcnlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRG9lc24ndCBzYXZlIGNoYW5naW5nIGJldHdlZW4gdGFicyBpbiB0aGUgYnJvd3NlciBoaXN0b3J5LCBzbyB0aGUgYmFjayBidXR0b24gbGVhdmVzIHRoaXMgcGFnZSBpbnN0ZWFkXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnYW1lcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiR2FtZXBsYXkgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9PZmZsaW5lVGltZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgb2ZmbGluZSB0aW1lXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWJ1Zzoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVidWcgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJFbmFibGUgbG9nZ2luZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB2ZXJib3NlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlZlcmJvc2UgbG9nZ2luZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0KCk6IFNldHRpbmdzVHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXQoc2V0dGluZ3M6IFNldHRpbmdzVHlwZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSB7Li4udGhpcy5zZXR0aW5ncywgLi4uc2V0dGluZ3N9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZXNldCgpOiB2b2lkIHtcclxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgcmVzZXQgbG9naWNcclxuICAgICAgICB0aGlzLnNldHRpbmdzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIFNhdmVIYW5kbGVyLnNhdmVEYXRhKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IG1haW5GdW5jdGlvbiB9IGZyb20gXCIuL21haW5cIjtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBtYWluRnVuY3Rpb24pXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==