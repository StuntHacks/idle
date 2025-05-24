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
        console.log(resource);
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
        console.log("particle: ", particle);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDbEQsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDLEVBakJnQixLQUFLLHFCQUFMLEtBQUssUUFpQnJCOzs7Ozs7O1VDakJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSxxRUFBOEI7QUFFOUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxXQUFJLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy90cy9TYXZlSGFuZGxlci9TYXZlSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvaTE4bi9pMThuLnRzIiwid2VicGFjazovLy8uL3NyYy90cy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9SZXNvdXJjZUdhaW5IYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9XYXZlLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9jdXN0b21fZWxlbWVudHMvUXVhbnR1bUZpZWxkRWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvY3VzdG9tX2VsZW1lbnRzL1Jlc291cmNlR2FpbkVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL2N1c3RvbV9lbGVtZW50cy9Ub29sVGlwLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9jdXN0b21fZWxlbWVudHMvVHJhbnNsYXRlZEVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3V0aWxzL0xvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3V0aWxzL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2F2ZUZpbGUgfSBmcm9tIFwiLi4vdHlwZXMvU2F2ZUZpbGVcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi91dGlscy9TZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhdmVIYW5kbGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHNhdmU6IFNhdmVGaWxlO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERhdGEoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiTG9hZGluZyBzYXZlIGZpbGUuLi5cIik7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVGaWxlXCIpO1xyXG4gICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIk5vIHNhdmUgZGF0YSBmb3VuZCFcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zYXZlID0gSlNPTi5wYXJzZSh0aGlzLmRlY29kZShkYXRhKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNhdmVEYXRhKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5lbmNvZGUoSlNPTi5zdHJpbmdpZnkodGhpcy5zYXZlKSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlRmlsZVwiLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldERhdGEoKTogU2F2ZUZpbGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNhdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKCk6IFNhdmVGaWxlIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJJbml0aWFsaXppbmcgbmV3IHNhdmUgZmlsZS4uLlwiKTtcclxuICAgICAgICB0aGlzLnNhdmUgPSB7XHJcbiAgICAgICAgICAgIHNldHRpbmdzOiBTZXR0aW5ncy5kZWZhdWx0KCksXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNhdmVEYXRhKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbmNvZGUoZGF0YTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJFbmNvZGluZyBzYXZlIGRhdGEuLi5cIik7XHJcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGVuY29kaW5nIGxvZ2ljXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZGVjb2RlKGRhdGE6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiRGVjb2Rpbmcgc2F2ZSBkYXRhLi4uXCIpO1xyXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkZWNvZGluZyBsb2dpY1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRyYW5zbGF0aW9uTWFwIH0gZnJvbSBcIi4uL3R5cGVzL1RyYW5zbGF0aW9uc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25NYXAgPSB7XHJcbiAgICBcImVuXCI6IHtcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBnZW5lcmFsOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJHZW5lcmFsIHNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBub1RhYkhpc3Rvcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgdGFiIGhpc3RvcnlcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEb2Vzbid0IHNhdmUgY2hhbmdpbmcgYmV0d2VlbiB0YWJzIGluIHRoZSBicm93c2VyIGhpc3RvcnksIHNvIHRoZSBiYWNrIGJ1dHRvbiBsZWF2ZXMgdGhpcyBwYWdlIGluc3RlYWRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJMYW5ndWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnYW1lcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiR2FtZXBsYXkgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG5vT2ZmbGluZVRpbWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgb2ZmbGluZSB0aW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRpc3BsYXkgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIGRhcmtOYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJEYXJrIGhlYWRlciAmIGZvb3RlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNoYW5nZXMgdGhlIGNvbG9yIG9mIGhlYWRlciAmIGZvb3RlciB0byBiZSB0aGUgc2FtZSBhcyB0aGUgdGhlbWUgYmFja2dyb3VuZCBjb2xvclwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWJ1Zzoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVidWcgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIGxvZ2dpbmc6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkVuYWJsZSBsb2dnaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2ZXJib3NlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJWZXJib3NlIGxvZ2dpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvb3Rlcjoge1xyXG4gICAgICAgICAgICAgICAgZmVybWlvbnM6IFwiRmVybWlvbnNcIixcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IFwiR2VuZXJhdGlvbiBJXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kOiBcIkdlbmVyYXRpb24gSUlcIixcclxuICAgICAgICAgICAgICAgICAgICB0aGlyZDogXCJHZW5lcmF0aW9uIElJSVwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHF1YXJrczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiVXAgUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkb3duOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRG93biBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJtOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQ2hhcm0gUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdHJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiU3RyYW5nZSBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlRvcCBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkJvdHRvbSBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGxlcHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVjdHJvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkVsZWN0cm9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbXVvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIk11b25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0YXU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJUYXVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib3NvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2dzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiSGlnZ3MgQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBnbHVvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkdsdW9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGhvdG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiUGhvdG9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgd19wbHVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiV+KBuiBCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHdfbWludXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJX4oG7IEJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgejoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlrigbAgQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHsgUXVhbnR1bUZpZWxkRWxlbWVudCwgUmlwcGxlRXZlbnQgfSBmcm9tIFwiLi91aS9jdXN0b21fZWxlbWVudHMvUXVhbnR1bUZpZWxkRWxlbWVudFwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVkRWxlbWVudCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9UcmFuc2xhdGVkRWxlbWVudFwiO1xyXG5pbXBvcnQgeyB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi9pMThuL2kxOG5cIjtcclxuaW1wb3J0IHsgU2F2ZUhhbmRsZXIgfSBmcm9tIFwiLi9TYXZlSGFuZGxlci9TYXZlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBXYXZlIH0gZnJvbSBcIi4vdWkvV2F2ZVwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuL3V0aWxzL1NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vdXRpbHMvdXRpbHNcIjtcclxuaW1wb3J0IHsgVG9vbFRpcCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9Ub29sVGlwXCI7XHJcbmltcG9ydCB7IFJlc291cmNlR2FpbkVsZW1lbnQgfSBmcm9tIFwiLi91aS9jdXN0b21fZWxlbWVudHMvUmVzb3VyY2VHYWluRWxlbWVudFwiO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUdhaW5IYW5kbGVyIH0gZnJvbSBcIi4vdWkvUmVzb3VyY2VHYWluSGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1haW4gPSAoKSA9PiB7XHJcbiAgICBpZiAoIVNhdmVIYW5kbGVyLmxvYWREYXRhKCkpIHtcclxuICAgICAgICBTYXZlSGFuZGxlci5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRhdGEgPSBTYXZlSGFuZGxlci5nZXREYXRhKCk7XHJcbiAgICBTZXR0aW5ncy5zZXQoZGF0YS5zZXR0aW5ncyk7XHJcblxyXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidHJhbnNsYXRlZC1zdHJpbmdcIiwgVHJhbnNsYXRlZEVsZW1lbnQpO1xyXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwicXVhbnR1bS1maWVsZFwiLCBRdWFudHVtRmllbGRFbGVtZW50KTtcclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInJlc291cmNlLWdhaW5cIiwgUmVzb3VyY2VHYWluRWxlbWVudCk7XHJcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0b29sLXRpcFwiLCBUb29sVGlwKTtcclxuXHJcbiAgICBsZXQgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKTtcclxuXHJcbiAgICBSZXNvdXJjZUdhaW5IYW5kbGVyLmluaXRpYWxpemUoXCJyZXNvdXJjZS1nYWluLWNvbnRhaW5lclwiKTtcclxuICAgIGxldCBmaWVsZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInF1YW50dW0tZmllbGRcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZpZWxkc1tpXS5hZGRFdmVudExpc3RlbmVyKFwicmlwcGxlXCIsIGZ1bmN0aW9uIChlOiBDdXN0b21FdmVudEluaXQ8UmlwcGxlRXZlbnQ+KSB7XHJcbiAgICAgICAgICAgIGlmIChlLmRldGFpbC5tYW51YWwgJiYgSlNPTi5zdHJpbmdpZnkoZS5kZXRhaWwucGFydGljbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJpcHBsZVwiLCBKU09OLnN0cmluZ2lmeShlLmRldGFpbC5wYXJ0aWNsZSksIGUuZGV0YWlsLm1hbnVhbCwgZS5kZXRhaWwueCwgZS5kZXRhaWwueSk7XHJcbiAgICAgICAgICAgICAgICBSZXNvdXJjZUdhaW5IYW5kbGVyLmdhaW5SZXNvdXJjZShSZXNvdXJjZUdhaW5IYW5kbGVyLmdldFJlc291cmNlRnJvbUZpZWxkKGUuZGV0YWlsLnBhcnRpY2xlKSwgKGUuZGV0YWlsLnggLSAxMCksIChlLmRldGFpbC55ICsgMTAwKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlYWR5XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgV2F2ZVBhcnRpY2xlSW5mbyB9IGZyb20gXCIuL1dhdmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUdhaW5IYW5kbGVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUoaWQ6IHN0cmluZyA9IFwicmVzb3VyY2UtZ2Fpbi1jb250YWluZXJcIikge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2FpblJlc291cmNlKHJlc291cmNlOiBSZXNvdXJjZSwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJyZXNvdXJjZS1nYWluXCIpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwieFwiLCB4ICsgXCJcIik7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkgKyBcIlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNvdXJjZSlcclxuICAgICAgICBpZiAocmVzb3VyY2UudHlwZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgcmVzb3VyY2UudHlwZS50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc291cmNlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY29sb3JcIiwgcmVzb3VyY2UuY29sb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNvdXJjZS5mbGF2b3IpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJmbGF2b3JcIiwgcmVzb3VyY2UuZmxhdm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImFtb3VudFwiLCBcIjEuMzRlMTdcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSZXNvdXJjZUZyb21GaWVsZChwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbyk6IFJlc291cmNlIHtcclxuICAgICAgICBsZXQgZmxhdm9yID0gUGFydGljbGVGbGF2b3JbcGFydGljbGUuZmxhdm9yIGFzIGtleW9mIHR5cGVvZiBQYXJ0aWNsZUZsYXZvcl07XHJcbiAgICAgICAgbGV0IGNvbG9yID0gUGFydGljbGVDb2xvcltwYXJ0aWNsZS5jb2xvciBhcyBrZXlvZiB0eXBlb2YgUGFydGljbGVDb2xvcl07XHJcbiAgICAgICAgbGV0IHR5cGUgPSBQYXJ0aWNsZVR5cGVbcGFydGljbGUudHlwZSBhcyBrZXlvZiB0eXBlb2YgUGFydGljbGVUeXBlXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFydGljbGU6IFwiLCBwYXJ0aWNsZSlcclxuICAgICAgICBpZiAocGFydGljbGUudHlwZSA9PT0gXCJRdWFya1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICBmbGF2b3I6IFtQYXJ0aWNsZUZsYXZvci5VcCwgUGFydGljbGVGbGF2b3IuRG93bl1bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMildXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZSwgZmxhdm9yLCBjb2xvciB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2Uge1xyXG4gICAgdHlwZTogUGFydGljbGVUeXBlO1xyXG4gICAgZmxhdm9yOiBQYXJ0aWNsZUZsYXZvcjtcclxuICAgIGNvbG9yPzogUGFydGljbGVDb2xvcjtcclxufVxyXG5cclxuZW51bSBQYXJ0aWNsZVR5cGUge1xyXG4gICAgUXVhcmsgPSBcInF1YXJrXCIsXHJcbiAgICBMZXB0b24gPSBcImxlcHRvblwiLFxyXG4gICAgQm9zb24gPSBcImJvc29uXCIsXHJcbn1cclxuXHJcbmVudW0gUGFydGljbGVGbGF2b3Ige1xyXG4gICAgRWxlY3Ryb24gPSBcImVsZWN0cm9uXCIsXHJcbiAgICBNdW9uID0gXCJtdW9uXCIsXHJcbiAgICBUYXUgPSBcInRhdVwiLFxyXG4gICAgVXAgPSBcInVwXCIsXHJcbiAgICBEb3duID0gXCJkb3duXCIsXHJcbiAgICBTdHJhbmdlID0gXCJzdGFuZ2VcIixcclxuICAgIENoYXJtID0gXCJjaGFybVwiLFxyXG4gICAgVG9wID0gXCJ0b3BcIixcclxuICAgIEJvdHRvbSA9IFwiYm90dG9tXCIsXHJcbiAgICBHbHVvbiA9IFwiZ2x1b25cIixcclxuICAgIFBob3RvbiA9IFwicGhvdG9uXCIsXHJcbiAgICBXUGx1cyA9IFwidy1wbHVzXCIsXHJcbiAgICBXTWludXMgPSBcInctbWludXNcIixcclxuICAgIFogPSBcInpcIixcclxuICAgIEhpZ2dzID0gXCJoaWdnc1wiLFxyXG59XHJcblxyXG5lbnVtIFBhcnRpY2xlQ29sb3Ige1xyXG4gICAgUmVkID0gXCJyZWRcIixcclxuICAgIEdyZWVuID0gXCJncmVlblwiLFxyXG4gICAgQmx1ZSA9IFwiYmx1ZVwiLFxyXG4gICAgUkdCID0gXCJyZ2JcIixcclxufVxyXG4iLCJpbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi91dGlscy91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdhdmUge1xyXG4gICAgcHJpdmF0ZSBjb25maWc6IFdhdmVDb25maWc7XHJcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvaW50czogV2F2ZVBvaW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIHRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGhvdmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHJpcHBsZXM6IFJpcHBsZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNvbmZpZzogV2F2ZUNvbmZpZywgYXV0b1N0YXJ0OiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0hvdmVyKGUuY2xpZW50WSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5ob3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlKGUuY2xpZW50WCwgZmFsc2UsIDIwLCAxMCwgMC4wNSwgMTUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LmFkZChcImhvdmVyZWRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3Zlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGUoZS5jbGllbnRYLCB0cnVlLCAxNjApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuaGVpZ2h0ID0gY29udGFpbmVyLmNsaWVudEhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJpcHBsZURlbGF5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcucmlwcGxlRGVsYXkgPSAxNTAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLm9mZnNldCA9IHRoaXMuY29uZmlnLmhlaWdodCAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgaWYgKGF1dG9TdGFydCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tIb3Zlcih5OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4geSA+IHRoaXMuY29uZmlnLm9mZnNldCArIDEwMCAmJiB5IDwgdGhpcy5jb25maWcub2Zmc2V0ICsgMTUwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jb25maWcuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBXYXZlQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEFtcGxpdHVkZShhbXBsaXR1ZGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QW1wbGl0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmFtcGxpdHVkZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RnJlcXVlbmN5KGZyZXF1ZW5jeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGcmVxdWVuY3koKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZnJlcXVlbmN5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTcGVlZChzcGVlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuc3BlZWQgPSBzcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3BlZWQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhbnVwUmlwcGxlcygpIHtcclxuICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBjb25zdCB0aHJlc2hvbGQgPSAwLjAwMDE7XHJcblxyXG4gICAgICAgIHRoaXMucmlwcGxlcyA9IHRoaXMucmlwcGxlcy5maWx0ZXIociA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFnZSA9IChub3cgLSByLnN0YXJ0VGltZSkgLyAxMDAwO1xyXG4gICAgICAgICAgICBjb25zdCByYW1wVXBUaW1lID0gMC41O1xyXG4gICAgICAgICAgICBjb25zdCByYW1wID0gTWF0aC5taW4oMSwgYWdlIC8gcmFtcFVwVGltZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVhc2VkUmFtcCA9IE1hdGguc2luKChyYW1wICogTWF0aC5QSSkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvcGFnYXRpb24gPSBhZ2UgKiByLnNwZWVkO1xyXG4gICAgICAgICAgICBjb25zdCBmYWxsb2ZmID0gTWF0aC5leHAoLXIuZGVjYXkgKiBNYXRoLnBvdygwIC0gcHJvcGFnYXRpb24sIDIpKTtcclxuICAgICAgICAgICAgY29uc3QgcG90ZW50aWFsQW1wbGl0dWRlID0gci5zdHJlbmd0aCAqIGVhc2VkUmFtcCAqIGZhbGxvZmY7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3RlbnRpYWxBbXBsaXR1ZGUgPiB0aHJlc2hvbGQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHZhciBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZSh0aW1lc3RhbXA6IG51bWJlcikge1xyXG4gICAgICAgICAgICBzZWxmLnRpbWUgPSBzZWxmLmNvbmZpZy5zcGVlZCAqICgodGltZXN0YW1wIC0gc3RhcnQpIC8gMTApO1xyXG4gICAgICAgICAgICBzZWxmLmRyYXcoc2VsZi50aW1lKTtcclxuICAgICAgICAgICAgc2VsZi5jbGVhbnVwUmlwcGxlcygpO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5jb25maWcucG9pbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgeDogaSxcclxuICAgICAgICAgICAgICAgIG9mZnNldDogTWF0aC5yYW5kb20oKSAqIDEwMDAsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFkoaTogbnVtYmVyLCB0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzW2ldO1xyXG4gICAgICAgIGNvbnN0IGJhc2VOb2lzZSA9XHJcbiAgICAgICAgICAgIE1hdGguc2luKChwb2ludC5vZmZzZXQgKyB0aW1lKSAqIHRoaXMuY29uZmlnLmZyZXF1ZW5jeSkgKiAwLjYgK1xyXG4gICAgICAgICAgICBNYXRoLnNpbigocG9pbnQub2Zmc2V0ICogMC41ICsgdGltZSAqIDAuOCkgKiB0aGlzLmNvbmZpZy5mcmVxdWVuY3kpICogMC40O1xyXG5cclxuICAgICAgICBsZXQgcmlwcGxlT2Zmc2V0ID0gMDtcclxuICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgciBvZiB0aGlzLnJpcHBsZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgYWdlID0gKG5vdyAtIHIuc3RhcnRUaW1lKSAvIDEwMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoaSAtIHIuaW5kZXgpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wYWdhdGlvbiA9IGFnZSAqIHIuc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmYWxsb2ZmID0gTWF0aC5leHAoLXIuZGVjYXkgKiBNYXRoLnBvdyhkaXN0YW5jZSAtIHByb3BhZ2F0aW9uLCAyKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByYW1wVXBUaW1lID0gMC41O1xyXG4gICAgICAgICAgICBjb25zdCByYW1wID0gTWF0aC5taW4oMSwgYWdlIC8gcmFtcFVwVGltZSk7IFxyXG4gICAgICAgICAgICBjb25zdCBlYXNlZFJhbXAgPSBNYXRoLnNpbigocmFtcCAqIE1hdGguUEkpIC8gMik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB3YXZlID0gTWF0aC5zaW4oZGlzdGFuY2UgLSBwcm9wYWdhdGlvbik7XHJcbiAgICAgICAgICAgIHJpcHBsZU9mZnNldCArPSByLnN0cmVuZ3RoICogZWFzZWRSYW1wICogZmFsbG9mZiAqIHdhdmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcub2Zmc2V0ICsgKGJhc2VOb2lzZSAqIHRoaXMuY29uZmlnLmFtcGxpdHVkZSArIHJpcHBsZU9mZnNldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3KHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHRoaXMuY29uZmlnLmNvbG9yLnN0YXJ0KTtcclxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgdGhpcy5jb25maWcuY29sb3IuZW5kKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dDb2xvciA9IFV0aWxzLmhleFRvUkdCKHRoaXMuaG92ZXIgPyB0aGlzLmNvbmZpZy5jb2xvci5ob3ZlciA6IHRoaXMuY29uZmlnLmNvbG9yLmdsb3cpO1xyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd0JsdXIgPSAxMDtcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dPZmZzZXRZID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB0aGlzLmNvbmZpZy5saW5lV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBYID0gdGhpcy5jYW52YXMud2lkdGggLyAodGhpcy5jb25maWcucG9pbnRDb3VudCAtIDEpO1xyXG5cclxuICAgICAgICBsZXQgcHJldlggPSAwO1xyXG4gICAgICAgIGxldCBwcmV2WSA9IHRoaXMuZ2V0WSgwLCB0aW1lKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8ocHJldlgsIHByZXZZKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmNvbmZpZy5wb2ludENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VyclggPSBpICogc3RlcFg7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJZID0gdGhpcy5nZXRZKGksIHRpbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWlkWCA9IChwcmV2WCArIGN1cnJYKSAvIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pZFkgPSAocHJldlkgKyBjdXJyWSkgLyAyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdHgucXVhZHJhdGljQ3VydmVUbyhwcmV2WCwgcHJldlksIG1pZFgsIG1pZFkpO1xyXG5cclxuICAgICAgICAgICAgcHJldlggPSBjdXJyWDtcclxuICAgICAgICAgICAgcHJldlkgPSBjdXJyWTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbyhwcmV2WCwgcHJldlkpO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByaXBwbGUoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4gPSBmYWxzZSwgc3RyZW5ndGg6IG51bWJlciA9IDEyMCwgc3BlZWQ6IG51bWJlciA9IDEwLCBkZWNheTogbnVtYmVyID0gMC4wNSwgbWF4OiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmlwcGxlcy5maWx0ZXIoKHI6IFJpcHBsZSkgPT4gci5tYW51YWwgPT09IG1hbnVhbCkubGVuZ3RoID49IG1heCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoKHggLyB0aGlzLmNhbnZhcy53aWR0aCkgKiB0aGlzLmNvbmZpZy5wb2ludENvdW50KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJpcHBsZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcucmlwcGxlQ2FsbGJhY2soeCwgbWFudWFsLCB0aGlzLmNvbmZpZy5wYXJ0aWNsZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yaXBwbGVzLnB1c2goe1xyXG4gICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgc3RhcnRUaW1lOiBwZXJmb3JtYW5jZS5ub3coKSxcclxuICAgICAgICAgICAgc3RyZW5ndGgsXHJcbiAgICAgICAgICAgIHNwZWVkLFxyXG4gICAgICAgICAgICBkZWNheSxcclxuICAgICAgICAgICAgbWFudWFsLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXYXZlQ29uZmlnIHtcclxuICAgIHBhcnRpY2xlOiBXYXZlUGFydGljbGVJbmZvO1xyXG4gICAgYW1wbGl0dWRlOiBudW1iZXI7XHJcbiAgICBmcmVxdWVuY3k6IG51bWJlcjtcclxuICAgIHNwZWVkOiBudW1iZXI7XHJcbiAgICBsaW5lV2lkdGg6IG51bWJlcjtcclxuICAgIGNvbG9yOiBXYXZlQ29sb3I7XHJcbiAgICBwb2ludENvdW50OiBudW1iZXI7XHJcbiAgICBoZWlnaHQ/OiBudW1iZXI7XHJcbiAgICBvZmZzZXQ/OiBudW1iZXI7XHJcbiAgICByaXBwbGVEZWxheT86IG51bWJlcjtcclxuICAgIHJpcHBsZUNhbGxiYWNrPzogKHg6IG51bWJlciwgbWFudWFsOiBib29sZWFuLCBwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbykgPT4gYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXYXZlUGFydGljbGVJbmZvIHtcclxuICAgIHR5cGU/OiBzdHJpbmc7XHJcbiAgICBmbGF2b3I/OiBzdHJpbmc7XHJcbiAgICBjb2xvcj86IHN0cmluZztcclxuICAgIGFsbD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV2F2ZUNvbG9yIHtcclxuICAgIHN0YXJ0OiBzdHJpbmc7XHJcbiAgICBlbmQ6IHN0cmluZztcclxuICAgIGdsb3c6IHN0cmluZztcclxuICAgIGhvdmVyOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBXYXZlUG9pbnQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBSaXBwbGUge1xyXG4gICAgaW5kZXg6IG51bWJlcjtcclxuICAgIHN0YXJ0VGltZTogbnVtYmVyO1xyXG4gICAgc3RyZW5ndGg6IG51bWJlcjtcclxuICAgIHNwZWVkOiBudW1iZXI7XHJcbiAgICBkZWNheTogbnVtYmVyO1xyXG4gICAgbWFudWFsOiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCB7IFdhdmUsIFdhdmVDb2xvciwgV2F2ZVBhcnRpY2xlSW5mbyB9IGZyb20gXCIuLi9XYXZlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVhbnR1bUZpZWxkRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIHByaXZhdGUgd2F2ZXM6IFdhdmVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjYW52YXNlczogSFRNTENhbnZhc0VsZW1lbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB3aGljaFdhdmU6IFdhdmVQYXJ0aWNsZUluZm87XHJcbiAgICBwcml2YXRlIHBhcnRpY2xlczogV2F2ZVBhcnRpY2xlSW5mb1tdID0gW107XHJcbiAgICBwcml2YXRlIGFsbDogV2F2ZVBhcnRpY2xlSW5mbztcclxuICAgIHByaXZhdGUgcmFuZG9tOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmlwcGxlKHg6IG51bWJlciwgbWFudWFsOiBib29sZWFuID0gZmFsc2UsIHN0cmVuZ3RoOiBudW1iZXIgPSAxMjAsIHNwZWVkOiBudW1iZXIgPSAxMCwgZGVjYXk6IG51bWJlciA9IDAuMDUsIG1heDogbnVtYmVyID0gMSkge1xyXG4gICAgICAgIHRoaXMud2F2ZXMuZm9yRWFjaCh3YXZlID0+IHsgd2F2ZS5yaXBwbGUoeCwgbWFudWFsLCBzdHJlbmd0aCwgc3BlZWQsIGRlY2F5LCBtYXgpIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IHBhcnNlSW50KHRoaXMucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpZWxkc1wiKSk7XHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gKHRoaXMucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAoYW1vdW50ICsgMSkpICogcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoXCJpbmRleFwiKSk7XHJcbiAgICAgICAgKHRoaXMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZpZWxkLWxhYmVsXCIpWzBdIGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS50b3AgPSAob2Zmc2V0IC0gNjApICsgXCJweFwiO1xyXG4gICAgICAgIGxldCB3aWR0aCA9IDM7XHJcbiAgICAgICAgdGhpcy5yYW5kb20gPSB0aGlzLmdldEF0dHJpYnV0ZShcInJhbmRvbVwiKSA9PT0gXCJ0cnVlXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZShcImFsbFwiKSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hbGwgPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldEF0dHJpYnV0ZShcImFsbC10eXBlXCIpLFxyXG4gICAgICAgICAgICAgICAgZmxhdm9yOiB0aGlzLmdldEF0dHJpYnV0ZShcImFsbC1mbGF2b3JcIiksXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRBdHRyaWJ1dGUoXCJhbGwtY29sb3JcIiksXHJcbiAgICAgICAgICAgICAgICBhbGw6IHRydWUsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGdldE5leHREcm9wID0gKCk6IFdhdmVQYXJ0aWNsZUluZm8gPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbGwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC4xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5wYXJ0aWNsZXMubGVuZ3RoKV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVSaXBwbGUgPSAoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4sIHBhcnRpY2xlOiBXYXZlUGFydGljbGVJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghbWFudWFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmFuZG9tKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkocGFydGljbGUpID09PSBKU09OLnN0cmluZ2lmeSh0aGlzLnBhcnRpY2xlc1swXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaWNoV2F2ZSA9IGdldE5leHREcm9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudDxSaXBwbGVFdmVudD4oXCJyaXBwbGVcIiwgeyBkZXRhaWw6IHsgeCwgeTogb2Zmc2V0LCBtYW51YWwsIHBhcnRpY2xlOiB0aGlzLndoaWNoV2F2ZSB9IH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkocGFydGljbGUpID09PSBKU09OLnN0cmluZ2lmeSh0aGlzLndoaWNoV2F2ZSkgfHwgdGhpcy53aGljaFdhdmUuYWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50PFJpcHBsZUV2ZW50PihcInJpcHBsZVwiLCB7IGRldGFpbDogeyB4LCB5OiBvZmZzZXQsIG1hbnVhbCwgcGFydGljbGUgfSB9KSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwidGhpY2tcIikge1xyXG4gICAgICAgICAgICB3aWR0aCA9IDIwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZpZWxkXCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSBmaWVsZHNbaV07XHJcbiAgICAgICAgICAgIGxldCBwID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpLFxyXG4gICAgICAgICAgICAgICAgZmxhdm9yOiBmaWVsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZsYXZvclwiKSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBmaWVsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbG9yXCIpLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChwKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzZXMucHVzaChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhc2VzW2ldKTtcclxuICAgICAgICAgICAgdGhpcy53YXZlcy5wdXNoKG5ldyBXYXZlKHRoaXMuY2FudmFzZXNbaV0sIHRoaXMucGFyZW50RWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgYW1wbGl0dWRlOiAyMCxcclxuICAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogMSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjAyLFxyXG4gICAgICAgICAgICAgICAgbGluZVdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3Itc3RhcnRcIikgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvci1zdGFydFwiKSxcclxuICAgICAgICAgICAgICAgICAgICBlbmQ6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3ItZW5kXCIpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3ItZW5kXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGdsb3c6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3ItZ2xvd1wiKSB8fCB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yLWdsb3dcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgaG92ZXI6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3ItaG92ZXJcIikgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvci1ob3ZlclwiKSB8fCBcIiNmZmZmZmZcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwb2ludENvdW50OiAxMCxcclxuICAgICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgcmlwcGxlQ2FsbGJhY2s6IGhhbmRsZVJpcHBsZSxcclxuICAgICAgICAgICAgICAgIHBhcnRpY2xlOiBwLFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZUV2ZW50IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIG1hbnVhbDogYm9vbGVhbjtcclxuICAgIHBhcnRpY2xlOiBXYXZlUGFydGljbGVJbmZvO1xyXG59XHJcbiIsImltcG9ydCB7IHRyYW5zbGF0aW9ucyB9IGZyb20gXCIuLi8uLi9pMThuL2kxOG5cIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vLi4vdXRpbHMvU2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUdhaW5FbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICB0aGlzLnN0eWxlLmxlZnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInhcIikgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5zdHlsZS50b3AgPSB0aGlzLmdldEF0dHJpYnV0ZShcInlcIikgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG4gICAgICAgIGxldCBmbGF2b3IgPSB0aGlzLmdldEF0dHJpYnV0ZShcImZsYXZvclwiKTtcclxuICAgICAgICBsZXQgY29sb3IgPSB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yXCIpO1xyXG4gICAgICAgIGxldCBwYXJ0aWNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NMaXN0LmFkZChcInBhcnRpY2xlXCIpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTGlzdC5hZGQodHlwZSk7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NMaXN0LmFkZChmbGF2b3IpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTGlzdC5hZGQoY29sb3IpO1xyXG5cclxuICAgICAgICBsZXQgYW1vdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYW1vdW50LmlubmVyVGV4dCA9IGAgKyAke3RoaXMuZ2V0QXR0cmlidXRlKFwiYW1vdW50XCIpfWA7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocGFydGljbGUpXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChhbW91bnQpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBUb29sVGlwIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgdHJhbnNsYXRpb25zIH0gZnJvbSBcIi4uLy4uL2kxOG4vaTE4blwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi91dGlscy9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi8uLi91dGlscy91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0ZWRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICBsZXQgbGFuZyA9IFNldHRpbmdzLmdldCgpLmdlbmVyYWwuc2V0dGluZ3MubGFuZ3VhZ2UudmFsdWU7XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0ZWQgPSBVdGlscy5nZXROZXN0ZWRQcm9wZXJ0eSh0cmFuc2xhdGlvbnNbbGFuZ10sIHRoaXMuaW5uZXJUZXh0LnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICBpZiAodHJhbnNsYXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyVGV4dCA9IHRyYW5zbGF0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4vU2V0dGluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2coY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUubG9nKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGVycm9yKGNvbnRleHQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChTZXR0aW5ncy5nZXQoKSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy5sb2dnaW5nLnZhbHVlKSBjb25zb2xlLmVycm9yKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHdhcm5pbmcoY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUud2FybihgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkZWJ1Zyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MubG9nZ2luZy52YWx1ZSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy52ZXJib3NlLnZhbHVlKSBjb25zb2xlLmRlYnVnKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBTYXZlSGFuZGxlciB9IGZyb20gJy4uL1NhdmVIYW5kbGVyL1NhdmVIYW5kbGVyJztcclxuaW1wb3J0IHR5cGUgeyBTZXR0aW5ncyBhcyBTZXR0aW5nc1R5cGUgfSBmcm9tICcuLi90eXBlcy9TZXR0aW5ncyc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3Mge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dGluZ3M6IFNldHRpbmdzVHlwZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHQoKTogU2V0dGluZ3NUeXBlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZW5lcmFsOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5nZW5lcmFsLnRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5nZW5lcmFsLmxhbmd1YWdlLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5vVGFiSGlzdG9yeToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmdlbmVyYWwubm9UYWJIaXN0b3J5Lm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwic2V0dGluZ3MuZ2VuZXJhbC5ub1RhYkhpc3RvcnkuZGVzY3JpcHRpb25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdhbWVwbGF5OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5nYW1lcGxheS50aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBub09mZmxpbmVUaW1lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZ2FtZXBsYXkubm9PZmZsaW5lVGltZS5uYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXNwbGF5OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5kaXNwbGF5LnRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhcmtOYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZGlzcGxheS5kYXJrTmF2aWdhdGlvbi5uYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWJ1Zzoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZGVidWcudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kZWJ1Zy5sb2dnaW5nLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcmJvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kZWJ1Zy52ZXJib3NlLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQoKTogU2V0dGluZ3NUeXBlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldChzZXR0aW5nczogU2V0dGluZ3NUeXBlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHsuLi50aGlzLnNldHRpbmdzLCAuLi5zZXR0aW5nc307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCByZXNldCBsb2dpY1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLmRlZmF1bHQoKTtcclxuICAgICAgICBTYXZlSGFuZGxlci5zYXZlRGF0YSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBuYW1lc3BhY2UgVXRpbHMge1xyXG4gICAgZXhwb3J0IGNvbnN0IGdldE5lc3RlZFByb3BlcnR5ID0gKG9iajogYW55LCBwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpLnJlZHVjZSgoYWNjLCBrZXkpID0+IGFjYz8uW2tleV0sIG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGhleFRvUkdCID0gKGhleDogc3RyaW5nLCBhbHBoYT86IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGxldCBub0hhc2ggPSBoZXgucmVwbGFjZShcIiNcIiwgXCJcIik7XHJcbiAgICAgICAgbGV0IHIgPSBwYXJzZUludChub0hhc2guc2xpY2UoMCwgMiksIDE2KSxcclxuICAgICAgICAgICAgZyA9IHBhcnNlSW50KG5vSGFzaC5zbGljZSgyLCA0KSwgMTYpLFxyXG4gICAgICAgICAgICBiID0gcGFyc2VJbnQobm9IYXNoLnNsaWNlKDQsIDYpLCAxNik7XHJcblxyXG4gICAgICAgIGlmIChhbHBoYSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgciArIFwiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIsIFwiICsgYWxwaGEgKyBcIilcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIilcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IG1haW4gfSBmcm9tIFwiLi9tYWluXCI7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbik7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==