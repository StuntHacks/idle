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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.translations = void 0;
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
        },
        ui: {
            header: {},
            footer: {
                fermions: "Fermions",
                generations: {
                    first: "Generation I",
                    second: "Generation II",
                    third: "Generation III",
                },
                quarks: {
                    up: {
                        name: "Up Quarks",
                        flavorText: "",
                    },
                    down: {
                        name: "Down Quarks",
                        flavorText: "",
                    },
                    charm: {
                        name: "Charm Quarks",
                        flavorText: "",
                    },
                    strange: {
                        name: "Strange Quarks",
                        flavorText: "",
                    },
                    top: {
                        name: "Top Quarks",
                        flavorText: "",
                    },
                    bottom: {
                        name: "Bottom Quarks",
                        flavorText: "",
                    },
                },
                leptons: {
                    electron: {
                        name: "Electrons",
                        flavorText: "",
                    },
                    muon: {
                        name: "Muons",
                        flavorText: "",
                    },
                    tau: {
                        name: "Taus",
                        flavorText: "",
                    },
                },
                bosons: {
                    name: "Bosons",
                    higgs: {
                        name: "Higgs Bosons",
                        flavorText: "",
                    },
                    gluon: {
                        name: "Gluons",
                        flavorText: "",
                    },
                    photon: {
                        name: "Photons",
                        flavorText: "",
                    },
                    w_plus: {
                        name: "W⁺ Bosons",
                        flavorText: "",
                    },
                    w_minus: {
                        name: "W⁻ Bosons",
                        flavorText: "",
                    },
                    z: {
                        name: "Z⁰ Bosons",
                        flavorText: "",
                    },
                }
            }
        }
    }
};


/***/ }),

/***/ "./src/ts/main.ts":
/*!************************!*\
  !*** ./src/ts/main.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.main = void 0;
const QuantumFieldElement_1 = __webpack_require__(/*! ./ui/custom_elements/QuantumFieldElement */ "./src/ts/ui/custom_elements/QuantumFieldElement.ts");
const TranslatedElement_1 = __webpack_require__(/*! ./ui/custom_elements/TranslatedElement */ "./src/ts/ui/custom_elements/TranslatedElement.ts");
const SaveHandler_1 = __webpack_require__(/*! ./SaveHandler/SaveHandler */ "./src/ts/SaveHandler/SaveHandler.ts");
const Settings_1 = __webpack_require__(/*! ./utils/Settings */ "./src/ts/utils/Settings.ts");
const ToolTip_1 = __webpack_require__(/*! ./ui/custom_elements/ToolTip */ "./src/ts/ui/custom_elements/ToolTip.ts");
const ResourceGainElement_1 = __webpack_require__(/*! ./ui/custom_elements/ResourceGainElement */ "./src/ts/ui/custom_elements/ResourceGainElement.ts");
const main = () => {
    if (!SaveHandler_1.SaveHandler.loadData()) {
        SaveHandler_1.SaveHandler.initialize();
    }
    let data = SaveHandler_1.SaveHandler.getData();
    Settings_1.Settings.set(data.settings);
    customElements.define("translated-string", TranslatedElement_1.TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement_1.QuantumFieldElement);
    customElements.define("resource-gain", ResourceGainElement_1.ResourceGainElement);
    customElements.define("tool-tip", ToolTip_1.ToolTip);
    let mainContainer = document.getElementById("main");
    document.getElementById("quark-field").addEventListener("ripple", (e) => {
        console.log("ripple", e.detail.id);
    });
    let resourceContainer = document.getElementById("resource-gain-container");
    document.addEventListener("click", function () {
        console.log("click");
        let resource = document.createElement("resource-gain");
        resource.setAttribute("x", "400");
        resource.setAttribute("y", Math.floor(Math.random() * resourceContainer.clientWidth) + "");
        resource.setAttribute("type", ["up", "down", "strange", "charm", "top", "bottom", "electron", "muon", "tau"][Math.floor(Math.random() * 9)]);
        resource.setAttribute("color", ["red", "green", "blue"][Math.floor(Math.random() * 3)]);
        resource.setAttribute("amount", "1.34e17");
        resourceContainer.appendChild(resource);
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
                if (!this.hover) {
                    this.ripple(e.clientX, false, 20, 10, 0.05, 15);
                }
                this.hover = true;
                this.canvas.classList.add("hovered");
            }
            else {
                this.hover = false;
                this.canvas.classList.remove("hovered");
            }
        });
        container.addEventListener('click', (e) => {
            if (this.hover) {
                this.ripple(e.clientX, true, 160);
            }
        });
        if (!this.config.height) {
            this.config.height = container.clientHeight;
        }
        if (this.config.rippleDelay === undefined) {
            this.config.rippleDelay = 1500;
        }
        if (this.config.offset === undefined) {
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
    cleanupRipples() {
        const now = performance.now();
        const threshold = 0.01;
        this.ripples = this.ripples.filter(r => {
            const age = (now - r.startTime) / 1000;
            const rampUpTime = 0.5;
            const ramp = Math.min(1, age / rampUpTime);
            const easedRamp = Math.sin((ramp * Math.PI) / 2);
            const propagation = age * r.speed;
            const falloff = Math.exp(-r.decay * Math.pow(0 - propagation, 2));
            const potentialAmplitude = r.strength * easedRamp * falloff;
            return potentialAmplitude > threshold;
        });
    }
    start() {
        var start = performance.now();
        var self = this;
        function animate(timestamp) {
            self.time = self.config.speed * ((timestamp - start) / 10);
            self.draw(self.time);
            self.cleanupRipples();
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
        gradient.addColorStop(0, this.config.color.start);
        gradient.addColorStop(1, this.config.color.end);
        this.ctx.shadowColor = utils_1.Utils.hexToRGB(this.hover ? this.config.color.hover : this.config.color.glow);
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
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05, max = 1) {
        console.log("ripple");
        if (this.ripples.filter((r) => r.manual === manual).length >= max) {
            return false;
        }
        const index = Math.floor((x / this.canvas.width) * this.config.pointCount);
        if (this.config.rippleCallback) {
            if (!this.config.rippleCallback(manual, this.config.id)) {
                return false;
            }
        }
        this.ripples.push({
            index,
            startTime: performance.now(),
            strength,
            speed,
            decay,
            manual,
        });
        return true;
    }
}
exports.Wave = Wave;


/***/ }),

