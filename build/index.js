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
const Logger_1 = __webpack_require__(/*! ../utils/Logger */ "./src/ts/utils/Logger.ts");
const Settings_1 = __webpack_require__(/*! ../utils/Settings */ "./src/ts/utils/Settings.ts");
class SaveHandler {
    static loadData() {
        Logger_1.Logger.log("SaveHandler", "Loading save file...");
        let data = localStorage.getItem("saveFile");
        if (data === null) {
            Logger_1.Logger.log("SaveHandler", "No save data found!");
            return false;
        }
        this.save = JSON.parse(this.decode(data));
        return true;
    }
    static saveData() {
        let data = this.encode(JSON.stringify(this.save));
        localStorage.setItem("saveFile", data);
    }
    static getData() {
        return this.save;
    }
    static initialize() {
        Logger_1.Logger.log("SaveHandler", "Initializing new save file...");
        this.save = {
            settings: Settings_1.Settings.default(),
        };
        this.saveData();
        return this.save;
    }
    static encode(data) {
        Logger_1.Logger.log("SaveHandler", "Encoding save data...");
        return data;
    }
    static decode(data) {
        Logger_1.Logger.log("SaveHandler", "Decoding save data...");
        return data;
    }
}
exports.SaveHandler = SaveHandler;


/***/ }),

/***/ "./src/ts/i18n/i18n.ts":
/*!*****************************!*\
  !*** ./src/ts/i18n/i18n.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslatedElement = exports.translations = void 0;
const Settings_1 = __webpack_require__(/*! ../utils/Settings */ "./src/ts/utils/Settings.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/ts/utils/utils.ts");
exports.translations = {
    "en": {
        settings: {
            general: {
                title: "General settings",
                noTabHistory: {
                    name: "Disable tab history",
                    description: "Doesn't save changing between tabs in the browser history, so the back button leaves this page instead"
                },
                language: {
                    name: "Language",
                    description: ""
                },
            },
            gameplay: {
                title: "Gameplay settings",
                noOfflineTime: {
                    name: "Disable offline time",
                    description: ""
                },
            },
            display: {
                title: "Display settings",
                darkNavigation: {
                    name: "Dark header & footer",
                    description: "Changes the color of header & footer to be the same as the theme background color"
                },
            },
            debug: {
                title: "Debug settings",
                logging: {
                    name: "Enable logging",
                    description: ""
                },
                verbose: {
                    name: "Verbose logging",
                    description: ""
                },
            },
        }
    }
};
class TranslatedElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let lang = Settings_1.Settings.get().general.settings.language.value;
        let translated = utils_1.Utils.getNestedProperty(exports.translations[lang], this.innerText);
        if (translated) {
            this.innerText = translated;
        }
    }
}
exports.TranslatedElement = TranslatedElement;


/***/ }),

/***/ "./src/ts/main.ts":
/*!************************!*\
  !*** ./src/ts/main.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.main = void 0;
const i18n_1 = __webpack_require__(/*! ./i18n/i18n */ "./src/ts/i18n/i18n.ts");
const SaveHandler_1 = __webpack_require__(/*! ./SaveHandler/SaveHandler */ "./src/ts/SaveHandler/SaveHandler.ts");
const Wave_1 = __webpack_require__(/*! ./ui/Wave */ "./src/ts/ui/Wave.ts");
const Settings_1 = __webpack_require__(/*! ./utils/Settings */ "./src/ts/utils/Settings.ts");
const main = () => {
    if (!SaveHandler_1.SaveHandler.loadData()) {
        SaveHandler_1.SaveHandler.initialize();
    }
    let data = SaveHandler_1.SaveHandler.getData();
    Settings_1.Settings.set(data.settings);
    customElements.define("translated-string", i18n_1.TranslatedElement);
    let mainContainer = document.getElementById("main");
    let fieldsTabContainer = document.getElementById("tab-fields");
    let waveOffset = ((fieldsTabContainer.clientHeight / 6) / 2);
    const electronWave = new Wave_1.Wave(document.getElementById("electron-field-canvas"), fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#ffffaa",
        colorEnd: "#ffffDD",
        colorGlow: "#ffff00",
        colorHover: "#ffffff",
        pointCount: 10,
        offset: waveOffset * 1 + 200,
    });
    const quarkWaveRed = new Wave_1.Wave(document.getElementById("quark-field-red-canvas"), fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#ff0000",
        colorEnd: "#ff00ff",
        colorGlow: "#ff00ff",
        colorHover: "#ffffff",
        pointCount: 10,
        offset: waveOffset * 2 + 200,
    });
    const quarkWaveGreen = new Wave_1.Wave(document.getElementById("quark-field-green-canvas"), fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#00ff00",
        colorEnd: "#00ffff",
        colorGlow: "#00ff00",
        colorHover: "#ffffff",
        pointCount: 10,
        offset: waveOffset * 3 + 200,
    });
    const quarkWaveBlue = new Wave_1.Wave(document.getElementById("quark-field-blue-canvas"), fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#0000ff",
        colorEnd: "#00ffff",
        colorGlow: "#00ffff",
        colorHover: "#ffffff",
        pointCount: 10,
        offset: waveOffset * 4 + 200,
    });
    const electroweakWave = new Wave_1.Wave(document.getElementById("electroweak-field-canvas"), fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#AAAAAA",
        colorEnd: "#DDDDDD",
        colorGlow: "#DDDDDD",
        colorHover: "#ffffff",
        pointCount: 10,
        offset: waveOffset * 5 + 200,
    });
    const higgsWave = new Wave_1.Wave(document.getElementById("higgs-field-canvas"), fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.042,
        lineWidth: 3,
        colorStart: "#998800",
        colorEnd: "#bb9900",
        colorGlow: "#DDAA00",
        colorHover: "#ffffff",
        pointCount: 10,
        offset: waveOffset * 6 + 200,
    });
    document.getElementsByTagName("body")[0].classList.remove("loading");
};
exports.main = main;


/***/ }),

