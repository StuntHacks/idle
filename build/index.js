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
                    this.ripple(e.clientX, false, 20, 10, 0.05);
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
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05) {
        const index = Math.floor((x / this.canvas.width) * this.config.pointCount);
        if (this.config.rippleCallback) {
            if (!this.config.rippleCallback(x, manual, this.config.particle, this.config.index)) {
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
        this.delay = 1000;
        this.lastClick = 0;
    }
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay); });
    }
    connectedCallback() {
        const amount = parseInt(this.parentElement.getAttribute("data-fields"));
        const offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        this.getElementsByClassName("field-label")[0].style.top = (offset - 60) + "px";
        let width = 3;
        this.random = this.getAttribute("random") === "true";
        this.delay = parseInt(this.getAttribute("delay"));
        this.type = this.getAttribute("type");
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
        const handleRipple = (x, manual, particle, index) => {
            if (!manual) {
                return true;
            }
            let now = performance.now();
            if ((now - this.lastClick) < this.delay) {
                return false;
            }
            if (this.type === "triple") {
                if (index === (this.particles.length * 3) - 1) {
                    this.lastClick = now;
                    this.dispatchEvent(new CustomEvent("ripple", { detail: { x, y: offset, manual, particle } }));
                }
                return true;
            }
            if (index === this.particles.length - 1) {
                this.lastClick = now;
            }
            if (this.random) {
                if (index === 0) {
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
        let copies = 1;
        this.type = this.getAttribute("type");
        if (this.type === "thick") {
            width = 20;
        }
        else if (this.type === "triple") {
            copies = 3;
        }
        let fields = this.getElementsByClassName("field");
        for (let i = 0; i < fields.length; i += copies) {
            let field = fields[i];
            let p = {
                type: field.getAttribute("data-type"),
                flavor: field.getAttribute("data-flavor"),
                color: field.getAttribute("data-color"),
            };
            this.particles.push(p);
            for (let j = 0; j < copies; j++) {
                this.canvases.push(document.createElement("canvas"));
                this.appendChild(this.canvases[i + j]);
                this.waves.push(new Wave_1.Wave(this.canvases[i + j], this.parentElement, {
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
                    index: i + j,
                }));
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ly8vLi9zcmMvdHMvU2F2ZUhhbmRsZXIvU2F2ZUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2kxOG4vaTE4bi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvUmVzb3VyY2VHYWluSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvV2F2ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvY3VzdG9tX2VsZW1lbnRzL1F1YW50dW1GaWVsZEVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL2N1c3RvbV9lbGVtZW50cy9SZXNvdXJjZUdhaW5FbGVtZW50LnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9jdXN0b21fZWxlbWVudHMvVG9vbFRpcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvY3VzdG9tX2VsZW1lbnRzL1RyYW5zbGF0ZWRFbGVtZW50LnRzIiwid2VicGFjazovLy8uL3NyYy90cy91dGlscy9Mb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3V0aWxzL1NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91dGlscy91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNhdmVGaWxlIH0gZnJvbSBcIi4uL3R5cGVzL1NhdmVGaWxlXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuLi91dGlscy9Mb2dnZXJcIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vdXRpbHMvU2V0dGluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXZlSGFuZGxlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBzYXZlOiBTYXZlRmlsZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWREYXRhKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkxvYWRpbmcgc2F2ZSBmaWxlLi4uXCIpO1xyXG4gICAgICAgIGxldCBkYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXZlRmlsZVwiKTtcclxuICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJObyBzYXZlIGRhdGEgZm91bmQhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2F2ZSA9IEpTT04ucGFyc2UodGhpcy5kZWNvZGUoZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzYXZlRGF0YSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHRoaXMuc2F2ZSkpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2F2ZUZpbGVcIiwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXREYXRhKCk6IFNhdmVGaWxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zYXZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZSgpOiBTYXZlRmlsZSB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiSW5pdGlhbGl6aW5nIG5ldyBzYXZlIGZpbGUuLi5cIik7XHJcbiAgICAgICAgdGhpcy5zYXZlID0ge1xyXG4gICAgICAgICAgICBzZXR0aW5nczogU2V0dGluZ3MuZGVmYXVsdCgpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zYXZlRGF0YSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNhdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW5jb2RlKGRhdGE6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiRW5jb2Rpbmcgc2F2ZSBkYXRhLi4uXCIpO1xyXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBlbmNvZGluZyBsb2dpY1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGRlY29kZShkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIkRlY29kaW5nIHNhdmUgZGF0YS4uLlwiKTtcclxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZGVjb2RpbmcgbG9naWNcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUcmFuc2xhdGlvbk1hcCB9IGZyb20gXCIuLi90eXBlcy9UcmFuc2xhdGlvbnNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uTWFwID0ge1xyXG4gICAgXCJlblwiOiB7XHJcbiAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgZ2VuZXJhbDoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiR2VuZXJhbCBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbm9UYWJIaXN0b3J5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJEaXNhYmxlIHRhYiBoaXN0b3J5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRG9lc24ndCBzYXZlIGNoYW5naW5nIGJldHdlZW4gdGFicyBpbiB0aGUgYnJvd3NlciBoaXN0b3J5LCBzbyB0aGUgYmFjayBidXR0b24gbGVhdmVzIHRoaXMgcGFnZSBpbnN0ZWFkXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBsYW5ndWFnZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiTGFuZ3VhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2FtZXBsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkdhbWVwbGF5IHNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBub09mZmxpbmVUaW1lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJEaXNhYmxlIG9mZmxpbmUgdGltZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXNwbGF5OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEaXNwbGF5IHNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBkYXJrTmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRGFyayBoZWFkZXIgJiBmb290ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJDaGFuZ2VzIHRoZSBjb2xvciBvZiBoZWFkZXIgJiBmb290ZXIgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIHRoZW1lIGJhY2tncm91bmQgY29sb3JcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVidWc6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlYnVnIHNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBsb2dnaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJFbmFibGUgbG9nZ2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmVyYm9zZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiVmVyYm9zZSBsb2dnaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB1aToge1xyXG4gICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgIGZlcm1pb25zOiBcIkZlcm1pb25zXCIsXHJcbiAgICAgICAgICAgICAgICBnZW5lcmF0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiBcIkdlbmVyYXRpb24gSVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZDogXCJHZW5lcmF0aW9uIElJXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcmQ6IFwiR2VuZXJhdGlvbiBJSUlcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBxdWFya3M6IHtcclxuICAgICAgICAgICAgICAgICAgICB1cDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlVwIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZG93bjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRvd24gUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjaGFybToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkNoYXJtIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyYW5nZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlN0cmFuZ2UgUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJUb3AgUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBib3R0b206IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJCb3R0b20gUXVhcmtzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBsZXB0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlY3Ryb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJFbGVjdHJvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG11b246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJNdW9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGF1OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiVGF1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYm9zb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICBoaWdnczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkhpZ2dzIEJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZ2x1b246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJHbHVvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHBob3Rvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlBob3RvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHdfcGx1czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlfigbogQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB3X21pbnVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiV+KBuyBCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHo6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJa4oGwIEJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IFF1YW50dW1GaWVsZEVsZW1lbnQsIFJpcHBsZUV2ZW50IH0gZnJvbSBcIi4vdWkvY3VzdG9tX2VsZW1lbnRzL1F1YW50dW1GaWVsZEVsZW1lbnRcIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlZEVsZW1lbnQgfSBmcm9tIFwiLi91aS9jdXN0b21fZWxlbWVudHMvVHJhbnNsYXRlZEVsZW1lbnRcIjtcclxuaW1wb3J0IHsgdHJhbnNsYXRpb25zIH0gZnJvbSBcIi4vaTE4bi9pMThuXCI7XHJcbmltcG9ydCB7IFNhdmVIYW5kbGVyIH0gZnJvbSBcIi4vU2F2ZUhhbmRsZXIvU2F2ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgV2F2ZSB9IGZyb20gXCIuL3VpL1dhdmVcIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi91dGlscy9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL3V0aWxzL3V0aWxzXCI7XHJcbmltcG9ydCB7IFRvb2xUaXAgfSBmcm9tIFwiLi91aS9jdXN0b21fZWxlbWVudHMvVG9vbFRpcFwiO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUdhaW5FbGVtZW50IH0gZnJvbSBcIi4vdWkvY3VzdG9tX2VsZW1lbnRzL1Jlc291cmNlR2FpbkVsZW1lbnRcIjtcclxuaW1wb3J0IHsgUmVzb3VyY2VHYWluSGFuZGxlciB9IGZyb20gXCIuL3VpL1Jlc291cmNlR2FpbkhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBtYWluID0gKCkgPT4ge1xyXG4gICAgaWYgKCFTYXZlSGFuZGxlci5sb2FkRGF0YSgpKSB7XHJcbiAgICAgICAgU2F2ZUhhbmRsZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBkYXRhID0gU2F2ZUhhbmRsZXIuZ2V0RGF0YSgpO1xyXG4gICAgU2V0dGluZ3Muc2V0KGRhdGEuc2V0dGluZ3MpO1xyXG5cclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRyYW5zbGF0ZWQtc3RyaW5nXCIsIFRyYW5zbGF0ZWRFbGVtZW50KTtcclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInF1YW50dW0tZmllbGRcIiwgUXVhbnR1bUZpZWxkRWxlbWVudCk7XHJcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJyZXNvdXJjZS1nYWluXCIsIFJlc291cmNlR2FpbkVsZW1lbnQpO1xyXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidG9vbC10aXBcIiwgVG9vbFRpcCk7XHJcblxyXG4gICAgbGV0IG1haW5Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIik7XHJcblxyXG4gICAgUmVzb3VyY2VHYWluSGFuZGxlci5pbml0aWFsaXplKFwicmVzb3VyY2UtZ2Fpbi1jb250YWluZXJcIik7XHJcbiAgICBsZXQgZmllbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJxdWFudHVtLWZpZWxkXCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmaWVsZHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcInJpcHBsZVwiLCBmdW5jdGlvbiAoZTogQ3VzdG9tRXZlbnRJbml0PFJpcHBsZUV2ZW50Pikge1xyXG4gICAgICAgICAgICBpZiAoZS5kZXRhaWwubWFudWFsICYmIEpTT04uc3RyaW5naWZ5KGUuZGV0YWlsLnBhcnRpY2xlKSkge1xyXG4gICAgICAgICAgICAgICAgUmVzb3VyY2VHYWluSGFuZGxlci5nYWluUmVzb3VyY2UoUmVzb3VyY2VHYWluSGFuZGxlci5nZXRSZXNvdXJjZUZyb21GaWVsZChlLmRldGFpbC5wYXJ0aWNsZSksIChlLmRldGFpbC54IC0gMTApLCAoZS5kZXRhaWwueSArIDEwMCkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZWFkeVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IFdhdmVQYXJ0aWNsZUluZm8gfSBmcm9tIFwiLi9XYXZlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VHYWluSGFuZGxlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKGlkOiBzdHJpbmcgPSBcInJlc291cmNlLWdhaW4tY29udGFpbmVyXCIpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdhaW5SZXNvdXJjZShyZXNvdXJjZTogUmVzb3VyY2UsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicmVzb3VyY2UtZ2FpblwiKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInhcIiwgeCArIFwiXCIpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwieVwiLCB5ICsgXCJcIik7XHJcblxyXG4gICAgICAgIGlmIChyZXNvdXJjZS50eXBlKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCByZXNvdXJjZS50eXBlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzb3VyY2UuY29sb3IpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjb2xvclwiLCByZXNvdXJjZS5jb2xvci50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc291cmNlLmZsYXZvcikge1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImZsYXZvclwiLCByZXNvdXJjZS5mbGF2b3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImFtb3VudFwiLCBcIjEuMzRlMTdcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSZXNvdXJjZUZyb21GaWVsZChwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbyk6IFJlc291cmNlIHtcclxuICAgICAgICBsZXQgZmxhdm9yID0gUGFydGljbGVGbGF2b3JbcGFydGljbGUuZmxhdm9yIGFzIGtleW9mIHR5cGVvZiBQYXJ0aWNsZUZsYXZvcl07XHJcbiAgICAgICAgbGV0IGNvbG9yID0gUGFydGljbGVDb2xvcltwYXJ0aWNsZS5jb2xvciBhcyBrZXlvZiB0eXBlb2YgUGFydGljbGVDb2xvcl07XHJcbiAgICAgICAgbGV0IHR5cGUgPSBQYXJ0aWNsZVR5cGVbcGFydGljbGUudHlwZSBhcyBrZXlvZiB0eXBlb2YgUGFydGljbGVUeXBlXTtcclxuXHJcbiAgICAgICAgaWYgKHBhcnRpY2xlLnR5cGUgPT09IFwiUXVhcmtcIikge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgZmxhdm9yOiBbUGFydGljbGVGbGF2b3IuVXAsIFBhcnRpY2xlRmxhdm9yLkRvd25dW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7IHR5cGUsIGZsYXZvciwgY29sb3IgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlIHtcclxuICAgIHR5cGU6IFBhcnRpY2xlVHlwZTtcclxuICAgIGZsYXZvcjogUGFydGljbGVGbGF2b3I7XHJcbiAgICBjb2xvcj86IFBhcnRpY2xlQ29sb3I7XHJcbn1cclxuXHJcbmVudW0gUGFydGljbGVUeXBlIHtcclxuICAgIFF1YXJrID0gXCJxdWFya1wiLFxyXG4gICAgTGVwdG9uID0gXCJsZXB0b25cIixcclxuICAgIEJvc29uID0gXCJib3NvblwiLFxyXG59XHJcblxyXG5lbnVtIFBhcnRpY2xlRmxhdm9yIHtcclxuICAgIEVsZWN0cm9uID0gXCJlbGVjdHJvblwiLFxyXG4gICAgTXVvbiA9IFwibXVvblwiLFxyXG4gICAgVGF1ID0gXCJ0YXVcIixcclxuICAgIFVwID0gXCJ1cFwiLFxyXG4gICAgRG93biA9IFwiZG93blwiLFxyXG4gICAgU3RyYW5nZSA9IFwic3RhbmdlXCIsXHJcbiAgICBDaGFybSA9IFwiY2hhcm1cIixcclxuICAgIFRvcCA9IFwidG9wXCIsXHJcbiAgICBCb3R0b20gPSBcImJvdHRvbVwiLFxyXG4gICAgR2x1b24gPSBcImdsdW9uXCIsXHJcbiAgICBQaG90b24gPSBcInBob3RvblwiLFxyXG4gICAgV1BsdXMgPSBcInctcGx1c1wiLFxyXG4gICAgV01pbnVzID0gXCJ3LW1pbnVzXCIsXHJcbiAgICBaID0gXCJ6XCIsXHJcbiAgICBIaWdncyA9IFwiaGlnZ3NcIixcclxufVxyXG5cclxuZW51bSBQYXJ0aWNsZUNvbG9yIHtcclxuICAgIFJlZCA9IFwicmVkXCIsXHJcbiAgICBHcmVlbiA9IFwiZ3JlZW5cIixcclxuICAgIEJsdWUgPSBcImJsdWVcIixcclxuICAgIFJHQiA9IFwicmdiXCIsXHJcbn1cclxuIiwiaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vdXRpbHMvdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXYXZlIHtcclxuICAgIHByaXZhdGUgY29uZmlnOiBXYXZlQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb2ludHM6IFdhdmVQb2ludFtdID0gW107XHJcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSB0aW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBob3ZlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSByaXBwbGVzOiBSaXBwbGVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50LCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBjb25maWc6IFdhdmVDb25maWcsIGF1dG9TdGFydDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tIb3ZlcihlLmNsaWVudFkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaG92ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZShlLmNsaWVudFgsIGZhbHNlLCAyMCwgMTAsIDAuMDUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LmFkZChcImhvdmVyZWRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3Zlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGUoZS5jbGllbnRYLCB0cnVlLCAxNjApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuaGVpZ2h0ID0gY29udGFpbmVyLmNsaWVudEhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJpcHBsZURlbGF5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcucmlwcGxlRGVsYXkgPSAxNTAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLm9mZnNldCA9IHRoaXMuY29uZmlnLmhlaWdodCAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgaWYgKGF1dG9TdGFydCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tIb3Zlcih5OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4geSA+IHRoaXMuY29uZmlnLm9mZnNldCArIDEwMCAmJiB5IDwgdGhpcy5jb25maWcub2Zmc2V0ICsgMTUwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jb25maWcuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBXYXZlQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEFtcGxpdHVkZShhbXBsaXR1ZGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QW1wbGl0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmFtcGxpdHVkZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RnJlcXVlbmN5KGZyZXF1ZW5jeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGcmVxdWVuY3koKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZnJlcXVlbmN5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTcGVlZChzcGVlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuc3BlZWQgPSBzcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3BlZWQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhbnVwUmlwcGxlcygpIHtcclxuICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBjb25zdCB0aHJlc2hvbGQgPSAwLjAwMDE7XHJcblxyXG4gICAgICAgIHRoaXMucmlwcGxlcyA9IHRoaXMucmlwcGxlcy5maWx0ZXIociA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFnZSA9IChub3cgLSByLnN0YXJ0VGltZSkgLyAxMDAwO1xyXG4gICAgICAgICAgICBjb25zdCByYW1wVXBUaW1lID0gMC41O1xyXG4gICAgICAgICAgICBjb25zdCByYW1wID0gTWF0aC5taW4oMSwgYWdlIC8gcmFtcFVwVGltZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVhc2VkUmFtcCA9IE1hdGguc2luKChyYW1wICogTWF0aC5QSSkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvcGFnYXRpb24gPSBhZ2UgKiByLnNwZWVkO1xyXG4gICAgICAgICAgICBjb25zdCBmYWxsb2ZmID0gTWF0aC5leHAoLXIuZGVjYXkgKiBNYXRoLnBvdygwIC0gcHJvcGFnYXRpb24sIDIpKTtcclxuICAgICAgICAgICAgY29uc3QgcG90ZW50aWFsQW1wbGl0dWRlID0gci5zdHJlbmd0aCAqIGVhc2VkUmFtcCAqIGZhbGxvZmY7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3RlbnRpYWxBbXBsaXR1ZGUgPiB0aHJlc2hvbGQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHZhciBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZSh0aW1lc3RhbXA6IG51bWJlcikge1xyXG4gICAgICAgICAgICBzZWxmLnRpbWUgPSBzZWxmLmNvbmZpZy5zcGVlZCAqICgodGltZXN0YW1wIC0gc3RhcnQpIC8gMTApO1xyXG4gICAgICAgICAgICBzZWxmLmRyYXcoc2VsZi50aW1lKTtcclxuICAgICAgICAgICAgc2VsZi5jbGVhbnVwUmlwcGxlcygpO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5jb25maWcucG9pbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgeDogaSxcclxuICAgICAgICAgICAgICAgIG9mZnNldDogTWF0aC5yYW5kb20oKSAqIDEwMDAsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFkoaTogbnVtYmVyLCB0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzW2ldO1xyXG4gICAgICAgIGNvbnN0IGJhc2VOb2lzZSA9XHJcbiAgICAgICAgICAgIE1hdGguc2luKChwb2ludC5vZmZzZXQgKyB0aW1lKSAqIHRoaXMuY29uZmlnLmZyZXF1ZW5jeSkgKiAwLjYgK1xyXG4gICAgICAgICAgICBNYXRoLnNpbigocG9pbnQub2Zmc2V0ICogMC41ICsgdGltZSAqIDAuOCkgKiB0aGlzLmNvbmZpZy5mcmVxdWVuY3kpICogMC40O1xyXG5cclxuICAgICAgICBsZXQgcmlwcGxlT2Zmc2V0ID0gMDtcclxuICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgciBvZiB0aGlzLnJpcHBsZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgYWdlID0gKG5vdyAtIHIuc3RhcnRUaW1lKSAvIDEwMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoaSAtIHIuaW5kZXgpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wYWdhdGlvbiA9IGFnZSAqIHIuc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmYWxsb2ZmID0gTWF0aC5leHAoLXIuZGVjYXkgKiBNYXRoLnBvdyhkaXN0YW5jZSAtIHByb3BhZ2F0aW9uLCAyKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByYW1wVXBUaW1lID0gMC41O1xyXG4gICAgICAgICAgICBjb25zdCByYW1wID0gTWF0aC5taW4oMSwgYWdlIC8gcmFtcFVwVGltZSk7IFxyXG4gICAgICAgICAgICBjb25zdCBlYXNlZFJhbXAgPSBNYXRoLnNpbigocmFtcCAqIE1hdGguUEkpIC8gMik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB3YXZlID0gTWF0aC5zaW4oZGlzdGFuY2UgLSBwcm9wYWdhdGlvbik7XHJcbiAgICAgICAgICAgIHJpcHBsZU9mZnNldCArPSByLnN0cmVuZ3RoICogZWFzZWRSYW1wICogZmFsbG9mZiAqIHdhdmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcub2Zmc2V0ICsgKGJhc2VOb2lzZSAqIHRoaXMuY29uZmlnLmFtcGxpdHVkZSArIHJpcHBsZU9mZnNldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3KHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHRoaXMuY29uZmlnLmNvbG9yLnN0YXJ0KTtcclxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgdGhpcy5jb25maWcuY29sb3IuZW5kKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dDb2xvciA9IFV0aWxzLmhleFRvUkdCKHRoaXMuaG92ZXIgPyB0aGlzLmNvbmZpZy5jb2xvci5ob3ZlciA6IHRoaXMuY29uZmlnLmNvbG9yLmdsb3cpO1xyXG4gICAgICAgIHRoaXMuY3R4LnNoYWRvd0JsdXIgPSAxMDtcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dPZmZzZXRZID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB0aGlzLmNvbmZpZy5saW5lV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0ZXBYID0gdGhpcy5jYW52YXMud2lkdGggLyAodGhpcy5jb25maWcucG9pbnRDb3VudCAtIDEpO1xyXG5cclxuICAgICAgICBsZXQgcHJldlggPSAwO1xyXG4gICAgICAgIGxldCBwcmV2WSA9IHRoaXMuZ2V0WSgwLCB0aW1lKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8ocHJldlgsIHByZXZZKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmNvbmZpZy5wb2ludENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VyclggPSBpICogc3RlcFg7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJZID0gdGhpcy5nZXRZKGksIHRpbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWlkWCA9IChwcmV2WCArIGN1cnJYKSAvIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pZFkgPSAocHJldlkgKyBjdXJyWSkgLyAyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdHgucXVhZHJhdGljQ3VydmVUbyhwcmV2WCwgcHJldlksIG1pZFgsIG1pZFkpO1xyXG5cclxuICAgICAgICAgICAgcHJldlggPSBjdXJyWDtcclxuICAgICAgICAgICAgcHJldlkgPSBjdXJyWTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbyhwcmV2WCwgcHJldlkpO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByaXBwbGUoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4gPSBmYWxzZSwgc3RyZW5ndGg6IG51bWJlciA9IDEyMCwgc3BlZWQ6IG51bWJlciA9IDEwLCBkZWNheTogbnVtYmVyID0gMC4wNSkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigoeCAvIHRoaXMuY2FudmFzLndpZHRoKSAqIHRoaXMuY29uZmlnLnBvaW50Q291bnQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcucmlwcGxlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yaXBwbGVDYWxsYmFjayh4LCBtYW51YWwsIHRoaXMuY29uZmlnLnBhcnRpY2xlLCB0aGlzLmNvbmZpZy5pbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yaXBwbGVzLnB1c2goe1xyXG4gICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgc3RhcnRUaW1lOiBwZXJmb3JtYW5jZS5ub3coKSxcclxuICAgICAgICAgICAgc3RyZW5ndGgsXHJcbiAgICAgICAgICAgIHNwZWVkLFxyXG4gICAgICAgICAgICBkZWNheSxcclxuICAgICAgICAgICAgbWFudWFsLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXYXZlQ29uZmlnIHtcclxuICAgIHBhcnRpY2xlOiBXYXZlUGFydGljbGVJbmZvO1xyXG4gICAgYW1wbGl0dWRlOiBudW1iZXI7XHJcbiAgICBmcmVxdWVuY3k6IG51bWJlcjtcclxuICAgIHNwZWVkOiBudW1iZXI7XHJcbiAgICBsaW5lV2lkdGg6IG51bWJlcjtcclxuICAgIGNvbG9yOiBXYXZlQ29sb3I7XHJcbiAgICBwb2ludENvdW50OiBudW1iZXI7XHJcbiAgICBoZWlnaHQ/OiBudW1iZXI7XHJcbiAgICBvZmZzZXQ/OiBudW1iZXI7XHJcbiAgICByaXBwbGVEZWxheT86IG51bWJlcjtcclxuICAgIHJpcHBsZUNhbGxiYWNrPzogKHg6IG51bWJlciwgbWFudWFsOiBib29sZWFuLCBwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbywgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbjtcclxuICAgIGluZGV4OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV2F2ZVBhcnRpY2xlSW5mbyB7XHJcbiAgICB0eXBlPzogc3RyaW5nO1xyXG4gICAgZmxhdm9yPzogc3RyaW5nO1xyXG4gICAgY29sb3I/OiBzdHJpbmc7XHJcbiAgICBhbGw/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdhdmVDb2xvciB7XHJcbiAgICBzdGFydDogc3RyaW5nO1xyXG4gICAgZW5kOiBzdHJpbmc7XHJcbiAgICBnbG93OiBzdHJpbmc7XHJcbiAgICBob3Zlcjogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgV2F2ZVBvaW50IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmlwcGxlIHtcclxuICAgIGluZGV4OiBudW1iZXI7XHJcbiAgICBzdGFydFRpbWU6IG51bWJlcjtcclxuICAgIHN0cmVuZ3RoOiBudW1iZXI7XHJcbiAgICBzcGVlZDogbnVtYmVyO1xyXG4gICAgZGVjYXk6IG51bWJlcjtcclxuICAgIG1hbnVhbDogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgeyBXYXZlLCBXYXZlQ29sb3IsIFdhdmVQYXJ0aWNsZUluZm8gfSBmcm9tIFwiLi4vV2F2ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1YW50dW1GaWVsZEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBwcml2YXRlIHdhdmVzOiBXYXZlW10gPSBbXTtcclxuICAgIHByaXZhdGUgY2FudmFzZXM6IEhUTUxDYW52YXNFbGVtZW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgd2hpY2hXYXZlOiBXYXZlUGFydGljbGVJbmZvO1xyXG4gICAgcHJpdmF0ZSBwYXJ0aWNsZXM6IFdhdmVQYXJ0aWNsZUluZm9bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBhbGw6IFdhdmVQYXJ0aWNsZUluZm87XHJcbiAgICBwcml2YXRlIHJhbmRvbTogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgdHlwZT86IFwidGhpY2tcIiB8IFwidHJpcGxlXCI7XHJcbiAgICBwcml2YXRlIGRlbGF5OiBudW1iZXIgPSAxMDAwO1xyXG4gICAgcHJpdmF0ZSBsYXN0Q2xpY2s6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByaXBwbGUoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4gPSBmYWxzZSwgc3RyZW5ndGg6IG51bWJlciA9IDEyMCwgc3BlZWQ6IG51bWJlciA9IDEwLCBkZWNheTogbnVtYmVyID0gMC4wNSkge1xyXG4gICAgICAgIHRoaXMud2F2ZXMuZm9yRWFjaCh3YXZlID0+IHsgd2F2ZS5yaXBwbGUoeCwgbWFudWFsLCBzdHJlbmd0aCwgc3BlZWQsIGRlY2F5KSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICBjb25zdCBhbW91bnQgPSBwYXJzZUludCh0aGlzLnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1maWVsZHNcIikpO1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9ICh0aGlzLnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gKGFtb3VudCArIDEpKSAqIHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKFwiaW5kZXhcIikpO1xyXG4gICAgICAgICh0aGlzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmaWVsZC1sYWJlbFwiKVswXSBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUudG9wID0gKG9mZnNldCAtIDYwKSArIFwicHhcIjtcclxuICAgICAgICBsZXQgd2lkdGggPSAzO1xyXG4gICAgICAgIHRoaXMucmFuZG9tID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJyYW5kb21cIikgPT09IFwidHJ1ZVwiO1xyXG4gICAgICAgIHRoaXMuZGVsYXkgPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZShcImRlbGF5XCIpKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInR5cGVcIikgYXMgXCJ0aGlja1wiIHwgXCJ0cmlwbGVcIiB8IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZShcImFsbFwiKSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hbGwgPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldEF0dHJpYnV0ZShcImFsbC10eXBlXCIpLFxyXG4gICAgICAgICAgICAgICAgZmxhdm9yOiB0aGlzLmdldEF0dHJpYnV0ZShcImFsbC1mbGF2b3JcIiksXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRBdHRyaWJ1dGUoXCJhbGwtY29sb3JcIiksXHJcbiAgICAgICAgICAgICAgICBhbGw6IHRydWUsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGdldE5leHREcm9wID0gKCk6IFdhdmVQYXJ0aWNsZUluZm8gPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbGwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC4xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5wYXJ0aWNsZXMubGVuZ3RoKV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVSaXBwbGUgPSAoeDogbnVtYmVyLCBtYW51YWw6IGJvb2xlYW4sIHBhcnRpY2xlOiBXYXZlUGFydGljbGVJbmZvLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghbWFudWFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgICAgICBpZiAoKG5vdyAtIHRoaXMubGFzdENsaWNrKSA8IHRoaXMuZGVsYXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gXCJ0cmlwbGVcIikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAodGhpcy5wYXJ0aWNsZXMubGVuZ3RoICogMykgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Q2xpY2sgPSBub3c7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudDxSaXBwbGVFdmVudD4oXCJyaXBwbGVcIiwgeyBkZXRhaWw6IHsgeCwgeTogb2Zmc2V0LCBtYW51YWwsIHBhcnRpY2xlIH0gfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IHRoaXMucGFydGljbGVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdENsaWNrID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpY2hXYXZlID0gZ2V0TmV4dERyb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50PFJpcHBsZUV2ZW50PihcInJpcHBsZVwiLCB7IGRldGFpbDogeyB4LCB5OiBvZmZzZXQsIG1hbnVhbCwgcGFydGljbGU6IHRoaXMud2hpY2hXYXZlIH0gfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwYXJ0aWNsZSkgPT09IEpTT04uc3RyaW5naWZ5KHRoaXMud2hpY2hXYXZlKSB8fCB0aGlzLndoaWNoV2F2ZS5hbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQ8UmlwcGxlRXZlbnQ+KFwicmlwcGxlXCIsIHsgZGV0YWlsOiB7IHgsIHk6IG9mZnNldCwgbWFudWFsLCBwYXJ0aWNsZSB9IH0pKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGNvcGllcyA9IDE7XHJcblxyXG4gICAgICAgIHRoaXMudHlwZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSBhcyBcInRoaWNrXCIgfCBcInRyaXBsZVwiIHwgbnVsbDtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09PSBcInRoaWNrXCIpIHtcclxuICAgICAgICAgICAgd2lkdGggPSAyMDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gXCJ0cmlwbGVcIikge1xyXG4gICAgICAgICAgICBjb3BpZXMgPSAzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZpZWxkXCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkgKz0gY29waWVzKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IGZpZWxkc1tpXTtcclxuICAgICAgICAgICAgbGV0IHAgPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBmaWVsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIiksXHJcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtZmxhdm9yXCIpLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3JcIiksXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHApO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb3BpZXM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXNlcy5wdXNoKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhc2VzW2kgKyBqXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdmVzLnB1c2gobmV3IFdhdmUodGhpcy5jYW52YXNlc1tpICsgal0sIHRoaXMucGFyZW50RWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGFtcGxpdHVkZTogMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJlcXVlbmN5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWVkOiAwLjAyLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3Itc3RhcnRcIikgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvci1zdGFydFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBmaWVsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbG9yLWVuZFwiKSB8fCB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yLWVuZFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvdzogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvci1nbG93XCIpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3ItZ2xvd1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG92ZXI6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3ItaG92ZXJcIikgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvci1ob3ZlclwiKSB8fCBcIiNmZmZmZmZcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50Q291bnQ6IDEwLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHJpcHBsZUNhbGxiYWNrOiBoYW5kbGVSaXBwbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGU6IHAsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGkgKyBqLFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZUV2ZW50IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIG1hbnVhbDogYm9vbGVhbjtcclxuICAgIHBhcnRpY2xlOiBXYXZlUGFydGljbGVJbmZvO1xyXG59XHJcbiIsImltcG9ydCB7IHRyYW5zbGF0aW9ucyB9IGZyb20gXCIuLi8uLi9pMThuL2kxOG5cIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vLi4vdXRpbHMvU2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUdhaW5FbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICB0aGlzLnN0eWxlLmxlZnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInhcIikgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5zdHlsZS50b3AgPSB0aGlzLmdldEF0dHJpYnV0ZShcInlcIikgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG4gICAgICAgIGxldCBmbGF2b3IgPSB0aGlzLmdldEF0dHJpYnV0ZShcImZsYXZvclwiKTtcclxuICAgICAgICBsZXQgY29sb3IgPSB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yXCIpO1xyXG4gICAgICAgIGxldCBwYXJ0aWNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NMaXN0LmFkZChcInBhcnRpY2xlXCIpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTGlzdC5hZGQodHlwZSk7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NMaXN0LmFkZChmbGF2b3IpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTGlzdC5hZGQoY29sb3IpO1xyXG5cclxuICAgICAgICBsZXQgYW1vdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYW1vdW50LmlubmVyVGV4dCA9IGAgKyAke3RoaXMuZ2V0QXR0cmlidXRlKFwiYW1vdW50XCIpfWA7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocGFydGljbGUpXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChhbW91bnQpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBUb29sVGlwIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgdHJhbnNsYXRpb25zIH0gZnJvbSBcIi4uLy4uL2kxOG4vaTE4blwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi91dGlscy9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi8uLi91dGlscy91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0ZWRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgICBsZXQgbGFuZyA9IFNldHRpbmdzLmdldCgpLmdlbmVyYWwuc2V0dGluZ3MubGFuZ3VhZ2UudmFsdWU7XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0ZWQgPSBVdGlscy5nZXROZXN0ZWRQcm9wZXJ0eSh0cmFuc2xhdGlvbnNbbGFuZ10sIHRoaXMuaW5uZXJUZXh0LnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICBpZiAodHJhbnNsYXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyVGV4dCA9IHRyYW5zbGF0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4vU2V0dGluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2coY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUubG9nKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGVycm9yKGNvbnRleHQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChTZXR0aW5ncy5nZXQoKSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy5sb2dnaW5nLnZhbHVlKSBjb25zb2xlLmVycm9yKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHdhcm5pbmcoY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUpIGNvbnNvbGUud2FybihgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkZWJ1Zyhjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MubG9nZ2luZy52YWx1ZSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy52ZXJib3NlLnZhbHVlKSBjb25zb2xlLmRlYnVnKGBbJHtjb250ZXh0fV1gLCBtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBTYXZlSGFuZGxlciB9IGZyb20gJy4uL1NhdmVIYW5kbGVyL1NhdmVIYW5kbGVyJztcclxuaW1wb3J0IHR5cGUgeyBTZXR0aW5ncyBhcyBTZXR0aW5nc1R5cGUgfSBmcm9tICcuLi90eXBlcy9TZXR0aW5ncyc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3Mge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dGluZ3M6IFNldHRpbmdzVHlwZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHQoKTogU2V0dGluZ3NUeXBlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZW5lcmFsOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5nZW5lcmFsLnRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5nZW5lcmFsLmxhbmd1YWdlLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5vVGFiSGlzdG9yeToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmdlbmVyYWwubm9UYWJIaXN0b3J5Lm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwic2V0dGluZ3MuZ2VuZXJhbC5ub1RhYkhpc3RvcnkuZGVzY3JpcHRpb25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdhbWVwbGF5OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5nYW1lcGxheS50aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBub09mZmxpbmVUaW1lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZ2FtZXBsYXkubm9PZmZsaW5lVGltZS5uYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXNwbGF5OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJzZXR0aW5ncy5kaXNwbGF5LnRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhcmtOYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZGlzcGxheS5kYXJrTmF2aWdhdGlvbi5uYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWJ1Zzoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZGVidWcudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kZWJ1Zy5sb2dnaW5nLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcmJvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kZWJ1Zy52ZXJib3NlLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQoKTogU2V0dGluZ3NUeXBlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldChzZXR0aW5nczogU2V0dGluZ3NUeXBlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHsuLi50aGlzLnNldHRpbmdzLCAuLi5zZXR0aW5nc307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCByZXNldCBsb2dpY1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLmRlZmF1bHQoKTtcclxuICAgICAgICBTYXZlSGFuZGxlci5zYXZlRGF0YSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBuYW1lc3BhY2UgVXRpbHMge1xyXG4gICAgZXhwb3J0IGNvbnN0IGdldE5lc3RlZFByb3BlcnR5ID0gKG9iajogYW55LCBwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpLnJlZHVjZSgoYWNjLCBrZXkpID0+IGFjYz8uW2tleV0sIG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGhleFRvUkdCID0gKGhleDogc3RyaW5nLCBhbHBoYT86IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGxldCBub0hhc2ggPSBoZXgucmVwbGFjZShcIiNcIiwgXCJcIik7XHJcbiAgICAgICAgbGV0IHIgPSBwYXJzZUludChub0hhc2guc2xpY2UoMCwgMiksIDE2KSxcclxuICAgICAgICAgICAgZyA9IHBhcnNlSW50KG5vSGFzaC5zbGljZSgyLCA0KSwgMTYpLFxyXG4gICAgICAgICAgICBiID0gcGFyc2VJbnQobm9IYXNoLnNsaWNlKDQsIDYpLCAxNik7XHJcblxyXG4gICAgICAgIGlmIChhbHBoYSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgciArIFwiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIsIFwiICsgYWxwaGEgKyBcIilcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIilcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IG1haW4gfSBmcm9tIFwiLi9tYWluXCI7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbik7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==