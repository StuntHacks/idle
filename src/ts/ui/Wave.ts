import { Utils } from "../utils/utils";

export class Wave {
    private config: WaveConfig;
    private canvas: HTMLCanvasElement;
    private points: WavePoint[] = [];
    private ctx: CanvasRenderingContext2D;
    private time: number = 0;
    private hover: boolean = false;
    private clicked: boolean = false;
    private clickPos: number = 0;
    private ripples: Ripple[] = [];

    constructor(element: HTMLCanvasElement, container: HTMLElement, config: WaveConfig, autoStart: boolean = true) {
        this.canvas = element;
        this.config = config;
        this.ctx = this.canvas.getContext('2d');

        container.addEventListener('mousemove', (e: MouseEvent) => {
            if (this.checkHover(e.clientY)) {
                if (!this.hover) {
                    this.ripple(e.clientX, false, 20, 10, 0.05);
                }

                this.clickPos = e.clientX;
                this.hover = true;
                this.canvas.classList.add("hovered");
            } else {
                this.hover = false;
                this.canvas.classList.remove("hovered");
            }
        });

        container.addEventListener('mousedown', () => {
            this.clicked = true;
        });

        container.addEventListener('mouseup', () => {
            this.clicked = false;
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

    private checkHover(y: number): boolean {
        return y > this.config.offset + 100 && y < this.config.offset + 150;
    }

    private handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.config.height;
    }

    public setConfig(config: WaveConfig) {
        this.config = config;
    }

    public setAmplitude(amplitude: number) {
        this.config.amplitude = amplitude;
    }

    public getAmplitude(): number {
        return this.config.amplitude;
    }

    public setFrequency(frequency: number) {
        this.config.frequency = frequency;
    }

    public getFrequency(): number {
        return this.config.frequency;
    }

    public setSpeed(speed: number) {
        this.config.speed = speed;
    }

    public getSpeed(): number {
        return this.config.speed;
    }

    private cleanupRipples() {
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

    public start() {
        var start = performance.now();
        var self = this;

        function animate(timestamp: number) {
            self.time = self.config.speed * ((timestamp - start) / 10);
            self.draw(self.time);
            self.cleanupRipples();
            if (self.hover && self.clicked) {
                self.ripple(self.clickPos, true, 160);
            }
            window.requestAnimationFrame(animate);
        }
        window.requestAnimationFrame(animate);
    }
    
    private initialize() {
        this.points = [];

        for (let i = 0; i <= this.config.pointCount; i++) {
            this.points.push({
                x: i,
                offset: Math.random() * 1000,
            });
        }
    }

    private getY(i: number, time: number) {
        const point = this.points[i];
        const baseNoise =
            Math.sin((point.offset + time) * this.config.frequency) * 0.6 +
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

    private draw(time: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.config.color.start);
        gradient.addColorStop(1, this.config.color.end);
        
        this.ctx.shadowColor = Utils.hexToRGB(this.hover ? this.config.color.hover : this.config.color.glow);
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

    public ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05) {
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

export interface WaveConfig {
    particle: WaveParticleInfo;
    amplitude: number;
    frequency: number;
    speed: number;
    lineWidth: number;
    color: WaveColor;
    pointCount: number;
    height?: number;
    offset?: number;
    rippleDelay?: number;
    rippleCallback?: (x: number, manual: boolean, particle: WaveParticleInfo, index: number) => boolean;
    index: number;
}

export interface WaveParticleInfo {
    type?: string;
    flavor?: string;
    color?: string;
    all?: boolean;
}

export interface WaveColor {
    start: string;
    end: string;
    glow: string;
    hover: string;
}

interface WavePoint {
    x: number;
    offset: number;
}

interface Ripple {
    index: number;
    startTime: number;
    strength: number;
    speed: number;
    decay: number;
    manual: boolean;
}