/***/ "./src/ts/ui/custom_elements/QuantumFieldElement.ts":
/*!**********************************************************!*\
  !*** ./src/ts/ui/custom_elements/QuantumFieldElement.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuantumFieldElement = void 0;
const Wave_1 = __webpack_require__(/*! ../Wave */ "./src/ts/ui/Wave.ts");
class QuantumFieldElement extends HTMLElement {
    constructor() {
        super();
        this.waves = [];
        this.canvases = [];
        this.colors = [];
    }
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05, max = 1) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay, max); });
    }
    connectedCallback() {
        let amount = parseInt(this.parentElement.getAttribute("data-fields"));
        let offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        this.getElementsByClassName("field-label")[0].style.top = (offset - 60) + "px";
        let handleRipple;
        if (this.getAttribute("type") === "rainbow") {
            const getNextDrop = () => {
                if (Math.random() < 0.1) {
                    return "all";
                }
                return ["red", "green", "blue"][Math.floor(Math.random() * 3)];
            };
            handleRipple = (manual, id) => {
                if (!manual) {
                    return true;
                }
                if (id === this.ids[0]) {
                    this.whichWave = getNextDrop();
                }
                if (this.whichWave === "all" || id.includes(this.whichWave)) {
                    this.dispatchEvent(new CustomEvent("ripple", { detail: { manual, id } }));
                    return true;
                }
                return false;
            };
            this.colors = [
                {
                    start: "#0000ff",
                    end: "#00ffff",
                    glow: "#00ffff",
                    hover: "#ffffff",
                },
                {
                    start: "#00ff00",
                    end: "#00ffff",
                    glow: "#00ff00",
                    hover: "#ffffff",
                },
                {
                    start: "#ff0000",
                    end: "#ff00ff",
                    glow: "#ff00ff",
                    hover: "#ffffff",
                },
            ];
            this.ids = [`${this.id}-blue`, `${this.id}-green`, `${this.id}-red`];
        }
        else {
            handleRipple = (manual, id) => {
                this.dispatchEvent(new CustomEvent("ripple", { detail: { manual, id } }));
                return true;
            };
            let c = {
                start: this.getAttribute("color-start"),
                end: this.getAttribute("color-end"),
                glow: this.getAttribute("color-glow"),
                hover: this.getAttribute("color-hover") || "#ffffff",
            };
            this.colors = [c, c, c];
            this.ids = [this.id, "", ""];
        }
        this.colors.forEach((color, index) => {
            this.canvases.push(document.createElement("canvas"));
            this.appendChild(this.canvases[index]);
            this.waves.push(new Wave_1.Wave(this.canvases[index], this.parentElement, {
                amplitude: 20,
                frequency: 1,
                speed: 0.02,
                lineWidth: 3,
                color: {
                    start: color.start,
                    end: color.end,
                    glow: color.glow,
                    hover: color.hover,
                },
                pointCount: 10,
                offset: offset,
                rippleCallback: handleRipple,
                id: this.ids[index],
            }));
        });
    }
}
exports.QuantumFieldElement = QuantumFieldElement;


/***/ }),

/***/ "./src/ts/ui/custom_elements/ResourceGainElement.ts":
/*!**********************************************************!*\
  !*** ./src/ts/ui/custom_elements/ResourceGainElement.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourceGainElement = void 0;
class ResourceGainElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.style.top = this.getAttribute("x") + "px";
        this.style.left = this.getAttribute("y") + "px";
        let type = this.getAttribute("type");
        let particle = document.createElement("div");
        particle.classList.add("particle");
        particle.classList.add(type);
        particle.classList.add(this.getAttribute("color"));
        if (["up", "down", "strange", "charm", "top", "bottom"].includes(type)) {
            particle.classList.add("quark");
        }
        let amount = document.createElement("span");
        amount.innerText = ` + ${this.getAttribute("amount")}`;
        this.appendChild(particle);
        this.appendChild(amount);
        setTimeout(() => {
            this.remove();
        }, 2000);
    }
}
exports.ResourceGainElement = ResourceGainElement;


/***/ }),

