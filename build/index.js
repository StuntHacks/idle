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
const ResourceGainHandler_1 = __webpack_require__(/*! ./ui/ResourceGainHandler */ "./src/ts/ui/ResourceGainHandler.ts");
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
    ResourceGainHandler_1.ResourceGainHandler.initialize("resource-gain-container");
    let fields = document.getElementsByTagName("quantum-field");
    for (let i = 0; i < fields.length; i++) {
        fields[i].addEventListener("ripple", function (e) {
            if (e.detail.manual && JSON.stringify(e.detail.particle)) {
                console.log("ripple", JSON.stringify(e.detail.particle), e.detail.manual, e.detail.x, e.detail.y);
                ResourceGainHandler_1.ResourceGainHandler.gainResource(ResourceGainHandler_1.ResourceGainHandler.getResourceFromField(e.detail.particle), (e.detail.x - 10), (e.detail.y + 100));
            }
        });
    }
    document.getElementsByTagName("body")[0].classList.remove("loading");
};
exports.main = main;


/***/ }),

/***/ "./src/ts/ui/ResourceGainHandler.ts":
/*!******************************************!*\
  !*** ./src/ts/ui/ResourceGainHandler.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourceGainHandler = void 0;
class ResourceGainHandler {
    static initialize(id = "resource-gain-container") {
        this.container = document.getElementById(id);
    }
    static gainResource(resource, x, y) {
        let element = document.createElement("resource-gain");
        element.setAttribute("x", x + "");
        element.setAttribute("y", y + "");
        if (resource.type) {
            element.setAttribute("type", resource.type.toString());
        }
        if (resource.color) {
            element.setAttribute("color", resource.color.toString());
        }
        if (resource.flavor) {
            element.setAttribute("flavor", resource.flavor.toString());
        }
        element.setAttribute("amount", "1.34e17");
        this.container.appendChild(element);
    }
    static getResourceFromField(particle) {
        let flavor = ParticleFlavor[particle.flavor];
        let color = ParticleColor[particle.color];
        let type = ParticleType[particle.type];
        if (particle.type === "Quark") {
            return {
                type,
                color,
                flavor: [ParticleFlavor.Up, ParticleFlavor.Down][Math.floor(Math.random() * 2)]
            };
        }
        return { type, flavor, color };
    }
}
exports.ResourceGainHandler = ResourceGainHandler;
var ParticleType;
(function (ParticleType) {
    ParticleType["Quark"] = "quark";
    ParticleType["Lepton"] = "lepton";
    ParticleType["Boson"] = "boson";
})(ParticleType || (ParticleType = {}));
var ParticleFlavor;
(function (ParticleFlavor) {
    ParticleFlavor["Electron"] = "electron";
    ParticleFlavor["Muon"] = "muon";
    ParticleFlavor["Tau"] = "tau";
    ParticleFlavor["Up"] = "up";
    ParticleFlavor["Down"] = "down";
    ParticleFlavor["Strange"] = "stange";
    ParticleFlavor["Charm"] = "charm";
    ParticleFlavor["Top"] = "top";
    ParticleFlavor["Bottom"] = "bottom";
    ParticleFlavor["Gluon"] = "gluon";
    ParticleFlavor["Photon"] = "photon";
    ParticleFlavor["WPlus"] = "w-plus";
    ParticleFlavor["WMinus"] = "w-minus";
    ParticleFlavor["Z"] = "z";
    ParticleFlavor["Higgs"] = "higgs";
})(ParticleFlavor || (ParticleFlavor = {}));
var ParticleColor;
(function (ParticleColor) {
    ParticleColor["Red"] = "red";
    ParticleColor["Green"] = "green";
    ParticleColor["Blue"] = "blue";
    ParticleColor["RGB"] = "rgb";
})(ParticleColor || (ParticleColor = {}));


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
        const threshold = 0.0001;
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
        if (this.ripples.filter((r) => r.manual === manual).length >= max) {
            return false;
        }
        const index = Math.floor((x / this.canvas.width) * this.config.pointCount);
        if (this.config.rippleCallback) {
            if (!this.config.rippleCallback(x, manual, this.config.particle)) {
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
        this.particles = [];
    }
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05, max = 1) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay, max); });
    }
    connectedCallback() {
        const amount = parseInt(this.parentElement.getAttribute("data-fields"));
        const offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        this.getElementsByClassName("field-label")[0].style.top = (offset - 60) + "px";
        let width = 3;
        this.random = this.getAttribute("random") === "true";
        if (this.getAttribute("all") === "true") {
            this.all = {
                type: this.getAttribute("all-type"),
                flavor: this.getAttribute("all-flavor"),
                color: this.getAttribute("all-color"),
                all: true,
            };
        }
        const getNextDrop = () => {
            if (this.all) {
                if (Math.random() < 0.1) {
                    return this.all;
                }
            }
            return this.particles[Math.floor(Math.random() * this.particles.length)];
        };
        const handleRipple = (x, manual, particle) => {
            if (!manual) {
                return true;
            }
            if (this.random) {
                if (JSON.stringify(particle) === JSON.stringify(this.particles[0])) {
                    this.whichWave = getNextDrop();
                    this.dispatchEvent(new CustomEvent("ripple", { detail: { x, y: offset, manual, particle: this.whichWave } }));
                }
                if (JSON.stringify(particle) === JSON.stringify(this.whichWave) || this.whichWave.all) {
                    return true;
                }
                return false;
            }
            this.dispatchEvent(new CustomEvent("ripple", { detail: { x, y: offset, manual, particle } }));
            return true;
        };
        if (this.getAttribute("type") === "thick") {
            width = 20;
        }
        let fields = this.getElementsByClassName("field");
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let p = {
                type: field.getAttribute("data-type"),
                flavor: field.getAttribute("data-flavor"),
                color: field.getAttribute("data-color"),
            };
            this.particles.push(p);
            this.canvases.push(document.createElement("canvas"));
            this.appendChild(this.canvases[i]);
            this.waves.push(new Wave_1.Wave(this.canvases[i], this.parentElement, {
                amplitude: 20,
                frequency: 1,
                speed: 0.02,
                lineWidth: width,
                color: {
                    start: field.getAttribute("data-color-start") || this.getAttribute("color-start"),
                    end: field.getAttribute("data-color-end") || this.getAttribute("color-end"),
                    glow: field.getAttribute("data-color-glow") || this.getAttribute("color-glow"),
                    hover: field.getAttribute("data-color-hover") || this.getAttribute("color-hover") || "#ffffff",
                },
                pointCount: 10,
                offset: offset,
                rippleCallback: handleRipple,
                particle: p,
            }));
        }
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
        this.style.left = this.getAttribute("x") + "px";
        this.style.top = this.getAttribute("y") + "px";
        let type = this.getAttribute("type");
        let flavor = this.getAttribute("flavor");
        let color = this.getAttribute("color");
        let particle = document.createElement("div");
        particle.classList.add("particle");
        particle.classList.add(type);
        particle.classList.add(flavor);
        particle.classList.add(color);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWlCckI7Ozs7Ozs7VUNqQkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7O0FDdEJBLHFFQUE4QjtBQUU5QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFdBQUksQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3RzL1NhdmVIYW5kbGVyL1NhdmVIYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy90cy9pMThuL2kxOG4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL1Jlc291cmNlR2FpbkhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL1dhdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL2N1c3RvbV9lbGVtZW50cy9RdWFudHVtRmllbGRFbGVtZW50LnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9jdXN0b21fZWxlbWVudHMvUmVzb3VyY2VHYWluRWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvY3VzdG9tX2VsZW1lbnRzL1Rvb2xUaXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL2N1c3RvbV9lbGVtZW50cy9UcmFuc2xhdGVkRWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvTG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91dGlscy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy90cy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTYXZlRmlsZSB9IGZyb20gXCIuLi90eXBlcy9TYXZlRmlsZVwiO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi4vdXRpbHMvTG9nZ2VyXCI7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3V0aWxzL1NldHRpbmdzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F2ZUhhbmRsZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2F2ZTogU2F2ZUZpbGU7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkRGF0YSgpOiBib29sZWFuIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJMb2FkaW5nIHNhdmUgZmlsZS4uLlwiKTtcclxuICAgICAgICBsZXQgZGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZUZpbGVcIik7XHJcbiAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiTm8gc2F2ZSBkYXRhIGZvdW5kIVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNhdmUgPSBKU09OLnBhcnNlKHRoaXMuZGVjb2RlKGRhdGEpKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2F2ZURhdGEoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmVuY29kZShKU09OLnN0cmluZ2lmeSh0aGlzLnNhdmUpKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNhdmVGaWxlXCIsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RGF0YSgpOiBTYXZlRmlsZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUoKTogU2F2ZUZpbGUge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkluaXRpYWxpemluZyBuZXcgc2F2ZSBmaWxlLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuc2F2ZSA9IHtcclxuICAgICAgICAgICAgc2V0dGluZ3M6IFNldHRpbmdzLmRlZmF1bHQoKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc2F2ZURhdGEoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zYXZlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGVuY29kZShkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkVuY29kaW5nIHNhdmUgZGF0YS4uLlwiKTtcclxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZW5jb2RpbmcgbG9naWNcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBkZWNvZGUoZGF0YTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJEZWNvZGluZyBzYXZlIGRhdGEuLi5cIik7XHJcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRlY29kaW5nIGxvZ2ljXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVHJhbnNsYXRpb25NYXAgfSBmcm9tIFwiLi4vdHlwZXMvVHJhbnNsYXRpb25zXCI7XHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbk1hcCA9IHtcclxuICAgIFwiZW5cIjoge1xyXG4gICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIGdlbmVyYWw6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkdlbmVyYWwgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG5vVGFiSGlzdG9yeToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRGlzYWJsZSB0YWIgaGlzdG9yeVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkRvZXNuJ3Qgc2F2ZSBjaGFuZ2luZyBiZXR3ZWVuIHRhYnMgaW4gdGhlIGJyb3dzZXIgaGlzdG9yeSwgc28gdGhlIGJhY2sgYnV0dG9uIGxlYXZlcyB0aGlzIHBhZ2UgaW5zdGVhZFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkxhbmd1YWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdhbWVwbGF5OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJHYW1lcGxheSBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbm9PZmZsaW5lVGltZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRGlzYWJsZSBvZmZsaW5lIHRpbWVcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlzcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRGlzcGxheSBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgZGFya05hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRhcmsgaGVhZGVyICYgZm9vdGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ2hhbmdlcyB0aGUgY29sb3Igb2YgaGVhZGVyICYgZm9vdGVyIHRvIGJlIHRoZSBzYW1lIGFzIHRoZSB0aGVtZSBiYWNrZ3JvdW5kIGNvbG9yXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlYnVnOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEZWJ1ZyBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9nZ2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRW5hYmxlIGxvZ2dpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZlcmJvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlZlcmJvc2UgbG9nZ2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdWk6IHtcclxuICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBmZXJtaW9uczogXCJGZXJtaW9uc1wiLFxyXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdDogXCJHZW5lcmF0aW9uIElcIixcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmQ6IFwiR2VuZXJhdGlvbiBJSVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXJkOiBcIkdlbmVyYXRpb24gSUlJXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcXVhcmtzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJVcCBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRvd246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJEb3duIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcm06IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJDaGFybSBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmFuZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJTdHJhbmdlIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiVG9wIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQm90dG9tIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGVwdG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZWN0cm9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRWxlY3Ryb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtdW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiTXVvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRhdToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlRhdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvc29uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaGlnZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJIaWdncyBCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdsdW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiR2x1b25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwaG90b246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJQaG90b25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB3X3BsdXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJX4oG6IEJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgd19taW51czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlfigbsgQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB6OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiWuKBsCBCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBRdWFudHVtRmllbGRFbGVtZW50LCBSaXBwbGVFdmVudCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9RdWFudHVtRmllbGRFbGVtZW50XCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZWRFbGVtZW50IH0gZnJvbSBcIi4vdWkvY3VzdG9tX2VsZW1lbnRzL1RyYW5zbGF0ZWRFbGVtZW50XCI7XHJcbmltcG9ydCB7IHRyYW5zbGF0aW9ucyB9IGZyb20gXCIuL2kxOG4vaTE4blwiO1xyXG5pbXBvcnQgeyBTYXZlSGFuZGxlciB9IGZyb20gXCIuL1NhdmVIYW5kbGVyL1NhdmVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFdhdmUgfSBmcm9tIFwiLi91aS9XYXZlXCI7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4vdXRpbHMvU2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi91dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgeyBUb29sVGlwIH0gZnJvbSBcIi4vdWkvY3VzdG9tX2VsZW1lbnRzL1Rvb2xUaXBcIjtcclxuaW1wb3J0IHsgUmVzb3VyY2VHYWluRWxlbWVudCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9SZXNvdXJjZUdhaW5FbGVtZW50XCI7XHJcbmltcG9ydCB7IFJlc291cmNlR2FpbkhhbmRsZXIgfSBmcm9tIFwiLi91aS9SZXNvdXJjZUdhaW5IYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgbWFpbiA9ICgpID0+IHtcclxuICAgIGlmICghU2F2ZUhhbmRsZXIubG9hZERhdGEoKSkge1xyXG4gICAgICAgIFNhdmVIYW5kbGVyLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGF0YSA9IFNhdmVIYW5kbGVyLmdldERhdGEoKTtcclxuICAgIFNldHRpbmdzLnNldChkYXRhLnNldHRpbmdzKTtcclxuXHJcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0cmFuc2xhdGVkLXN0cmluZ1wiLCBUcmFuc2xhdGVkRWxlbWVudCk7XHJcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJxdWFudHVtLWZpZWxkXCIsIFF1YW50dW1GaWVsZEVsZW1lbnQpO1xyXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwicmVzb3VyY2UtZ2FpblwiLCBSZXNvdXJjZUdhaW5FbGVtZW50KTtcclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRvb2wtdGlwXCIsIFRvb2xUaXApO1xyXG5cclxuICAgIGxldCBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpO1xyXG5cclxuICAgIFJlc291cmNlR2FpbkhhbmRsZXIuaW5pdGlhbGl6ZShcInJlc291cmNlLWdhaW4tY29udGFpbmVyXCIpO1xyXG4gICAgbGV0IGZpZWxkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicXVhbnR1bS1maWVsZFwiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZmllbGRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJyaXBwbGVcIiwgZnVuY3Rpb24gKGU6IEN1c3RvbUV2ZW50SW5pdDxSaXBwbGVFdmVudD4pIHtcclxuICAgICAgICAgICAgaWYgKGUuZGV0YWlsLm1hbnVhbCAmJiBKU09OLnN0cmluZ2lmeShlLmRldGFpbC5wYXJ0aWNsZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmlwcGxlXCIsIEpTT04uc3RyaW5naWZ5KGUuZGV0YWlsLnBhcnRpY2xlKSwgZS5kZXRhaWwubWFudWFsLCBlLmRldGFpbC54LCBlLmRldGFpbC55KTtcclxuICAgICAgICAgICAgICAgIFJlc291cmNlR2FpbkhhbmRsZXIuZ2FpblJlc291cmNlKFJlc291cmNlR2FpbkhhbmRsZXIuZ2V0UmVzb3VyY2VGcm9tRmllbGQoZS5kZXRhaWwucGFydGljbGUpLCAoZS5kZXRhaWwueCAtIDEwKSwgKGUuZGV0YWlsLnkgKyAxMDApKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVhZHlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXS5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKTtcclxufVxyXG4iLCJpbXBvcnQgeyBXYXZlUGFydGljbGVJbmZvIH0gZnJvbSBcIi4vV2F2ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlR2FpbkhhbmRsZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBjb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZShpZDogc3RyaW5nID0gXCJyZXNvdXJjZS1nYWluLWNvbnRhaW5lclwiKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnYWluUmVzb3VyY2UocmVzb3VyY2U6IFJlc291cmNlLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInJlc291cmNlLWdhaW5cIik7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHggKyBcIlwiKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInlcIiwgeSArIFwiXCIpO1xyXG5cclxuICAgICAgICBpZiAocmVzb3VyY2UudHlwZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgcmVzb3VyY2UudHlwZS50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc291cmNlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY29sb3JcIiwgcmVzb3VyY2UuY29sb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNvdXJjZS5mbGF2b3IpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJmbGF2b3JcIiwgcmVzb3VyY2UuZmxhdm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhbW91bnRcIiwgXCIxLjM0ZTE3XCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmVzb3VyY2VGcm9tRmllbGQocGFydGljbGU6IFdhdmVQYXJ0aWNsZUluZm8pOiBSZXNvdXJjZSB7XHJcbiAgICAgICAgbGV0IGZsYXZvciA9IFBhcnRpY2xlRmxhdm9yW3BhcnRpY2xlLmZsYXZvciBhcyBrZXlvZiB0eXBlb2YgUGFydGljbGVGbGF2b3JdO1xyXG4gICAgICAgIGxldCBjb2xvciA9IFBhcnRpY2xlQ29sb3JbcGFydGljbGUuY29sb3IgYXMga2V5b2YgdHlwZW9mIFBhcnRpY2xlQ29sb3JdO1xyXG4gICAgICAgIGxldCB0eXBlID0gUGFydGljbGVUeXBlW3BhcnRpY2xlLnR5cGUgYXMga2V5b2YgdHlwZW9mIFBhcnRpY2xlVHlwZV07XHJcblxyXG4gICAgICAgIGlmIChwYXJ0aWNsZS50eXBlID09PSBcIlF1YXJrXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgICAgIGZsYXZvcjogW1BhcnRpY2xlRmxhdm9yLlVwLCBQYXJ0aWNsZUZsYXZvci5Eb3duXVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geyB0eXBlLCBmbGF2b3IsIGNvbG9yIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZSB7XHJcbiAgICB0eXBlOiBQYXJ0aWNsZVR5cGU7XHJcbiAgICBmbGF2b3I6IFBhcnRpY2xlRmxhdm9yO1xyXG4gICAgY29sb3I/OiBQYXJ0aWNsZUNvbG9yO1xyXG59XHJcblxyXG5lbnVtIFBhcnRpY2xlVHlwZSB7XHJcbiAgICBRdWFyayA9IFwicXVhcmtcIixcclxuICAgIExlcHRvbiA9IFwibGVwdG9uXCIsXHJcbiAgICBCb3NvbiA9IFwiYm9zb25cIixcclxufVxyXG5cclxuZW51bSBQYXJ0aWNsZUZsYXZvciB7XHJcbiAgICBFbGVjdHJvbiA9IFwiZWxlY3Ryb25cIixcclxuICAgIE11b24gPSBcIm11b25cIixcclxuICAgIFRhdSA9IFwidGF1XCIsXHJcbiAgICBVcCA9IFwidXBcIixcclxuICAgIERvd24gPSBcImRvd25cIixcclxuICAgIFN0cmFuZ2UgPSBcInN0YW5nZVwiLFxyXG4gICAgQ2hhcm0gPSBcImNoYXJtXCIsXHJcbiAgICBUb3AgPSBcInRvcFwiLFxyXG4gICAgQm90dG9tID0gXCJib3R0b21cIixcclxuICAgIEdsdW9uID0gXCJnbHVvblwiLFxyXG4gICAgUGhvdG9uID0gXCJwaG90b25cIixcclxuICAgIFdQbHVzID0gXCJ3LXBsdXNcIixcclxuICAgIFdNaW51cyA9IFwidy1taW51c1wiLFxyXG4gICAgWiA9IFwielwiLFxyXG4gICAgSGlnZ3MgPSBcImhpZ2dzXCIsXHJcbn1cclxuXHJcbmVudW0gUGFydGljbGVDb2xvciB7XHJcbiAgICBSZWQgPSBcInJlZFwiLFxyXG4gICAgR3JlZW4gPSBcImdyZWVuXCIsXHJcbiAgICBCbHVlID0gXCJibHVlXCIsXHJcbiAgICBSR0IgPSBcInJnYlwiLFxyXG59XHJcbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uL3V0aWxzL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2F2ZSB7XHJcbiAgICBwcml2YXRlIGNvbmZpZzogV2F2ZUNvbmZpZztcclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9pbnRzOiBXYXZlUG9pbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHByaXZhdGUgdGltZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgaG92ZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgcmlwcGxlczogUmlwcGxlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudCwgY29udGFpbmVyOiBIVE1MRWxlbWVudCwgY29uZmlnOiBXYXZlQ29uZmlnLCBhdXRvU3RhcnQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrSG92ZXIoZS5jbGllbnRZKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmhvdmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaXBwbGUoZS5jbGllbnRYLCBmYWxzZSwgMjAsIDEwLCAwLjA1LCAxNSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdmVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZShlLmNsaWVudFgsIHRydWUsIDE2MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5oZWlnaHQgPSBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5jb25maWcucmlwcGxlRGVsYXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5yaXBwbGVEZWxheSA9IDE1MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcub2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcub2Zmc2V0ID0gdGhpcy5jb25maWcuaGVpZ2h0IC8gMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplKCk7XHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5oYW5kbGVSZXNpemUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICBpZiAoYXV0b1N0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0hvdmVyKHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB5ID4gdGhpcy5jb25maWcub2Zmc2V0ICsgMTAwICYmIHkgPCB0aGlzLmNvbmZpZy5vZmZzZXQgKyAxNTA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVSZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbmZpZyhjb25maWc6IFdhdmVDb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0QW1wbGl0dWRlKGFtcGxpdHVkZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuYW1wbGl0dWRlID0gYW1wbGl0dWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBbXBsaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuYW1wbGl0dWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRGcmVxdWVuY3koZnJlcXVlbmN5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZy5mcmVxdWVuY3kgPSBmcmVxdWVuY3k7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEZyZXF1ZW5jeSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5mcmVxdWVuY3k7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFNwZWVkKHNwZWVkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZy5zcGVlZCA9IHNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTcGVlZCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFudXBSaXBwbGVzKCkge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGNvbnN0IHRocmVzaG9sZCA9IDAuMDAwMTtcclxuXHJcbiAgICAgICAgdGhpcy5yaXBwbGVzID0gdGhpcy5yaXBwbGVzLmZpbHRlcihyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWdlID0gKG5vdyAtIHIuc3RhcnRUaW1lKSAvIDEwMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXBVcFRpbWUgPSAwLjU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXAgPSBNYXRoLm1pbigxLCBhZ2UgLyByYW1wVXBUaW1lKTtcclxuICAgICAgICAgICAgY29uc3QgZWFzZWRSYW1wID0gTWF0aC5zaW4oKHJhbXAgKiBNYXRoLlBJKSAvIDIpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wYWdhdGlvbiA9IGFnZSAqIHIuc3BlZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhbGxvZmYgPSBNYXRoLmV4cCgtci5kZWNheSAqIE1hdGgucG93KDAgLSBwcm9wYWdhdGlvbiwgMikpO1xyXG4gICAgICAgICAgICBjb25zdCBwb3RlbnRpYWxBbXBsaXR1ZGUgPSByLnN0cmVuZ3RoICogZWFzZWRSYW1wICogZmFsbG9mZjtcclxuICAgICAgICAgICAgcmV0dXJuIHBvdGVudGlhbEFtcGxpdHVkZSA+IHRocmVzaG9sZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHNlbGYudGltZSA9IHNlbGYuY29uZmlnLnNwZWVkICogKCh0aW1lc3RhbXAgLSBzdGFydCkgLyAxMCk7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhdyhzZWxmLnRpbWUpO1xyXG4gICAgICAgICAgICBzZWxmLmNsZWFudXBSaXBwbGVzKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmNvbmZpZy5wb2ludENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB4OiBpLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBNYXRoLnJhbmRvbSgpICogMTAwMCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0WShpOiBudW1iZXIsIHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNbaV07XHJcbiAgICAgICAgY29uc3QgYmFzZU5vaXNlID1cclxuICAgICAgICAgICAgTWF0aC5zaW4oKHBvaW50Lm9mZnNldCArIHRpbWUpICogdGhpcy5jb25maWcuZnJlcXVlbmN5KSAqIDAuNiArXHJcbiAgICAgICAgICAgIE1hdGguc2luKChwb2ludC5vZmZzZXQgKiAwLjUgKyB0aW1lICogMC44KSAqIHRoaXMuY29uZmlnLmZyZXF1ZW5jeSkgKiAwLjQ7XHJcblxyXG4gICAgICAgIGxldCByaXBwbGVPZmZzZXQgPSAwO1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCByIG9mIHRoaXMucmlwcGxlcykge1xyXG4gICAgICAgICAgICBjb25zdCBhZ2UgPSAobm93IC0gci5zdGFydFRpbWUpIC8gMTAwMDtcclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhpIC0gci5pbmRleCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BhZ2F0aW9uID0gYWdlICogci5zcGVlZDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZhbGxvZmYgPSBNYXRoLmV4cCgtci5kZWNheSAqIE1hdGgucG93KGRpc3RhbmNlIC0gcHJvcGFnYXRpb24sIDIpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXBVcFRpbWUgPSAwLjU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbXAgPSBNYXRoLm1pbigxLCBhZ2UgLyByYW1wVXBUaW1lKTsgXHJcbiAgICAgICAgICAgIGNvbnN0IGVhc2VkUmFtcCA9IE1hdGguc2luKChyYW1wICogTWF0aC5QSSkgLyAyKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHdhdmUgPSBNYXRoLnNpbihkaXN0YW5jZSAtIHByb3BhZ2F0aW9uKTtcclxuICAgICAgICAgICAgcmlwcGxlT2Zmc2V0ICs9IHIuc3RyZW5ndGggKiBlYXNlZFJhbXAgKiBmYWxsb2ZmICogd2F2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5vZmZzZXQgKyAoYmFzZU5vaXNlICogdGhpcy5jb25maWcuYW1wbGl0dWRlICsgcmlwcGxlT2Zmc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXcodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgdGhpcy5jb25maWcuY29sb3Iuc3RhcnQpO1xyXG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCB0aGlzLmNvbmZpZy5jb2xvci5lbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gVXRpbHMuaGV4VG9SR0IodGhpcy5ob3ZlciA/IHRoaXMuY29uZmlnLmNvbG9yLmhvdmVyIDogdGhpcy5jb25maWcuY29sb3IuZ2xvdyk7XHJcbiAgICAgICAgdGhpcy5jdHguc2hhZG93Qmx1ciA9IDEwO1xyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd09mZnNldFkgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGdyYWRpZW50O1xyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aDtcclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcFggPSB0aGlzLmNhbnZhcy53aWR0aCAvICh0aGlzLmNvbmZpZy5wb2ludENvdW50IC0gMSk7XHJcblxyXG4gICAgICAgIGxldCBwcmV2WCA9IDA7XHJcbiAgICAgICAgbGV0IHByZXZZID0gdGhpcy5nZXRZKDAsIHRpbWUpO1xyXG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhwcmV2WCwgcHJldlkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuY29uZmlnLnBvaW50Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyWCA9IGkgKiBzdGVwWDtcclxuICAgICAgICAgICAgY29uc3QgY3VyclkgPSB0aGlzLmdldFkoaSwgdGltZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtaWRYID0gKHByZXZYICsgY3VyclgpIC8gMjtcclxuICAgICAgICAgICAgY29uc3QgbWlkWSA9IChwcmV2WSArIGN1cnJZKSAvIDI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHByZXZYLCBwcmV2WSwgbWlkWCwgbWlkWSk7XHJcblxyXG4gICAgICAgICAgICBwcmV2WCA9IGN1cnJYO1xyXG4gICAgICAgICAgICBwcmV2WSA9IGN1cnJZO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHByZXZYLCBwcmV2WSk7XHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJpcHBsZSh4OiBudW1iZXIsIG1hbnVhbDogYm9vbGVhbiA9IGZhbHNlLCBzdHJlbmd0aDogbnVtYmVyID0gMTIwLCBzcGVlZDogbnVtYmVyID0gMTAsIGRlY2F5OiBudW1iZXIgPSAwLjA1LCBtYXg6IG51bWJlciA9IDEpIHtcclxuICAgICAgICBpZiAodGhpcy5yaXBwbGVzLmZpbHRlcigocjogUmlwcGxlKSA9PiByLm1hbnVhbCA9PT0gbWFudWFsKS5sZW5ndGggPj0gbWF4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigoeCAvIHRoaXMuY2FudmFzLndpZHRoKSAqIHRoaXMuY29uZmlnLnBvaW50Q291bnQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcucmlwcGxlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yaXBwbGVDYWxsYmFjayh4LCBtYW51YWwsIHRoaXMuY29uZmlnLnBhcnRpY2xlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJpcHBsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IHBlcmZvcm1hbmNlLm5vdygpLFxyXG4gICAgICAgICAgICBzdHJlbmd0aCxcclxuICAgICAgICAgICAgc3BlZWQsXHJcbiAgICAgICAgICAgIGRlY2F5LFxyXG4gICAgICAgICAgICBtYW51YWwsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdhdmVDb25maWcge1xyXG4gICAgcGFydGljbGU6IFdhdmVQYXJ0aWNsZUluZm87XHJcbiAgICBhbXBsaXR1ZGU6IG51bWJlcjtcclxuICAgIGZyZXF1ZW5jeTogbnVtYmVyO1xyXG4gICAgc3BlZWQ6IG51bWJlcjtcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyO1xyXG4gICAgY29sb3I6IFdhdmVDb2xvcjtcclxuICAgIHBvaW50Q291bnQ6IG51bWJlcjtcclxuICAgIGhlaWdodD86IG51bWJlcjtcclxuICAgIG9mZnNldD86IG51bWJlcjtcclxuICAgIHJpcHBsZURlbGF5PzogbnVtYmVyO1xyXG4gICAgcmlwcGxlQ2FsbGJhY2s/OiAoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4sIHBhcnRpY2xlOiBXYXZlUGFydGljbGVJbmZvKSA9PiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdhdmVQYXJ0aWNsZUluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZztcclxuICAgIGZsYXZvcj86IHN0cmluZztcclxuICAgIGNvbG9yPzogc3RyaW5nO1xyXG4gICAgYWxsPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXYXZlQ29sb3Ige1xyXG4gICAgc3RhcnQ6IHN0cmluZztcclxuICAgIGVuZDogc3RyaW5nO1xyXG4gICAgZ2xvdzogc3RyaW5nO1xyXG4gICAgaG92ZXI6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFdhdmVQb2ludCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFJpcHBsZSB7XHJcbiAgICBpbmRleDogbnVtYmVyO1xyXG4gICAgc3RhcnRUaW1lOiBudW1iZXI7XHJcbiAgICBzdHJlbmd0aDogbnVtYmVyO1xyXG4gICAgc3BlZWQ6IG51bWJlcjtcclxuICAgIGRlY2F5OiBudW1iZXI7XHJcbiAgICBtYW51YWw6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgV2F2ZSwgV2F2ZUNvbG9yLCBXYXZlUGFydGljbGVJbmZvIH0gZnJvbSBcIi4uL1dhdmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWFudHVtRmllbGRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSB3YXZlczogV2F2ZVtdID0gW107XHJcbiAgICBwcml2YXRlIGNhbnZhc2VzOiBIVE1MQ2FudmFzRWxlbWVudFtdID0gW107XHJcbiAgICBwcml2YXRlIHdoaWNoV2F2ZTogV2F2ZVBhcnRpY2xlSW5mbztcclxuICAgIHByaXZhdGUgcGFydGljbGVzOiBXYXZlUGFydGljbGVJbmZvW10gPSBbXTtcclxuICAgIHByaXZhdGUgYWxsOiBXYXZlUGFydGljbGVJbmZvO1xyXG4gICAgcHJpdmF0ZSByYW5kb206IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByaXBwbGUoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4gPSBmYWxzZSwgc3RyZW5ndGg6IG51bWJlciA9IDEyMCwgc3BlZWQ6IG51bWJlciA9IDEwLCBkZWNheTogbnVtYmVyID0gMC4wNSwgbWF4OiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgdGhpcy53YXZlcy5mb3JFYWNoKHdhdmUgPT4geyB3YXZlLnJpcHBsZSh4LCBtYW51YWwsIHN0cmVuZ3RoLCBzcGVlZCwgZGVjYXksIG1heCkgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgICAgY29uc3QgYW1vdW50ID0gcGFyc2VJbnQodGhpcy5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtZmllbGRzXCIpKTtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSAodGhpcy5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIChhbW91bnQgKyAxKSkgKiBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZShcImluZGV4XCIpKTtcclxuICAgICAgICAodGhpcy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZmllbGQtbGFiZWxcIilbMF0gYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLnRvcCA9IChvZmZzZXQgLSA2MCkgKyBcInB4XCI7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gMztcclxuICAgICAgICB0aGlzLnJhbmRvbSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwicmFuZG9tXCIpID09PSBcInRydWVcIjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cmlidXRlKFwiYWxsXCIpID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICB0aGlzLmFsbCA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0QXR0cmlidXRlKFwiYWxsLXR5cGVcIiksXHJcbiAgICAgICAgICAgICAgICBmbGF2b3I6IHRoaXMuZ2V0QXR0cmlidXRlKFwiYWxsLWZsYXZvclwiKSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldEF0dHJpYnV0ZShcImFsbC1jb2xvclwiKSxcclxuICAgICAgICAgICAgICAgIGFsbDogdHJ1ZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZ2V0TmV4dERyb3AgPSAoKTogV2F2ZVBhcnRpY2xlSW5mbyA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hbGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnRpY2xlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnBhcnRpY2xlcy5sZW5ndGgpXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZVJpcHBsZSA9ICh4OiBudW1iZXIsIG1hbnVhbDogYm9vbGVhbiwgcGFydGljbGU6IFdhdmVQYXJ0aWNsZUluZm8pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFtYW51YWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcclxuICAgICAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwYXJ0aWNsZSkgPT09IEpTT04uc3RyaW5naWZ5KHRoaXMucGFydGljbGVzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpY2hXYXZlID0gZ2V0TmV4dERyb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50PFJpcHBsZUV2ZW50PihcInJpcHBsZVwiLCB7IGRldGFpbDogeyB4LCB5OiBvZmZzZXQsIG1hbnVhbCwgcGFydGljbGU6IHRoaXMud2hpY2hXYXZlIH0gfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwYXJ0aWNsZSkgPT09IEpTT04uc3RyaW5naWZ5KHRoaXMud2hpY2hXYXZlKSB8fCB0aGlzLndoaWNoV2F2ZS5hbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQ8UmlwcGxlRXZlbnQ+KFwicmlwcGxlXCIsIHsgZGV0YWlsOiB7IHgsIHk6IG9mZnNldCwgbWFudWFsLCBwYXJ0aWNsZSB9IH0pKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJ0aGlja1wiKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gMjA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZmllbGRcIik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IGZpZWxkc1tpXTtcclxuICAgICAgICAgICAgbGV0IHAgPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBmaWVsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIiksXHJcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtZmxhdm9yXCIpLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3JcIiksXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXNlcy5wdXNoKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzZXNbaV0pO1xyXG4gICAgICAgICAgICB0aGlzLndhdmVzLnB1c2gobmV3IFdhdmUodGhpcy5jYW52YXNlc1tpXSwgdGhpcy5wYXJlbnRFbGVtZW50LCB7XHJcbiAgICAgICAgICAgICAgICBhbXBsaXR1ZGU6IDIwLFxyXG4gICAgICAgICAgICAgICAgZnJlcXVlbmN5OiAxLFxyXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMDIsXHJcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvci1zdGFydFwiKSB8fCB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yLXN0YXJ0XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuZDogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvci1lbmRcIikgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvci1lbmRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xvdzogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvci1nbG93XCIpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3ItZ2xvd1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBob3ZlcjogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvci1ob3ZlclwiKSB8fCB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yLWhvdmVyXCIpIHx8IFwiI2ZmZmZmZlwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBvaW50Q291bnQ6IDEwLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXHJcbiAgICAgICAgICAgICAgICByaXBwbGVDYWxsYmFjazogaGFuZGxlUmlwcGxlLFxyXG4gICAgICAgICAgICAgICAgcGFydGljbGU6IHAsXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlRXZlbnQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgbWFudWFsOiBib29sZWFuO1xyXG4gICAgcGFydGljbGU6IFdhdmVQYXJ0aWNsZUluZm87XHJcbn1cclxuIiwiaW1wb3J0IHsgdHJhbnNsYXRpb25zIH0gZnJvbSBcIi4uLy4uL2kxOG4vaTE4blwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi91dGlscy9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi8uLi91dGlscy91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlR2FpbkVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwieFwiKSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLnN0eWxlLnRvcCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwieVwiKSArIFwicHhcIjtcclxuXHJcbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcbiAgICAgICAgbGV0IGZsYXZvciA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZmxhdm9yXCIpO1xyXG4gICAgICAgIGxldCBjb2xvciA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3JcIik7XHJcbiAgICAgICAgbGV0IHBhcnRpY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc0xpc3QuYWRkKFwicGFydGljbGVcIik7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NMaXN0LmFkZCh0eXBlKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc0xpc3QuYWRkKGZsYXZvcik7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NMaXN0LmFkZChjb2xvcik7XHJcblxyXG4gICAgICAgIGxldCBhbW91bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBhbW91bnQuaW5uZXJUZXh0ID0gYCArICR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJhbW91bnRcIil9YDtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChwYXJ0aWNsZSlcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGFtb3VudClcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFRvb2xUaXAgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi4vLi4vaTE4bi9pMThuXCI7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL1NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlZEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIGxldCBsYW5nID0gU2V0dGluZ3MuZ2V0KCkuZ2VuZXJhbC5zZXR0aW5ncy5sYW5ndWFnZS52YWx1ZTtcclxuICAgICAgICBsZXQgdHJhbnNsYXRlZCA9IFV0aWxzLmdldE5lc3RlZFByb3BlcnR5KHRyYW5zbGF0aW9uc1tsYW5nXSwgdGhpcy5pbm5lclRleHQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgIGlmICh0cmFuc2xhdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXJUZXh0ID0gdHJhbnNsYXRlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi9TZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvZyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MubG9nZ2luZy52YWx1ZSkgY29uc29sZS5sb2coYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUuZXJyb3IoYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgd2FybmluZyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MubG9nZ2luZy52YWx1ZSkgY29uc29sZS53YXJuKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlYnVnKGNvbnRleHQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChTZXR0aW5ncy5nZXQoKSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy5sb2dnaW5nLnZhbHVlICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLnZlcmJvc2UudmFsdWUpIGNvbnNvbGUuZGVidWcoYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFNhdmVIYW5kbGVyIH0gZnJvbSAnLi4vU2F2ZUhhbmRsZXIvU2F2ZUhhbmRsZXInO1xyXG5pbXBvcnQgdHlwZSB7IFNldHRpbmdzIGFzIFNldHRpbmdzVHlwZSB9IGZyb20gJy4uL3R5cGVzL1NldHRpbmdzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBzZXR0aW5nczogU2V0dGluZ3NUeXBlO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdCgpOiBTZXR0aW5nc1R5cGUge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdlbmVyYWw6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInNldHRpbmdzLmdlbmVyYWwudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmdlbmVyYWwubGFuZ3VhZ2UubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbm9UYWJIaXN0b3J5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZ2VuZXJhbC5ub1RhYkhpc3RvcnkubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJzZXR0aW5ncy5nZW5lcmFsLm5vVGFiSGlzdG9yeS5kZXNjcmlwdGlvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2FtZXBsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInNldHRpbmdzLmdhbWVwbGF5LnRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vT2ZmbGluZVRpbWU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5nYW1lcGxheS5ub09mZmxpbmVUaW1lLm5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInNldHRpbmdzLmRpc3BsYXkudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGFya05hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kaXNwbGF5LmRhcmtOYXZpZ2F0aW9uLm5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlYnVnOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5kZWJ1Zy50aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmRlYnVnLmxvZ2dpbmcubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmVyYm9zZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmRlYnVnLnZlcmJvc2UubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCgpOiBTZXR0aW5nc1R5cGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0KHNldHRpbmdzOiBTZXR0aW5nc1R5cGUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gey4uLnRoaXMuc2V0dGluZ3MsIC4uLnNldHRpbmdzfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IHJlc2V0IGxvZ2ljXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuZGVmYXVsdCgpO1xyXG4gICAgICAgIFNhdmVIYW5kbGVyLnNhdmVEYXRhKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IG5hbWVzcGFjZSBVdGlscyB7XHJcbiAgICBleHBvcnQgY29uc3QgZ2V0TmVzdGVkUHJvcGVydHkgPSAob2JqOiBhbnksIHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykucmVkdWNlKChhY2MsIGtleSkgPT4gYWNjPy5ba2V5XSwgb2JqKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgaGV4VG9SR0IgPSAoaGV4OiBzdHJpbmcsIGFscGhhPzogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgbGV0IG5vSGFzaCA9IGhleC5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcclxuICAgICAgICBsZXQgciA9IHBhcnNlSW50KG5vSGFzaC5zbGljZSgwLCAyKSwgMTYpLFxyXG4gICAgICAgICAgICBnID0gcGFyc2VJbnQobm9IYXNoLnNsaWNlKDIsIDQpLCAxNiksXHJcbiAgICAgICAgICAgIGIgPSBwYXJzZUludChub0hhc2guc2xpY2UoNCwgNiksIDE2KTtcclxuXHJcbiAgICAgICAgaWYgKGFscGhhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgXCIgKyBhbHBoYSArIFwiKVwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJnYihcIiArIHIgKyBcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiKVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgbWFpbiB9IGZyb20gXCIuL21haW5cIjtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBtYWluKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9