/***/ "./src/ts/ui/Wave.ts":
/*!***************************!*\
  !*** ./src/ts/ui/Wave.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Wave = void 0;
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/ts/utils/utils.ts");
class Wave {
    constructor(element, container, config, autoStart = true) {
        this.points = [];
        this.time = 0;
        this.hover = false;
        this.ripples = [];
        this.canvas = element;
        this.config = config;
        this.ctx = this.canvas.getContext('2d');
        container.addEventListener('mousemove', (e) => {
            if (this.checkHover(e.clientY)) {
                this.hover = true;
                this.canvas.classList.add("hovered");
                this.ripple(e.clientX, false, 20, 10, 0.05, 1, 1000);
            }
            else {
                this.hover = false;
                this.canvas.classList.remove("hovered");
            }
        });
        container.addEventListener('click', (e) => {
            if (this.hover) {
                this.ripple(e.clientX, true);
            }
        });
        if (!this.config.height) {
            this.config.height = container.clientHeight;
        }
        if (!this.config.rippleDelay) {
            this.config.rippleDelay = 1500;
        }
        if (!this.config.offset) {
            this.config.offset = this.config.height / 2;
        }
        this.handleResize();
        addEventListener('resize', this.handleResize.bind(this));
        this.initialize();
        if (autoStart) {
            this.start();
        }
    }
    checkHover(y) {
        return y > this.config.offset + 100 && y < this.config.offset + 150;
    }
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.config.height;
    }
    setConfig(config) {
        this.config = config;
    }
    setAmplitude(amplitude) {
        this.config.amplitude = amplitude;
    }
    getAmplitude() {
        return this.config.amplitude;
    }
    setFrequency(frequency) {
        this.config.frequency = frequency;
    }
    getFrequency() {
        return this.config.frequency;
    }
    setSpeed(speed) {
        this.config.speed = speed;
    }
    getSpeed() {
        return this.config.speed;
    }
    start() {
        var start = performance.now();
        var self = this;
        function animate(timestamp) {
            self.time = self.config.speed * ((timestamp - start) / 10);
            self.draw(self.time);
            self.ripples = self.ripples.filter((r) => (performance.now() - r.startTime) < r.ttl);
            window.requestAnimationFrame(animate);
        }
        window.requestAnimationFrame(animate);
    }
    initialize() {
        this.points = [];
        for (let i = 0; i <= this.config.pointCount; i++) {
            this.points.push({
                x: i,
                offset: Math.random() * 1000,
            });
        }
    }
    getY(i, time) {
        const point = this.points[i];
        const baseNoise = Math.sin((point.offset + time) * this.config.frequency) * 0.6 +
            Math.sin((point.offset * 0.5 + time * 0.8) * this.config.frequency) * 0.4;
        let rippleOffset = 0;
        const now = performance.now();
        for (let r of this.ripples) {
            const age = (now - r.startTime) / 1000;
            const distance = Math.abs(i - r.index);
            const propagation = age * r.speed;
            const falloff = Math.exp(-r.decay * Math.pow(distance - propagation, 2));
            const rampUpTime = 0.5;
            const ramp = Math.min(1, age / rampUpTime);
            const easedRamp = Math.sin((ramp * Math.PI) / 2);
            const wave = Math.sin(distance - propagation);
            rippleOffset += r.strength * easedRamp * falloff * wave;
        }
        return this.config.offset + (baseNoise * this.config.amplitude + rippleOffset);
    }
    draw(time) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.config.colorStart);
        gradient.addColorStop(1, this.config.colorEnd);
        this.ctx.shadowColor = utils_1.Utils.hexToRGB(this.hover ? this.config.colorHover : this.config.colorGlow);
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = this.config.lineWidth;
        this.ctx.beginPath();
        const stepX = this.canvas.width / (this.config.pointCount - 1);
        let prevX = 0;
        let prevY = this.getY(0, time);
        this.ctx.moveTo(prevX, prevY);
        for (let i = 1; i < this.config.pointCount; i++) {
            const currX = i * stepX;
            const currY = this.getY(i, time);
            const midX = (prevX + currX) / 2;
            const midY = (prevY + currY) / 2;
            this.ctx.quadraticCurveTo(prevX, prevY, midX, midY);
            prevX = currX;
            prevY = currY;
        }
        this.ctx.lineTo(prevX, prevY);
        this.ctx.stroke();
    }
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05, max = 1, ttl = undefined) {
        if (this.ripples.filter((r) => r.manual === manual).length >= max) {
            return false;
        }
        const index = Math.floor((x / this.canvas.width) * this.config.pointCount);
        this.ripples.push({
            index,
            startTime: performance.now(),
            strength,
            speed,
            decay,
            manual,
            ttl: ttl ? ttl : this.config.rippleDelay,
        });
        return true;
    }
}
exports.Wave = Wave;


/***/ }),

/***/ "./src/ts/utils/Logger.ts":
/*!********************************!*\
  !*** ./src/ts/utils/Logger.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const Settings_1 = __webpack_require__(/*! ./Settings */ "./src/ts/utils/Settings.ts");
class Logger {
    static log(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value)
            console.log(`[${context}]`, message, ...args);
    }
    static error(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value)
            console.error(`[${context}]`, message, ...args);
    }
    static warning(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value)
            console.warn(`[${context}]`, message, ...args);
    }
    static debug(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value && Settings_1.Settings.get().debug.settings.verbose.value)
            console.debug(`[${context}]`, message, ...args);
    }
}
exports.Logger = Logger;


/***/ }),

/***/ "./src/ts/utils/Settings.ts":
/*!**********************************!*\
  !*** ./src/ts/utils/Settings.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Settings = void 0;
const SaveHandler_1 = __webpack_require__(/*! ../SaveHandler/SaveHandler */ "./src/ts/SaveHandler/SaveHandler.ts");
class Settings {
    static default() {
        return {
            general: {
                title: "settings.general.title",
                settings: {
                    language: {
                        value: "en",
                        default: "en",
                        name: "settings.general.language.name",
                        description: ""
                    },
                    noTabHistory: {
                        value: false,
                        default: false,
                        name: "settings.general.noTabHistory.name",
                        description: "settings.general.noTabHistory.description"
                    },
                }
            },
            gameplay: {
                title: "settings.gameplay.title",
                settings: {
                    noOfflineTime: {
                        value: false,
                        default: false,
                        name: "settings.gameplay.noOfflineTime.name"
                    },
                }
            },
            display: {
                title: "settings.display.title",
                settings: {
                    darkNavigation: {
                        value: false,
                        default: false,
                        name: "settings.display.darkNavigation.name"
                    },
                }
            },
            debug: {
                title: "settings.debug.title",
                settings: {
                    logging: {
                        value: true,
                        default: true,
                        name: "settings.debug.logging.name",
                    },
                    verbose: {
                        value: false,
                        default: false,
                        name: "settings.debug.verbose.name",
                    }
                }
            }
        };
    }
    static get() {
        return this.settings;
    }
    static set(settings) {
        if (this.settings) {
            this.settings = Object.assign(Object.assign({}, this.settings), settings);
        }
        else {
            this.settings = settings;
        }
    }
    static reset() {
        this.settings = this.default();
        SaveHandler_1.SaveHandler.saveData();
    }
}
exports.Settings = Settings;


/***/ }),