/***/ "./src/ts/ui/custom_elements/ToolTip.ts":
/*!**********************************************!*\
  !*** ./src/ts/ui/custom_elements/ToolTip.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolTip = void 0;
class ToolTip extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.parentElement.style.position = "relative";
    }
}
exports.ToolTip = ToolTip;


/***/ }),

/***/ "./src/ts/ui/custom_elements/TranslatedElement.ts":
/*!********************************************************!*\
  !*** ./src/ts/ui/custom_elements/TranslatedElement.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslatedElement = void 0;
const i18n_1 = __webpack_require__(/*! ../../i18n/i18n */ "./src/ts/i18n/i18n.ts");
const Settings_1 = __webpack_require__(/*! ../../utils/Settings */ "./src/ts/utils/Settings.ts");
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/ts/utils/utils.ts");
class TranslatedElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let lang = Settings_1.Settings.get().general.settings.language.value;
        let translated = utils_1.Utils.getNestedProperty(i18n_1.translations[lang], this.innerText.toLowerCase());
        if (translated) {
            this.innerText = translated;
        }
    }
}
exports.TranslatedElement = TranslatedElement;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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akJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSxxRUFBOEI7QUFFOUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxXQUFJLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy90cy9TYXZlSGFuZGxlci9TYXZlSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvaTE4bi9pMThuLnRzIiwid2VicGFjazovLy8uL3NyYy90cy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9XYXZlLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9jdXN0b21fZWxlbWVudHMvUXVhbnR1bUZpZWxkRWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvY3VzdG9tX2VsZW1lbnRzL1Jlc291cmNlR2FpbkVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL2N1c3RvbV9lbGVtZW50cy9Ub29sVGlwLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9jdXN0b21fZWxlbWVudHMvVHJhbnNsYXRlZEVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3V0aWxzL0xvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3V0aWxzL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2F2ZUZpbGUgfSBmcm9tIFwiLi4vdHlwZXMvU2F2ZUZpbGVcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi91dGlscy9TZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhdmVIYW5kbGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHNhdmU6IFNhdmVGaWxlO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERhdGEoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiTG9hZGluZyBzYXZlIGZpbGUuLi5cIik7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVGaWxlXCIpO1xyXG4gICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIk5vIHNhdmUgZGF0YSBmb3VuZCFcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zYXZlID0gSlNPTi5wYXJzZSh0aGlzLmRlY29kZShkYXRhKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNhdmVEYXRhKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5lbmNvZGUoSlNPTi5zdHJpbmdpZnkodGhpcy5zYXZlKSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlRmlsZVwiLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldERhdGEoKTogU2F2ZUZpbGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNhdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKCk6IFNhdmVGaWxlIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJJbml0aWFsaXppbmcgbmV3IHNhdmUgZmlsZS4uLlwiKTtcclxuICAgICAgICB0aGlzLnNhdmUgPSB7XHJcbiAgICAgICAgICAgIHNldHRpbmdzOiBTZXR0aW5ncy5kZWZhdWx0KCksXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNhdmVEYXRhKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbmNvZGUoZGF0YTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJFbmNvZGluZyBzYXZlIGRhdGEuLi5cIik7XHJcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGVuY29kaW5nIGxvZ2ljXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZGVjb2RlKGRhdGE6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiRGVjb2Rpbmcgc2F2ZSBkYXRhLi4uXCIpO1xyXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkZWNvZGluZyBsb2dpY1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRyYW5zbGF0aW9uTWFwIH0gZnJvbSBcIi4uL3R5cGVzL1RyYW5zbGF0aW9uc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25NYXAgPSB7XHJcbiAgICBcImVuXCI6IHtcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBnZW5lcmFsOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJHZW5lcmFsIHNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBub1RhYkhpc3Rvcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgdGFiIGhpc3RvcnlcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEb2Vzbid0IHNhdmUgY2hhbmdpbmcgYmV0d2VlbiB0YWJzIGluIHRoZSBicm93c2VyIGhpc3RvcnksIHNvIHRoZSBiYWNrIGJ1dHRvbiBsZWF2ZXMgdGhpcyBwYWdlIGluc3RlYWRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJMYW5ndWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnYW1lcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiR2FtZXBsYXkgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG5vT2ZmbGluZVRpbWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgb2ZmbGluZSB0aW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRpc3BsYXkgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIGRhcmtOYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJEYXJrIGhlYWRlciAmIGZvb3RlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNoYW5nZXMgdGhlIGNvbG9yIG9mIGhlYWRlciAmIGZvb3RlciB0byBiZSB0aGUgc2FtZSBhcyB0aGUgdGhlbWUgYmFja2dyb3VuZCBjb2xvclwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWJ1Zzoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVidWcgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIGxvZ2dpbmc6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkVuYWJsZSBsb2dnaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2ZXJib3NlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJWZXJib3NlIGxvZ2dpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvb3Rlcjoge1xyXG4gICAgICAgICAgICAgICAgZmVybWlvbnM6IFwiRmVybWlvbnNcIixcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IFwiR2VuZXJhdGlvbiBJXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kOiBcIkdlbmVyYXRpb24gSUlcIixcclxuICAgICAgICAgICAgICAgICAgICB0aGlyZDogXCJHZW5lcmF0aW9uIElJSVwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHF1YXJrczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiVXAgUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkb3duOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRG93biBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJtOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQ2hhcm0gUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdHJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiU3RyYW5nZSBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlRvcCBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkJvdHRvbSBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGxlcHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVjdHJvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkVsZWN0cm9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbXVvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIk11b25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0YXU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJUYXVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib3NvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2dzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiSGlnZ3MgQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBnbHVvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkdsdW9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGhvdG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiUGhvdG9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgd19wbHVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiV+KBuiBCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHdfbWludXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJX4oG7IEJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgejoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlrigbAgQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHsgUXVhbnR1bUZpZWxkRWxlbWVudCwgUmlwcGxlRXZlbnQgfSBmcm9tIFwiLi91aS9jdXN0b21fZWxlbWVudHMvUXVhbnR1bUZpZWxkRWxlbWVudFwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVkRWxlbWVudCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9UcmFuc2xhdGVkRWxlbWVudFwiO1xyXG5pbXBvcnQgeyB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi9pMThuL2kxOG5cIjtcclxuaW1wb3J0IHsgU2F2ZUhhbmRsZXIgfSBmcm9tIFwiLi9TYXZlSGFuZGxlci9TYXZlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBXYXZlIH0gZnJvbSBcIi4vdWkvV2F2ZVwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuL3V0aWxzL1NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vdXRpbHMvdXRpbHNcIjtcclxuaW1wb3J0IHsgVG9vbFRpcCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9Ub29sVGlwXCI7XHJcbmltcG9ydCB7IFJlc291cmNlR2FpbkVsZW1lbnQgfSBmcm9tIFwiLi91aS9jdXN0b21fZWxlbWVudHMvUmVzb3VyY2VHYWluRWxlbWVudFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1haW4gPSAoKSA9PiB7XHJcbiAgICBpZiAoIVNhdmVIYW5kbGVyLmxvYWREYXRhKCkpIHtcclxuICAgICAgICBTYXZlSGFuZGxlci5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRhdGEgPSBTYXZlSGFuZGxlci5nZXREYXRhKCk7XHJcbiAgICBTZXR0aW5ncy5zZXQoZGF0YS5zZXR0aW5ncyk7XHJcblxyXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidHJhbnNsYXRlZC1zdHJpbmdcIiwgVHJhbnNsYXRlZEVsZW1lbnQpO1xyXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwicXVhbnR1bS1maWVsZFwiLCBRdWFudHVtRmllbGRFbGVtZW50KTtcclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInJlc291cmNlLWdhaW5cIiwgUmVzb3VyY2VHYWluRWxlbWVudCk7XHJcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0b29sLXRpcFwiLCBUb29sVGlwKTtcclxuXHJcbiAgICBsZXQgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1YXJrLWZpZWxkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJyaXBwbGVcIiwgKGU6IEN1c3RvbUV2ZW50SW5pdDxSaXBwbGVFdmVudD4pID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJpcHBsZVwiLCBlLmRldGFpbC5pZClcclxuICAgIH0pXHJcblxyXG4gICAgbGV0IHJlc291cmNlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNvdXJjZS1nYWluLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tcIik7XHJcbiAgICAgICAgbGV0IHJlc291cmNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInJlc291cmNlLWdhaW5cIik7XHJcbiAgICAgICAgcmVzb3VyY2Uuc2V0QXR0cmlidXRlKFwieFwiLCBcIjQwMFwiKTtcclxuICAgICAgICByZXNvdXJjZS5zZXRBdHRyaWJ1dGUoXCJ5XCIsIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlc291cmNlQ29udGFpbmVyLmNsaWVudFdpZHRoKSArIFwiXCIpO1xyXG4gICAgICAgIHJlc291cmNlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgW1widXBcIiwgXCJkb3duXCIsIFwic3RyYW5nZVwiLCBcImNoYXJtXCIsIFwidG9wXCIsIFwiYm90dG9tXCIsIFwiZWxlY3Ryb25cIiwgXCJtdW9uXCIsIFwidGF1XCJdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDkpXSk7XHJcbiAgICAgICAgcmVzb3VyY2Uuc2V0QXR0cmlidXRlKFwiY29sb3JcIiwgW1wicmVkXCIsIFwiZ3JlZW5cIiwgXCJibHVlXCJdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpXSk7XHJcbiAgICAgICAgcmVzb3VyY2Uuc2V0QXR0cmlidXRlKFwiYW1vdW50XCIsIFwiMS4zNGUxN1wiKTtcclxuICAgICAgICByZXNvdXJjZUNvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZSk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIHJlYWR5XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vdXRpbHMvdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXYXZlIHtcclxuICAgIHByaXZhdGUgY29uZmlnOiBXYXZlQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb2ludHM6IFdhdmVQb2ludFtdID0gW107XHJcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSB0aW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBob3ZlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSByaXBwbGVzOiBSaXBwbGVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50LCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBjb25maWc6IFdhdmVDb25maWcsIGF1dG9TdGFydDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tIb3ZlcihlLmNsaWVudFkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaG92ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZShlLmNsaWVudFgsIGZhbHNlLCAyMCwgMTAsIDAuMDUsIDE1KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsYXNzTGlzdC5hZGQoXCJob3ZlcmVkXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaG92ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlKGUuY2xpZW50WCwgdHJ1ZSwgMTYwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmhlaWdodCA9IGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5yaXBwbGVEZWxheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnJpcHBsZURlbGF5ID0gMTUwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5vZmZzZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5vZmZzZXQgPSB0aGlzLmNvbmZpZy5oZWlnaHQgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZXNpemUoKTtcclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcblxyXG4gICAgICAgIGlmIChhdXRvU3RhcnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrSG92ZXIoeTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHkgPiB0aGlzLmNvbmZpZy5vZmZzZXQgKyAxMDAgJiYgeSA8IHRoaXMuY29uZmlnLm9mZnNldCArIDE1MDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZVJlc2l6ZSgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY29uZmlnLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogV2F2ZUNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBbXBsaXR1ZGUoYW1wbGl0dWRlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZy5hbXBsaXR1ZGUgPSBhbXBsaXR1ZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEFtcGxpdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5hbXBsaXR1ZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEZyZXF1ZW5jeShmcmVxdWVuY3k6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLmZyZXF1ZW5jeSA9IGZyZXF1ZW5jeTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RnJlcXVlbmN5KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmZyZXF1ZW5jeTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0U3BlZWQoc3BlZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLnNwZWVkID0gc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNwZWVkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYW51cFJpcHBsZXMoKSB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgY29uc3QgdGhyZXNob2xkID0gMC4wMTtcclxuXHJcbiAgICAgICAgdGhpcy5yaXBwbGVzID0gdGhpcy5yaXBwbGVzLmZpbHRlcihyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWdlID0gKG5vdyAtIHIuc3RhcnRUaW1lKSAvIDEwMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXBVcFRpbWUgPSAwLjU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXAgPSBNYXRoLm1pbigxLCBhZ2UgLyByYW1wVXBUaW1lKTtcclxuICAgICAgICAgICAgY29uc3QgZWFzZWRSYW1wID0gTWF0aC5zaW4oKHJhbXAgKiBNYXRoLlBJKSAvIDIpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wYWdhdGlvbiA9IGFnZSAqIHIuc3BlZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhbGxvZmYgPSBNYXRoLmV4cCgtci5kZWNheSAqIE1hdGgucG93KDAgLSBwcm9wYWdhdGlvbiwgMikpO1xyXG4gICAgICAgICAgICBjb25zdCBwb3RlbnRpYWxBbXBsaXR1ZGUgPSByLnN0cmVuZ3RoICogZWFzZWRSYW1wICogZmFsbG9mZjtcclxuICAgICAgICAgICAgcmV0dXJuIHBvdGVudGlhbEFtcGxpdHVkZSA+IHRocmVzaG9sZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHNlbGYudGltZSA9IHNlbGYuY29uZmlnLnNwZWVkICogKCh0aW1lc3RhbXAgLSBzdGFydCkgLyAxMCk7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhdyhzZWxmLnRpbWUpO1xyXG4gICAgICAgICAgICBzZWxmLmNsZWFudXBSaXBwbGVzKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmNvbmZpZy5wb2ludENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB4OiBpLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBNYXRoLnJhbmRvbSgpICogMTAwMCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0WShpOiBudW1iZXIsIHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNbaV07XHJcbiAgICAgICAgY29uc3QgYmFzZU5vaXNlID1cclxuICAgICAgICAgICAgTWF0aC5zaW4oKHBvaW50Lm9mZnNldCArIHRpbWUpICogdGhpcy5jb25maWcuZnJlcXVlbmN5KSAqIDAuNiArXHJcbiAgICAgICAgICAgIE1hdGguc2luKChwb2ludC5vZmZzZXQgKiAwLjUgKyB0aW1lICogMC44KSAqIHRoaXMuY29uZmlnLmZyZXF1ZW5jeSkgKiAwLjQ7XHJcblxyXG4gICAgICAgIGxldCByaXBwbGVPZmZzZXQgPSAwO1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCByIG9mIHRoaXMucmlwcGxlcykge1xyXG4gICAgICAgICAgICBjb25zdCBhZ2UgPSAobm93IC0gci5zdGFydFRpbWUpIC8gMTAwMDtcclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhpIC0gci5pbmRleCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BhZ2F0aW9uID0gYWdlICogci5zcGVlZDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZhbGxvZmYgPSBNYXRoLmV4cCgtci5kZWNheSAqIE1hdGgucG93KGRpc3RhbmNlIC0gcHJvcGFnYXRpb24sIDIpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXBVcFRpbWUgPSAwLjU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXAgPSBNYXRoLm1pbigxLCBhZ2UgLyByYW1wVXBUaW1lKTsgXHJcbiAgICAgICAgICAgIGNvbnN0IGVhc2VkUmFtcCA9IE1hdGguc2luKChyYW1wICogTWF0aC5QSSkgLyAyKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHdhdmUgPSBNYXRoLnNpbihkaXN0YW5jZSAtIHByb3BhZ2F0aW9uKTtcclxuICAgICAgICAgICAgcmlwcGxlT2Zmc2V0ICs9IHIuc3RyZW5ndGggKiBlYXNlZFJhbXAgKiBmYWxsb2ZmICogd2F2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5vZmZzZXQgKyAoYmFzZU5vaXNlICogdGhpcy5jb25maWcuYW1wbGl0dWRlICsgcmlwcGxlT2Zmc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXcodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgdGhpcy5jb25maWcuY29sb3Iuc3RhcnQpO1xyXG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCB0aGlzLmNvbmZpZy5jb2xvci5lbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gVXRpbHMuaGV4VG9SR0IodGhpcy5ob3ZlciA/IHRoaXMuY29uZmlnLmNvbG9yLmhvdmVyIDogdGhpcy5jb25maWcuY29sb3IuZ2xvdyk7XHJcbiAgICAgICAgdGhpcy5jdHguc2hhZG93Qmx1ciA9IDEwO1xyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd09mZnNldFkgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGdyYWRpZW50O1xyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aDtcclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcFggPSB0aGlzLmNhbnZhcy53aWR0aCAvICh0aGlzLmNvbmZpZy5wb2ludENvdW50IC0gMSk7XHJcblxyXG4gICAgICAgIGxldCBwcmV2WCA9IDA7XHJcbiAgICAgICAgbGV0IHByZXZZID0gdGhpcy5nZXRZKDAsIHRpbWUpO1xyXG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhwcmV2WCwgcHJldlkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuY29uZmlnLnBvaW50Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyWCA9IGkgKiBzdGVwWDtcclxuICAgICAgICAgICAgY29uc3QgY3VyclkgPSB0aGlzLmdldFkoaSwgdGltZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtaWRYID0gKHByZXZYICsgY3VyclgpIC8gMjtcclxuICAgICAgICAgICAgY29uc3QgbWlkWSA9IChwcmV2WSArIGN1cnJZKSAvIDI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHByZXZYLCBwcmV2WSwgbWlkWCwgbWlkWSk7XHJcblxyXG4gICAgICAgICAgICBwcmV2WCA9IGN1cnJYO1xyXG4gICAgICAgICAgICBwcmV2WSA9IGN1cnJZO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHByZXZYLCBwcmV2WSk7XHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJpcHBsZSh4OiBudW1iZXIsIG1hbnVhbDogYm9vbGVhbiA9IGZhbHNlLCBzdHJlbmd0aDogbnVtYmVyID0gMTIwLCBzcGVlZDogbnVtYmVyID0gMTAsIGRlY2F5OiBudW1iZXIgPSAwLjA1LCBtYXg6IG51bWJlciA9IDEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJpcHBsZVwiKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5yaXBwbGVzLmZpbHRlcigocjogUmlwcGxlKSA9PiByLm1hbnVhbCA9PT0gbWFudWFsKS5sZW5ndGggPj0gbWF4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigoeCAvIHRoaXMuY2FudmFzLndpZHRoKSAqIHRoaXMuY29uZmlnLnBvaW50Q291bnQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcucmlwcGxlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yaXBwbGVDYWxsYmFjayhtYW51YWwsIHRoaXMuY29uZmlnLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJpcHBsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IHBlcmZvcm1hbmNlLm5vdygpLFxyXG4gICAgICAgICAgICBzdHJlbmd0aCxcclxuICAgICAgICAgICAgc3BlZWQsXHJcbiAgICAgICAgICAgIGRlY2F5LFxyXG4gICAgICAgICAgICBtYW51YWwsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdhdmVDb25maWcge1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbiAgICBhbXBsaXR1ZGU6IG51bWJlcjtcclxuICAgIGZyZXF1ZW5jeTogbnVtYmVyO1xyXG4gICAgc3BlZWQ6IG51bWJlcjtcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyO1xyXG4gICAgY29sb3I6IFdhdmVDb2xvcjtcclxuICAgIHBvaW50Q291bnQ6IG51bWJlcjtcclxuICAgIGhlaWdodD86IG51bWJlcjtcclxuICAgIG9mZnNldD86IG51bWJlcjtcclxuICAgIHJpcHBsZURlbGF5PzogbnVtYmVyO1xyXG4gICAgcmlwcGxlQ2FsbGJhY2s/OiAobWFudWFsOiBib29sZWFuLCBpZD86IHN0cmluZykgPT4gYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXYXZlQ29sb3Ige1xyXG4gICAgc3RhcnQ6IHN0cmluZztcclxuICAgIGVuZDogc3RyaW5nO1xyXG4gICAgZ2xvdzogc3RyaW5nO1xyXG4gICAgaG92ZXI6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFdhdmVQb2ludCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFJpcHBsZSB7XHJcbiAgICBpbmRleDogbnVtYmVyO1xyXG4gICAgc3RhcnRUaW1lOiBudW1iZXI7XHJcbiAgICBzdHJlbmd0aDogbnVtYmVyO1xyXG4gICAgc3BlZWQ6IG51bWJlcjtcclxuICAgIGRlY2F5OiBudW1iZXI7XHJcbiAgICBtYW51YWw6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgV2F2ZSwgV2F2ZUNvbG9yIH0gZnJvbSBcIi4uL1dhdmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWFudHVtRmllbGRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSB3YXZlczogV2F2ZVtdID0gW107XHJcbiAgICBwcml2YXRlIGNhbnZhc2VzOiBIVE1MQ2FudmFzRWxlbWVudFtdID0gW107XHJcbiAgICBwcml2YXRlIGNvbG9yczogV2F2ZUNvbG9yW10gPSBbXTtcclxuICAgIHByaXZhdGUgd2hpY2hXYXZlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGlkczogc3RyaW5nW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByaXBwbGUoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4gPSBmYWxzZSwgc3RyZW5ndGg6IG51bWJlciA9IDEyMCwgc3BlZWQ6IG51bWJlciA9IDEwLCBkZWNheTogbnVtYmVyID0gMC4wNSwgbWF4OiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgdGhpcy53YXZlcy5mb3JFYWNoKHdhdmUgPT4geyB3YXZlLnJpcHBsZSh4LCBtYW51YWwsIHN0cmVuZ3RoLCBzcGVlZCwgZGVjYXksIG1heCkgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgICAgbGV0IGFtb3VudCA9IHBhcnNlSW50KHRoaXMucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpZWxkc1wiKSk7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9ICh0aGlzLnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gKGFtb3VudCArIDEpKSAqIHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKFwiaW5kZXhcIikpO1xyXG4gICAgICAgICh0aGlzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmaWVsZC1sYWJlbFwiKVswXSBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUudG9wID0gKG9mZnNldCAtIDYwKSArIFwicHhcIjtcclxuICAgICAgICBsZXQgaGFuZGxlUmlwcGxlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcInJhaW5ib3dcIikge1xyXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0RHJvcCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW1wicmVkXCIsIFwiZ3JlZW5cIiwgXCJibHVlXCJdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGFuZGxlUmlwcGxlID0gKG1hbnVhbDogYm9vbGVhbiwgaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFtYW51YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWQgPT09IHRoaXMuaWRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGljaFdhdmUgPSBnZXROZXh0RHJvcCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLndoaWNoV2F2ZSA9PT0gXCJhbGxcIiB8fCBpZC5pbmNsdWRlcyh0aGlzLndoaWNoV2F2ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50PFJpcHBsZUV2ZW50PihcInJpcHBsZVwiLCB7IGRldGFpbDogeyBtYW51YWwsIGlkIH0gfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb2xvcnMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IFwiIzAwMDBmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuZDogXCIjMDBmZmZmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xvdzogXCIjMDBmZmZmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaG92ZXI6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDogXCIjMDBmZjAwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kOiBcIiMwMGZmZmZcIixcclxuICAgICAgICAgICAgICAgICAgICBnbG93OiBcIiMwMGZmMDBcIixcclxuICAgICAgICAgICAgICAgICAgICBob3ZlcjogXCIjZmZmZmZmXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBcIiNmZjAwMDBcIixcclxuICAgICAgICAgICAgICAgICAgICBlbmQ6IFwiI2ZmMDBmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGdsb3c6IFwiI2ZmMDBmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGhvdmVyOiBcIiNmZmZmZmZcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmlkcyA9IFtgJHt0aGlzLmlkfS1ibHVlYCwgYCR7dGhpcy5pZH0tZ3JlZW5gLCBgJHt0aGlzLmlkfS1yZWRgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBoYW5kbGVSaXBwbGUgPSAobWFudWFsOiBib29sZWFuLCBpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50PFJpcHBsZUV2ZW50PihcInJpcHBsZVwiLCB7IGRldGFpbDogeyBtYW51YWwsIGlkIH0gfSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBjID0ge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3Itc3RhcnRcIiksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3ItZW5kXCIpLFxyXG4gICAgICAgICAgICAgICAgZ2xvdzogdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvci1nbG93XCIpLFxyXG4gICAgICAgICAgICAgICAgaG92ZXI6IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3ItaG92ZXJcIikgfHwgXCIjZmZmZmZmXCIsXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JzID0gW2MsIGMsIGNdO1xyXG4gICAgICAgICAgICB0aGlzLmlkcyA9IFt0aGlzLmlkLCBcIlwiLCBcIlwiXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3JzLmZvckVhY2goKGNvbG9yLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhc2VzLnB1c2goZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXNlc1tpbmRleF0pO1xyXG4gICAgICAgICAgICB0aGlzLndhdmVzLnB1c2gobmV3IFdhdmUodGhpcy5jYW52YXNlc1tpbmRleF0sIHRoaXMucGFyZW50RWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgYW1wbGl0dWRlOiAyMCxcclxuICAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogMSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjAyLFxyXG4gICAgICAgICAgICAgICAgbGluZVdpZHRoOiAzLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDogY29sb3Iuc3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kOiBjb2xvci5lbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xvdzogY29sb3IuZ2xvdyxcclxuICAgICAgICAgICAgICAgICAgICBob3ZlcjogY29sb3IuaG92ZXIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnRDb3VudDogMTAsXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcclxuICAgICAgICAgICAgICAgIHJpcHBsZUNhbGxiYWNrOiBoYW5kbGVSaXBwbGUsXHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5pZHNbaW5kZXhdLFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlRXZlbnQge1xyXG4gICAgbWFudWFsOiBib29sZWFuO1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgdHJhbnNsYXRpb25zIH0gZnJvbSBcIi4uLy4uL2kxOG4vaTE4blwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi91dGlscy9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi8uLi91dGlscy91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlR2FpbkVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIHRoaXMuc3R5bGUudG9wID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ4XCIpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwieVwiKSArIFwicHhcIjtcclxuXHJcbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcbiAgICAgICAgbGV0IHBhcnRpY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc0xpc3QuYWRkKFwicGFydGljbGVcIik7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NMaXN0LmFkZCh0eXBlKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc0xpc3QuYWRkKHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3JcIikpO1xyXG5cclxuICAgICAgICBpZiAoW1widXBcIiwgXCJkb3duXCIsIFwic3RyYW5nZVwiLCBcImNoYXJtXCIsIFwidG9wXCIsIFwiYm90dG9tXCJdLmluY2x1ZGVzKHR5cGUpKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLmNsYXNzTGlzdC5hZGQoXCJxdWFya1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhbW91bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBhbW91bnQuaW5uZXJUZXh0ID0gYCArICR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJhbW91bnRcIil9YDtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChwYXJ0aWNsZSlcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGFtb3VudClcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFRvb2xUaXAgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi4vLi4vaTE4bi9pMThuXCI7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL1NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlZEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIGxldCBsYW5nID0gU2V0dGluZ3MuZ2V0KCkuZ2VuZXJhbC5zZXR0aW5ncy5sYW5ndWFnZS52YWx1ZTtcclxuICAgICAgICBsZXQgdHJhbnNsYXRlZCA9IFV0aWxzLmdldE5lc3RlZFByb3BlcnR5KHRyYW5zbGF0aW9uc1tsYW5nXSwgdGhpcy5pbm5lclRleHQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgIGlmICh0cmFuc2xhdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXJUZXh0ID0gdHJhbnNsYXRlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi9TZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvZyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MubG9nZ2luZy52YWx1ZSkgY29uc29sZS5sb2coYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUuZXJyb3IoYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgd2FybmluZyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MubG9nZ2luZy52YWx1ZSkgY29uc29sZS53YXJuKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlYnVnKGNvbnRleHQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChTZXR0aW5ncy5nZXQoKSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy5sb2dnaW5nLnZhbHVlICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLnZlcmJvc2UudmFsdWUpIGNvbnNvbGUuZGVidWcoYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFNhdmVIYW5kbGVyIH0gZnJvbSAnLi4vU2F2ZUhhbmRsZXIvU2F2ZUhhbmRsZXInO1xyXG5pbXBvcnQgdHlwZSB7IFNldHRpbmdzIGFzIFNldHRpbmdzVHlwZSB9IGZyb20gJy4uL3R5cGVzL1NldHRpbmdzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBzZXR0aW5nczogU2V0dGluZ3NUeXBlO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdCgpOiBTZXR0aW5nc1R5cGUge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdlbmVyYWw6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInNldHRpbmdzLmdlbmVyYWwudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmdlbmVyYWwubGFuZ3VhZ2UubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbm9UYWJIaXN0b3J5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZ2VuZXJhbC5ub1RhYkhpc3RvcnkubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJzZXR0aW5ncy5nZW5lcmFsLm5vVGFiSGlzdG9yeS5kZXNjcmlwdGlvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2FtZXBsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInNldHRpbmdzLmdhbWVwbGF5LnRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vT2ZmbGluZVRpbWU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5nYW1lcGxheS5ub09mZmxpbmVUaW1lLm5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInNldHRpbmdzLmRpc3BsYXkudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGFya05hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kaXNwbGF5LmRhcmtOYXZpZ2F0aW9uLm5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlYnVnOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5kZWJ1Zy50aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmRlYnVnLmxvZ2dpbmcubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmVyYm9zZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmRlYnVnLnZlcmJvc2UubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCgpOiBTZXR0aW5nc1R5cGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0KHNldHRpbmdzOiBTZXR0aW5nc1R5cGUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gey4uLnRoaXMuc2V0dGluZ3MsIC4uLnNldHRpbmdzfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IHJlc2V0IGxvZ2ljXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuZGVmYXVsdCgpO1xyXG4gICAgICAgIFNhdmVIYW5kbGVyLnNhdmVEYXRhKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IG5hbWVzcGFjZSBVdGlscyB7XHJcbiAgICBleHBvcnQgY29uc3QgZ2V0TmVzdGVkUHJvcGVydHkgPSAob2JqOiBhbnksIHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykucmVkdWNlKChhY2MsIGtleSkgPT4gYWNjPy5ba2V5XSwgb2JqKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgaGV4VG9SR0IgPSAoaGV4OiBzdHJpbmcsIGFscGhhPzogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgbGV0IG5vSGFzaCA9IGhleC5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcclxuICAgICAgICBsZXQgciA9IHBhcnNlSW50KG5vSGFzaC5zbGljZSgwLCAyKSwgMTYpLFxyXG4gICAgICAgICAgICBnID0gcGFyc2VJbnQobm9IYXNoLnNsaWNlKDIsIDQpLCAxNiksXHJcbiAgICAgICAgICAgIGIgPSBwYXJzZUludChub0hhc2guc2xpY2UoNCwgNiksIDE2KTtcclxuXHJcbiAgICAgICAgaWYgKGFscGhhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgXCIgKyBhbHBoYSArIFwiKVwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJnYihcIiArIHIgKyBcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiKVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgbWFpbiB9IGZyb20gXCIuL21haW5cIjtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBtYWluKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9