/***/ "./src/ts/utils/utils.ts":
/*!*******************************!*\
  !*** ./src/ts/utils/utils.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = void 0;
var Utils;
(function (Utils) {
    Utils.getNestedProperty = (obj, path) => {
        return path.split('.').reduce((acc, key) => acc === null || acc === void 0 ? void 0 : acc[key], obj);
    };
    Utils.hexToRGB = (hex, alpha) => {
        let noHash = hex.replace("#", "");
        let r = parseInt(noHash.slice(0, 2), 16), g = parseInt(noHash.slice(2, 4), 16), b = parseInt(noHash.slice(4, 6), 16);
        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        }
        else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    };
})(Utils || (exports.Utils = Utils = {}));


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
const main_1 = __webpack_require__(/*! ./main */ "./src/ts/main.ts");
window.addEventListener("load", main_1.main);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLHdGQUF5QztBQUN6Qyw4RkFBNkM7QUFFN0MsTUFBYSxXQUFXO0lBR2IsTUFBTSxDQUFDLFFBQVE7UUFDbEIsZUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUNsRCxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2hCLGVBQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFDakQsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUTtRQUNsQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEQsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFPO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVU7UUFDcEIsZUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsK0JBQStCLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1IsUUFBUSxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFO1NBQy9CLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVk7UUFDOUIsZUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUVuRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFZO1FBQzlCLGVBQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFFbkQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBM0NELGtDQTJDQzs7Ozs7Ozs7Ozs7Ozs7QUM5Q0QsOEZBQTZDO0FBQzdDLHFGQUF1QztBQUUxQixvQkFBWSxHQUFtQjtJQUN4QyxJQUFJLEVBQUU7UUFDRixRQUFRLEVBQUU7WUFDTixPQUFPLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsWUFBWSxFQUFFO29CQUNWLElBQUksRUFBRSxxQkFBcUI7b0JBQzNCLFdBQVcsRUFBRSx3R0FBd0c7aUJBQ3hIO2dCQUNELFFBQVEsRUFBRTtvQkFDTixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsV0FBVyxFQUFFLEVBQUU7aUJBQ2xCO2FBQ0o7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsYUFBYSxFQUFFO29CQUNYLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLFdBQVcsRUFBRSxFQUFFO2lCQUNsQjthQUNKO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLEtBQUssRUFBRSxrQkFBa0I7Z0JBQ3pCLGNBQWMsRUFBRTtvQkFDWixJQUFJLEVBQUUsc0JBQXNCO29CQUM1QixXQUFXLEVBQUUsbUZBQW1GO2lCQUNuRzthQUNKO1lBQ0QsS0FBSyxFQUFFO2dCQUNILEtBQUssRUFBRSxnQkFBZ0I7Z0JBQ3ZCLE9BQU8sRUFBRTtvQkFDTCxJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixXQUFXLEVBQUUsRUFBRTtpQkFDbEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLFdBQVcsRUFBRSxFQUFFO2lCQUNsQjthQUNKO1NBQ0o7S0FDSjtDQUNKO0FBRUQsTUFBYSxpQkFBa0IsU0FBUSxXQUFXO0lBQzlDO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxJQUFJLEdBQUcsbUJBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUQsSUFBSSxVQUFVLEdBQUcsYUFBSyxDQUFDLGlCQUFpQixDQUFDLG9CQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdFLElBQUksVUFBVSxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUNoQyxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBYkQsOENBYUM7Ozs7Ozs7Ozs7Ozs7O0FDM0RELCtFQUE4RDtBQUM5RCxrSEFBd0Q7QUFDeEQsMkVBQWlDO0FBQ2pDLDZGQUE0QztBQUdyQyxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDLHlCQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUMxQix5QkFBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLElBQUksR0FBRyx5QkFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLG1CQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU1QixjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLHdCQUFpQixDQUFDLENBQUM7SUFFOUQsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwRCxJQUFJLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDL0QsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU3RCxNQUFNLFlBQVksR0FBRyxJQUFJLFdBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFzQixFQUFFLGtCQUFrQixFQUFFO1FBQ3JILFNBQVMsRUFBRSxFQUFFO1FBQ2IsU0FBUyxFQUFFLENBQUM7UUFDWixLQUFLLEVBQUUsSUFBSTtRQUNYLFNBQVMsRUFBRSxDQUFDO1FBQ1osVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEVBQUU7UUFDZCxNQUFNLEVBQUUsVUFBVSxHQUFHLENBQUMsR0FBRyxHQUFHO0tBQy9CLENBQUMsQ0FBQztJQUVILE1BQU0sWUFBWSxHQUFHLElBQUksV0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQXNCLEVBQUUsa0JBQWtCLEVBQUU7UUFDdEgsU0FBUyxFQUFFLEVBQUU7UUFDYixTQUFTLEVBQUUsQ0FBQztRQUNaLEtBQUssRUFBRSxJQUFJO1FBQ1gsU0FBUyxFQUFFLENBQUM7UUFDWixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixTQUFTLEVBQUUsU0FBUztRQUNwQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsRUFBRTtRQUNkLE1BQU0sRUFBRSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUc7S0FDL0IsQ0FBQyxDQUFDO0lBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxXQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQywwQkFBMEIsQ0FBc0IsRUFBRSxrQkFBa0IsRUFBRTtRQUMxSCxTQUFTLEVBQUUsRUFBRTtRQUNiLFNBQVMsRUFBRSxDQUFDO1FBQ1osS0FBSyxFQUFFLElBQUk7UUFDWCxTQUFTLEVBQUUsQ0FBQztRQUNaLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxFQUFFO1FBQ2QsTUFBTSxFQUFFLFVBQVUsR0FBRyxDQUFDLEdBQUcsR0FBRztLQUMvQixDQUFDLENBQUM7SUFFSCxNQUFNLGFBQWEsR0FBRyxJQUFJLFdBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLHlCQUF5QixDQUFzQixFQUFFLGtCQUFrQixFQUFFO1FBQ3hILFNBQVMsRUFBRSxFQUFFO1FBQ2IsU0FBUyxFQUFFLENBQUM7UUFDWixLQUFLLEVBQUUsSUFBSTtRQUNYLFNBQVMsRUFBRSxDQUFDO1FBQ1osVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEVBQUU7UUFDZCxNQUFNLEVBQUUsVUFBVSxHQUFHLENBQUMsR0FBRyxHQUFHO0tBQy9CLENBQUMsQ0FBQztJQUVILE1BQU0sZUFBZSxHQUFHLElBQUksV0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsMEJBQTBCLENBQXNCLEVBQUUsa0JBQWtCLEVBQUU7UUFDM0gsU0FBUyxFQUFFLEVBQUU7UUFDYixTQUFTLEVBQUUsQ0FBQztRQUNaLEtBQUssRUFBRSxJQUFJO1FBQ1gsU0FBUyxFQUFFLENBQUM7UUFDWixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixTQUFTLEVBQUUsU0FBUztRQUNwQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsRUFBRTtRQUNkLE1BQU0sRUFBRSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUc7S0FDL0IsQ0FBQyxDQUFDO0lBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxXQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBc0IsRUFBRSxrQkFBa0IsRUFBRTtRQUMvRyxTQUFTLEVBQUUsRUFBRTtRQUNiLFNBQVMsRUFBRSxDQUFDO1FBQ1osS0FBSyxFQUFFLEtBQUs7UUFDWixTQUFTLEVBQUUsQ0FBQztRQUNaLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxFQUFFO1FBQ2QsTUFBTSxFQUFFLFVBQVUsR0FBRyxDQUFDLEdBQUcsR0FBRztLQUMvQixDQUFDLENBQUM7SUFHSCxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBOUZZLFlBQUksUUE4RmhCOzs7Ozs7Ozs7Ozs7OztBQ3JHRCxxRkFBdUM7QUFFdkMsTUFBYSxJQUFJO0lBU2IsWUFBWSxPQUEwQixFQUFFLFNBQXNCLEVBQUUsTUFBa0IsRUFBRSxZQUFxQixJQUFJO1FBTnJHLFdBQU0sR0FBZ0IsRUFBRSxDQUFDO1FBRXpCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsVUFBSyxHQUFZLEtBQUssQ0FBQztRQUN2QixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQWEsRUFBRSxFQUFFO1lBQ3RELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDO1lBQ3hELENBQUM7aUJBQU0sQ0FBQztnQkFDSixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFhLEVBQUUsRUFBRTtZQUNsRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUNoRCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25DLENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFbEIsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztJQUVPLFVBQVUsQ0FBQyxDQUFTO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3hFLENBQUM7SUFFTyxZQUFZO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDNUMsQ0FBQztJQUVNLFNBQVMsQ0FBQyxNQUFrQjtRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQWlCO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sWUFBWTtRQUNmLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDakMsQ0FBQztJQUVNLFlBQVksQ0FBQyxTQUFpQjtRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDdEMsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2pDLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFTSxLQUFLO1FBQ1IsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUVoQixTQUFTLE9BQU8sQ0FBQyxTQUFpQjtZQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3RixNQUFNLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU8sVUFBVTtRQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWpCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNiLENBQUMsRUFBRSxDQUFDO2dCQUNKLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSTthQUMvQixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVPLElBQUksQ0FBQyxDQUFTLEVBQUUsSUFBWTtRQUNoQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sU0FBUyxHQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRztZQUM3RCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRTlFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFOUIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN2QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsTUFBTSxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFHbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFHekUsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUMzQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUdqRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQztZQUM5QyxZQUFZLElBQUksQ0FBQyxDQUFDLFFBQVEsR0FBRyxTQUFTLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztRQUM1RCxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRU8sSUFBSSxDQUFDLElBQVk7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVyQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRS9ELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWpDLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVwRCxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2QsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNsQixDQUFDO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxDQUFTLEVBQUUsU0FBa0IsS0FBSyxFQUFFLFdBQW1CLEdBQUcsRUFBRSxRQUFnQixFQUFFLEVBQUUsUUFBZ0IsSUFBSSxFQUFFLE1BQWMsQ0FBQyxFQUFFLE1BQTBCLFNBQVM7UUFDcEssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7WUFDeEUsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2QsS0FBSztZQUNMLFNBQVMsRUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQzVCLFFBQVE7WUFDUixLQUFLO1lBQ0wsS0FBSztZQUNMLE1BQU07WUFDTixHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVztTQUMzQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUF6TUQsb0JBeU1DOzs7Ozs7Ozs7Ozs7OztBQzNNRCx1RkFBc0M7QUFFdEMsTUFBYSxNQUFNO0lBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBZSxFQUFFLEdBQUcsSUFBVztRQUM5RCxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRXJILENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQWUsRUFBRSxPQUFlLEVBQUUsR0FBRyxJQUFXO1FBQ2hFLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxtQkFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFHLElBQVc7UUFDbEUsSUFBSSxtQkFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSztZQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN0SCxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFlLEVBQUUsT0FBZSxFQUFFLEdBQUcsSUFBVztRQUNoRSxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3RLLENBQUM7Q0FDSjtBQWpCRCx3QkFpQkM7Ozs7Ozs7Ozs7Ozs7O0FDbkJELG1IQUF5RDtBQUd6RCxNQUFhLFFBQVE7SUFHVixNQUFNLENBQUMsT0FBTztRQUNqQixPQUFPO1lBQ0gsT0FBTyxFQUFFO2dCQUNMLEtBQUssRUFBRSx3QkFBd0I7Z0JBQy9CLFFBQVEsRUFBRTtvQkFDTixRQUFRLEVBQUU7d0JBQ04sS0FBSyxFQUFFLElBQUk7d0JBQ1gsT0FBTyxFQUFFLElBQUk7d0JBQ2IsSUFBSSxFQUFFLGdDQUFnQzt3QkFDdEMsV0FBVyxFQUFFLEVBQUU7cUJBQ2xCO29CQUNELFlBQVksRUFBRTt3QkFDVixLQUFLLEVBQUUsS0FBSzt3QkFDWixPQUFPLEVBQUUsS0FBSzt3QkFDZCxJQUFJLEVBQUUsb0NBQW9DO3dCQUMxQyxXQUFXLEVBQUUsMkNBQTJDO3FCQUMzRDtpQkFDSjthQUNKO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLEtBQUssRUFBRSx5QkFBeUI7Z0JBQ2hDLFFBQVEsRUFBRTtvQkFDTixhQUFhLEVBQUU7d0JBQ1gsS0FBSyxFQUFFLEtBQUs7d0JBQ1osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsSUFBSSxFQUFFLHNDQUFzQztxQkFDL0M7aUJBQ0o7YUFDSjtZQUNELE9BQU8sRUFBRTtnQkFDTCxLQUFLLEVBQUUsd0JBQXdCO2dCQUMvQixRQUFRLEVBQUU7b0JBQ04sY0FBYyxFQUFFO3dCQUNaLEtBQUssRUFBRSxLQUFLO3dCQUNaLE9BQU8sRUFBRSxLQUFLO3dCQUNkLElBQUksRUFBRSxzQ0FBc0M7cUJBQy9DO2lCQUNKO2FBQ0o7WUFDRCxLQUFLLEVBQUU7Z0JBQ0gsS0FBSyxFQUFFLHNCQUFzQjtnQkFDN0IsUUFBUSxFQUFFO29CQUNOLE9BQU8sRUFBRTt3QkFDTCxLQUFLLEVBQUUsSUFBSTt3QkFDWCxPQUFPLEVBQUUsSUFBSTt3QkFDYixJQUFJLEVBQUUsNkJBQTZCO3FCQUN0QztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLEtBQUs7d0JBQ1osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsSUFBSSxFQUFFLDZCQUE2QjtxQkFDdEM7aUJBQ0o7YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxHQUFHO1FBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQXNCO1FBQ3BDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLG1DQUFPLElBQUksQ0FBQyxRQUFRLEdBQUssUUFBUSxDQUFDLENBQUM7UUFDcEQsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUM3QixDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLO1FBRWYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IseUJBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDO0NBQ0o7QUE3RUQsNEJBNkVDOzs7Ozs7Ozs7Ozs7OztBQ2hGRCxJQUFpQixLQUFLLENBaUJyQjtBQWpCRCxXQUFpQixLQUFLO0lBQ0wsdUJBQWlCLEdBQUcsQ0FBQyxHQUFRLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDeEQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRVksY0FBUSxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQWMsRUFBRSxFQUFFO1FBQ3BELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDcEMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDcEMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV6QyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsT0FBTyxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNsRSxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2xELENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQyxFQWpCZ0IsS0FBSyxxQkFBTCxLQUFLLFFBaUJyQjs7Ozs7OztVQ2pCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUN0QkEscUVBQThCO0FBRTlCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsV0FBSSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvU2F2ZUhhbmRsZXIvU2F2ZUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2kxOG4vaTE4bi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvV2F2ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvTG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91dGlscy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy90cy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTYXZlRmlsZSB9IGZyb20gXCIuLi90eXBlcy9TYXZlRmlsZVwiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vdXRpbHMvU2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIFNhdmVIYW5kbGVyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBzYXZlOiBTYXZlRmlsZTtcblxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERhdGEoKTogYm9vbGVhbiB7XG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkxvYWRpbmcgc2F2ZSBmaWxlLi4uXCIpO1xuICAgICAgICBsZXQgZGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZUZpbGVcIik7XG4gICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJObyBzYXZlIGRhdGEgZm91bmQhXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2F2ZSA9IEpTT04ucGFyc2UodGhpcy5kZWNvZGUoZGF0YSkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2F2ZURhdGEoKTogdm9pZCB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5lbmNvZGUoSlNPTi5zdHJpbmdpZnkodGhpcy5zYXZlKSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2F2ZUZpbGVcIiwgZGF0YSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXREYXRhKCk6IFNhdmVGaWxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUoKTogU2F2ZUZpbGUge1xuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJJbml0aWFsaXppbmcgbmV3IHNhdmUgZmlsZS4uLlwiKTtcbiAgICAgICAgdGhpcy5zYXZlID0ge1xuICAgICAgICAgICAgc2V0dGluZ3M6IFNldHRpbmdzLmRlZmF1bHQoKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zYXZlRGF0YSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5zYXZlO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGVuY29kZShkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJFbmNvZGluZyBzYXZlIGRhdGEuLi5cIik7XG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBlbmNvZGluZyBsb2dpY1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBkZWNvZGUoZGF0YTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiRGVjb2Rpbmcgc2F2ZSBkYXRhLi4uXCIpO1xuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZGVjb2RpbmcgbG9naWNcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVHJhbnNsYXRpb25NYXAgfSBmcm9tIFwiLi4vdHlwZXMvVHJhbnNsYXRpb25zXCI7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3V0aWxzL1NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uL3V0aWxzL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbk1hcCA9IHtcclxuICAgIFwiZW5cIjoge1xyXG4gICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIGdlbmVyYWw6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkdlbmVyYWwgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG5vVGFiSGlzdG9yeToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRGlzYWJsZSB0YWIgaGlzdG9yeVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkRvZXNuJ3Qgc2F2ZSBjaGFuZ2luZyBiZXR3ZWVuIHRhYnMgaW4gdGhlIGJyb3dzZXIgaGlzdG9yeSwgc28gdGhlIGJhY2sgYnV0dG9uIGxlYXZlcyB0aGlzIHBhZ2UgaW5zdGVhZFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkxhbmd1YWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdhbWVwbGF5OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJHYW1lcGxheSBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbm9PZmZsaW5lVGltZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRGlzYWJsZSBvZmZsaW5lIHRpbWVcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlzcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRGlzcGxheSBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgZGFya05hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRhcmsgaGVhZGVyICYgZm9vdGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ2hhbmdlcyB0aGUgY29sb3Igb2YgaGVhZGVyICYgZm9vdGVyIHRvIGJlIHRoZSBzYW1lIGFzIHRoZSB0aGVtZSBiYWNrZ3JvdW5kIGNvbG9yXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlYnVnOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEZWJ1ZyBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9nZ2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRW5hYmxlIGxvZ2dpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZlcmJvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlZlcmJvc2UgbG9nZ2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0ZWRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICBsZXQgbGFuZyA9IFNldHRpbmdzLmdldCgpLmdlbmVyYWwuc2V0dGluZ3MubGFuZ3VhZ2UudmFsdWU7XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0ZWQgPSBVdGlscy5nZXROZXN0ZWRQcm9wZXJ0eSh0cmFuc2xhdGlvbnNbbGFuZ10sIHRoaXMuaW5uZXJUZXh0KTtcclxuXHJcbiAgICAgICAgaWYgKHRyYW5zbGF0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lclRleHQgPSB0cmFuc2xhdGVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcbmltcG9ydCB7IFRyYW5zbGF0ZWRFbGVtZW50LCB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi9pMThuL2kxOG5cIjtcbmltcG9ydCB7IFNhdmVIYW5kbGVyIH0gZnJvbSBcIi4vU2F2ZUhhbmRsZXIvU2F2ZUhhbmRsZXJcIjtcbmltcG9ydCB7IFdhdmUgfSBmcm9tIFwiLi91aS9XYXZlXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuL3V0aWxzL1NldHRpbmdzXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL3V0aWxzL3V0aWxzXCI7XG5cbmV4cG9ydCBjb25zdCBtYWluID0gKCkgPT4ge1xuICAgIGlmICghU2F2ZUhhbmRsZXIubG9hZERhdGEoKSkge1xuICAgICAgICBTYXZlSGFuZGxlci5pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgbGV0IGRhdGEgPSBTYXZlSGFuZGxlci5nZXREYXRhKCk7XG4gICAgU2V0dGluZ3Muc2V0KGRhdGEuc2V0dGluZ3MpO1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidHJhbnNsYXRlZC1zdHJpbmdcIiwgVHJhbnNsYXRlZEVsZW1lbnQpO1xuXG4gICAgbGV0IG1haW5Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIik7XG4gICAgbGV0IGZpZWxkc1RhYkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFiLWZpZWxkc1wiKTtcbiAgICBsZXQgd2F2ZU9mZnNldCA9ICgoZmllbGRzVGFiQ29udGFpbmVyLmNsaWVudEhlaWdodCAvIDYpIC8gMik7XG5cbiAgICBjb25zdCBlbGVjdHJvbldhdmUgPSBuZXcgV2F2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVsZWN0cm9uLWZpZWxkLWNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudCwgZmllbGRzVGFiQ29udGFpbmVyLCB7XG4gICAgICAgIGFtcGxpdHVkZTogMTAsXG4gICAgICAgIGZyZXF1ZW5jeTogMSxcbiAgICAgICAgc3BlZWQ6IDAuMDIsXG4gICAgICAgIGxpbmVXaWR0aDogMyxcbiAgICAgICAgY29sb3JTdGFydDogXCIjZmZmZmFhXCIsXG4gICAgICAgIGNvbG9yRW5kOiBcIiNmZmZmRERcIixcbiAgICAgICAgY29sb3JHbG93OiBcIiNmZmZmMDBcIixcbiAgICAgICAgY29sb3JIb3ZlcjogXCIjZmZmZmZmXCIsXG4gICAgICAgIHBvaW50Q291bnQ6IDEwLFxuICAgICAgICBvZmZzZXQ6IHdhdmVPZmZzZXQgKiAxICsgMjAwLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcXVhcmtXYXZlUmVkID0gbmV3IFdhdmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWFyay1maWVsZC1yZWQtY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50LCBmaWVsZHNUYWJDb250YWluZXIsIHtcbiAgICAgICAgYW1wbGl0dWRlOiAxMCxcbiAgICAgICAgZnJlcXVlbmN5OiAxLFxuICAgICAgICBzcGVlZDogMC4wMixcbiAgICAgICAgbGluZVdpZHRoOiAzLFxuICAgICAgICBjb2xvclN0YXJ0OiBcIiNmZjAwMDBcIixcbiAgICAgICAgY29sb3JFbmQ6IFwiI2ZmMDBmZlwiLFxuICAgICAgICBjb2xvckdsb3c6IFwiI2ZmMDBmZlwiLFxuICAgICAgICBjb2xvckhvdmVyOiBcIiNmZmZmZmZcIixcbiAgICAgICAgcG9pbnRDb3VudDogMTAsXG4gICAgICAgIG9mZnNldDogd2F2ZU9mZnNldCAqIDIgKyAyMDAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBxdWFya1dhdmVHcmVlbiA9IG5ldyBXYXZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVhcmstZmllbGQtZ3JlZW4tY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50LCBmaWVsZHNUYWJDb250YWluZXIsIHtcbiAgICAgICAgYW1wbGl0dWRlOiAxMCxcbiAgICAgICAgZnJlcXVlbmN5OiAxLFxuICAgICAgICBzcGVlZDogMC4wMixcbiAgICAgICAgbGluZVdpZHRoOiAzLFxuICAgICAgICBjb2xvclN0YXJ0OiBcIiMwMGZmMDBcIixcbiAgICAgICAgY29sb3JFbmQ6IFwiIzAwZmZmZlwiLFxuICAgICAgICBjb2xvckdsb3c6IFwiIzAwZmYwMFwiLFxuICAgICAgICBjb2xvckhvdmVyOiBcIiNmZmZmZmZcIixcbiAgICAgICAgcG9pbnRDb3VudDogMTAsXG4gICAgICAgIG9mZnNldDogd2F2ZU9mZnNldCAqIDMgKyAyMDAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBxdWFya1dhdmVCbHVlID0gbmV3IFdhdmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWFyay1maWVsZC1ibHVlLWNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudCwgZmllbGRzVGFiQ29udGFpbmVyLCB7XG4gICAgICAgIGFtcGxpdHVkZTogMTAsXG4gICAgICAgIGZyZXF1ZW5jeTogMSxcbiAgICAgICAgc3BlZWQ6IDAuMDIsXG4gICAgICAgIGxpbmVXaWR0aDogMyxcbiAgICAgICAgY29sb3JTdGFydDogXCIjMDAwMGZmXCIsXG4gICAgICAgIGNvbG9yRW5kOiBcIiMwMGZmZmZcIixcbiAgICAgICAgY29sb3JHbG93OiBcIiMwMGZmZmZcIixcbiAgICAgICAgY29sb3JIb3ZlcjogXCIjZmZmZmZmXCIsXG4gICAgICAgIHBvaW50Q291bnQ6IDEwLFxuICAgICAgICBvZmZzZXQ6IHdhdmVPZmZzZXQgKiA0ICsgMjAwLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZWxlY3Ryb3dlYWtXYXZlID0gbmV3IFdhdmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbGVjdHJvd2Vhay1maWVsZC1jYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQsIGZpZWxkc1RhYkNvbnRhaW5lciwge1xuICAgICAgICBhbXBsaXR1ZGU6IDEwLFxuICAgICAgICBmcmVxdWVuY3k6IDEsXG4gICAgICAgIHNwZWVkOiAwLjAyLFxuICAgICAgICBsaW5lV2lkdGg6IDMsXG4gICAgICAgIGNvbG9yU3RhcnQ6IFwiI0FBQUFBQVwiLFxuICAgICAgICBjb2xvckVuZDogXCIjREREREREXCIsXG4gICAgICAgIGNvbG9yR2xvdzogXCIjREREREREXCIsXG4gICAgICAgIGNvbG9ySG92ZXI6IFwiI2ZmZmZmZlwiLFxuICAgICAgICBwb2ludENvdW50OiAxMCxcbiAgICAgICAgb2Zmc2V0OiB3YXZlT2Zmc2V0ICogNSArIDIwMCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhpZ2dzV2F2ZSA9IG5ldyBXYXZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlnZ3MtZmllbGQtY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50LCBmaWVsZHNUYWJDb250YWluZXIsIHtcbiAgICAgICAgYW1wbGl0dWRlOiAxMCxcbiAgICAgICAgZnJlcXVlbmN5OiAxLFxuICAgICAgICBzcGVlZDogMC4wNDIsXG4gICAgICAgIGxpbmVXaWR0aDogMyxcbiAgICAgICAgY29sb3JTdGFydDogXCIjOTk4ODAwXCIsXG4gICAgICAgIGNvbG9yRW5kOiBcIiNiYjk5MDBcIixcbiAgICAgICAgY29sb3JHbG93OiBcIiNEREFBMDBcIixcbiAgICAgICAgY29sb3JIb3ZlcjogXCIjZmZmZmZmXCIsXG4gICAgICAgIHBvaW50Q291bnQ6IDEwLFxuICAgICAgICBvZmZzZXQ6IHdhdmVPZmZzZXQgKiA2ICsgMjAwLFxuICAgIH0pO1xuXG4gICAgLy8gcmVhZHlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XG59XG4iLCJpbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi91dGlscy91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdhdmUge1xyXG4gICAgcHJpdmF0ZSBjb25maWc6IFdhdmVDb25maWc7XHJcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvaW50czogV2F2ZVBvaW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIHRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGhvdmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHJpcHBsZXM6IFJpcHBsZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNvbmZpZzogV2F2ZUNvbmZpZywgYXV0b1N0YXJ0OiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0hvdmVyKGUuY2xpZW50WSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LmFkZChcImhvdmVyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZShlLmNsaWVudFgsIGZhbHNlLCAyMCwgMTAsIDAuMDUsIDEsIDEwMDApXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3Zlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGUoZS5jbGllbnRYLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmhlaWdodCA9IGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcucmlwcGxlRGVsYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcucmlwcGxlRGVsYXkgPSAxNTAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5vZmZzZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcub2Zmc2V0ID0gdGhpcy5jb25maWcuaGVpZ2h0IC8gMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplKCk7XHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5oYW5kbGVSZXNpemUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICBpZiAoYXV0b1N0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0hvdmVyKHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB5ID4gdGhpcy5jb25maWcub2Zmc2V0ICsgMTAwICYmIHkgPCB0aGlzLmNvbmZpZy5vZmZzZXQgKyAxNTA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVSZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbmZpZyhjb25maWc6IFdhdmVDb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0QW1wbGl0dWRlKGFtcGxpdHVkZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuYW1wbGl0dWRlID0gYW1wbGl0dWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBbXBsaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuYW1wbGl0dWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRGcmVxdWVuY3koZnJlcXVlbmN5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZy5mcmVxdWVuY3kgPSBmcmVxdWVuY3k7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEZyZXF1ZW5jeSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5mcmVxdWVuY3k7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFNwZWVkKHNwZWVkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZy5zcGVlZCA9IHNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTcGVlZCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHNlbGYudGltZSA9IHNlbGYuY29uZmlnLnNwZWVkICogKCh0aW1lc3RhbXAgLSBzdGFydCkgLyAxMCk7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhdyhzZWxmLnRpbWUpO1xyXG4gICAgICAgICAgICBzZWxmLnJpcHBsZXMgPSBzZWxmLnJpcHBsZXMuZmlsdGVyKChyOiBSaXBwbGUpID0+IChwZXJmb3JtYW5jZS5ub3coKSAtIHIuc3RhcnRUaW1lKSA8IHIudHRsKTsgLy8ga2VlcCBvbmx5IHJlY2VudCBvbmVzXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmNvbmZpZy5wb2ludENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB4OiBpLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBNYXRoLnJhbmRvbSgpICogMTAwMCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0WShpOiBudW1iZXIsIHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNbaV07XHJcbiAgICAgICAgY29uc3QgYmFzZU5vaXNlID1cclxuICAgICAgICAgICAgTWF0aC5zaW4oKHBvaW50Lm9mZnNldCArIHRpbWUpICogdGhpcy5jb25maWcuZnJlcXVlbmN5KSAqIDAuNiArXHJcbiAgICAgICAgICAgIE1hdGguc2luKChwb2ludC5vZmZzZXQgKiAwLjUgKyB0aW1lICogMC44KSAqIHRoaXMuY29uZmlnLmZyZXF1ZW5jeSkgKiAwLjQ7XHJcblxyXG4gICAgICAgIGxldCByaXBwbGVPZmZzZXQgPSAwO1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCByIG9mIHRoaXMucmlwcGxlcykge1xyXG4gICAgICAgICAgICBjb25zdCBhZ2UgPSAobm93IC0gci5zdGFydFRpbWUpIC8gMTAwMDsgLy8gYWdlIGluIHNlY29uZHNcclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhpIC0gci5pbmRleCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BhZ2F0aW9uID0gYWdlICogci5zcGVlZDtcclxuXHJcbiAgICAgICAgICAgIC8vIE9ubHkgYWZmZWN0IHBvaW50cyBuZWFyIHRoZSB3YXZlZnJvbnRcclxuICAgICAgICAgICAgY29uc3QgZmFsbG9mZiA9IE1hdGguZXhwKC1yLmRlY2F5ICogTWF0aC5wb3coZGlzdGFuY2UgLSBwcm9wYWdhdGlvbiwgMikpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmFtcGluZyBmYWN0b3IgKGVhc2UgaW4gdXAgdG8gMS4wIG92ZXIgMC41cylcclxuICAgICAgICAgICAgY29uc3QgcmFtcFVwVGltZSA9IDAuNTtcclxuICAgICAgICAgICAgY29uc3QgcmFtcCA9IE1hdGgubWluKDEsIGFnZSAvIHJhbXBVcFRpbWUpOyAvLyAwIOKGkiAxXHJcbiAgICAgICAgICAgIGNvbnN0IGVhc2VkUmFtcCA9IE1hdGguc2luKChyYW1wICogTWF0aC5QSSkgLyAyKTsgLy8gZWFzZU91dFNpbmVcclxuXHJcbiAgICAgICAgICAgIC8vIFJpcHBsZSBjb250cmlidXRpb25cclxuICAgICAgICAgICAgY29uc3Qgd2F2ZSA9IE1hdGguc2luKGRpc3RhbmNlIC0gcHJvcGFnYXRpb24pO1xyXG4gICAgICAgICAgICByaXBwbGVPZmZzZXQgKz0gci5zdHJlbmd0aCAqIGVhc2VkUmFtcCAqIGZhbGxvZmYgKiB3YXZlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLm9mZnNldCArIChiYXNlTm9pc2UgKiB0aGlzLmNvbmZpZy5hbXBsaXR1ZGUgKyByaXBwbGVPZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhdyh0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCB0aGlzLmNvbmZpZy5jb2xvclN0YXJ0KTtcclxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgdGhpcy5jb25maWcuY29sb3JFbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gVXRpbHMuaGV4VG9SR0IodGhpcy5ob3ZlciA/IHRoaXMuY29uZmlnLmNvbG9ySG92ZXIgOiB0aGlzLmNvbmZpZy5jb2xvckdsb3cpO1xyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd0JsdXIgPSAxMDtcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dPZmZzZXRZID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB0aGlzLmNvbmZpZy5saW5lV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBYID0gdGhpcy5jYW52YXMud2lkdGggLyAodGhpcy5jb25maWcucG9pbnRDb3VudCAtIDEpO1xyXG5cclxuICAgICAgICBsZXQgcHJldlggPSAwO1xyXG4gICAgICAgIGxldCBwcmV2WSA9IHRoaXMuZ2V0WSgwLCB0aW1lKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8ocHJldlgsIHByZXZZKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmNvbmZpZy5wb2ludENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VyclggPSBpICogc3RlcFg7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJZID0gdGhpcy5nZXRZKGksIHRpbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWlkWCA9IChwcmV2WCArIGN1cnJYKSAvIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pZFkgPSAocHJldlkgKyBjdXJyWSkgLyAyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdHgucXVhZHJhdGljQ3VydmVUbyhwcmV2WCwgcHJldlksIG1pZFgsIG1pZFkpO1xyXG5cclxuICAgICAgICAgICAgcHJldlggPSBjdXJyWDtcclxuICAgICAgICAgICAgcHJldlkgPSBjdXJyWTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbyhwcmV2WCwgcHJldlkpO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByaXBwbGUoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4gPSBmYWxzZSwgc3RyZW5ndGg6IG51bWJlciA9IDEyMCwgc3BlZWQ6IG51bWJlciA9IDEwLCBkZWNheTogbnVtYmVyID0gMC4wNSwgbWF4OiBudW1iZXIgPSAxLCB0dGw6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJpcHBsZXMuZmlsdGVyKChyOiBSaXBwbGUpID0+IHIubWFudWFsID09PSBtYW51YWwpLmxlbmd0aCA+PSBtYXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKCh4IC8gdGhpcy5jYW52YXMud2lkdGgpICogdGhpcy5jb25maWcucG9pbnRDb3VudCk7XHJcblxyXG4gICAgICAgIHRoaXMucmlwcGxlcy5wdXNoKHtcclxuICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogcGVyZm9ybWFuY2Uubm93KCksXHJcbiAgICAgICAgICAgIHN0cmVuZ3RoLFxyXG4gICAgICAgICAgICBzcGVlZCxcclxuICAgICAgICAgICAgZGVjYXksXHJcbiAgICAgICAgICAgIG1hbnVhbCxcclxuICAgICAgICAgICAgdHRsOiB0dGwgPyB0dGwgOiB0aGlzLmNvbmZpZy5yaXBwbGVEZWxheSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV2F2ZUNvbmZpZyB7XHJcbiAgICBhbXBsaXR1ZGU6IG51bWJlcjtcclxuICAgIGZyZXF1ZW5jeTogbnVtYmVyO1xyXG4gICAgc3BlZWQ6IG51bWJlcjtcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyO1xyXG4gICAgY29sb3JTdGFydDogc3RyaW5nO1xyXG4gICAgY29sb3JFbmQ6IHN0cmluZztcclxuICAgIGNvbG9yR2xvdzogc3RyaW5nO1xyXG4gICAgY29sb3JIb3Zlcjogc3RyaW5nO1xyXG4gICAgcG9pbnRDb3VudDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0PzogbnVtYmVyO1xyXG4gICAgb2Zmc2V0PzogbnVtYmVyO1xyXG4gICAgcmlwcGxlRGVsYXk/OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBXYXZlUG9pbnQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBSaXBwbGUge1xyXG4gICAgaW5kZXg6IG51bWJlcjtcclxuICAgIHN0YXJ0VGltZTogbnVtYmVyO1xyXG4gICAgc3RyZW5ndGg6IG51bWJlcjtcclxuICAgIHNwZWVkOiBudW1iZXI7XHJcbiAgICBkZWNheTogbnVtYmVyO1xyXG4gICAgbWFudWFsOiBib29sZWFuO1xyXG4gICAgdHRsOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi9TZXR0aW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcbiAgICBwdWJsaWMgc3RhdGljIGxvZyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUubG9nKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBlcnJvcihjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUuZXJyb3IoYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgd2FybmluZyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUud2FybihgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBkZWJ1Zyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MudmVyYm9zZS52YWx1ZSkgY29uc29sZS5kZWJ1ZyhgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU2F2ZUhhbmRsZXIgfSBmcm9tICcuLi9TYXZlSGFuZGxlci9TYXZlSGFuZGxlcic7XG5pbXBvcnQgdHlwZSB7IFNldHRpbmdzIGFzIFNldHRpbmdzVHlwZSB9IGZyb20gJy4uL3R5cGVzL1NldHRpbmdzJztcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzIHtcbiAgICBwcml2YXRlIHN0YXRpYyBzZXR0aW5nczogU2V0dGluZ3NUeXBlO1xuXG4gICAgcHVibGljIHN0YXRpYyBkZWZhdWx0KCk6IFNldHRpbmdzVHlwZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZW5lcmFsOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZ2VuZXJhbC50aXRsZVwiLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJlblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5nZW5lcmFsLmxhbmd1YWdlLm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5vVGFiSGlzdG9yeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmdlbmVyYWwubm9UYWJIaXN0b3J5Lm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcInNldHRpbmdzLmdlbmVyYWwubm9UYWJIaXN0b3J5LmRlc2NyaXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2FtZXBsYXk6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5nYW1lcGxheS50aXRsZVwiLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIG5vT2ZmbGluZVRpbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5nYW1lcGxheS5ub09mZmxpbmVUaW1lLm5hbWVcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNwbGF5OiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZGlzcGxheS50aXRsZVwiLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhcmtOYXZpZ2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZGlzcGxheS5kYXJrTmF2aWdhdGlvbi5uYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVidWc6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5kZWJ1Zy50aXRsZVwiLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZGVidWcubG9nZ2luZy5uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZlcmJvc2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kZWJ1Zy52ZXJib3NlLm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0KCk6IFNldHRpbmdzVHlwZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2V0KHNldHRpbmdzOiBTZXR0aW5nc1R5cGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSB7Li4udGhpcy5zZXR0aW5ncywgLi4uc2V0dGluZ3N9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IHJlc2V0IGxvZ2ljXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLmRlZmF1bHQoKTtcbiAgICAgICAgU2F2ZUhhbmRsZXIuc2F2ZURhdGEoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgbmFtZXNwYWNlIFV0aWxzIHtcclxuICAgIGV4cG9ydCBjb25zdCBnZXROZXN0ZWRQcm9wZXJ0eSA9IChvYmo6IGFueSwgcGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5yZWR1Y2UoKGFjYywga2V5KSA9PiBhY2M/LltrZXldLCBvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBoZXhUb1JHQiA9IChoZXg6IHN0cmluZywgYWxwaGE/OiBudW1iZXIpID0+IHtcclxuICAgICAgICBsZXQgbm9IYXNoID0gaGV4LnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xyXG4gICAgICAgIGxldCByID0gcGFyc2VJbnQobm9IYXNoLnNsaWNlKDAsIDIpLCAxNiksXHJcbiAgICAgICAgICAgIGcgPSBwYXJzZUludChub0hhc2guc2xpY2UoMiwgNCksIDE2KSxcclxuICAgICAgICAgICAgYiA9IHBhcnNlSW50KG5vSGFzaC5zbGljZSg0LCA2KSwgMTYpO1xyXG5cclxuICAgICAgICBpZiAoYWxwaGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHIgKyBcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIGFscGhhICsgXCIpXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmdiKFwiICsgciArIFwiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIpXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBtYWluIH0gZnJvbSBcIi4vbWFpblwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=