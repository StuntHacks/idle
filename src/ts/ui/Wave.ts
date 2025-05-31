import { Utils } from "utils/utils";

export class Wave {
    private config: WaveConfig;
    private canvas: HTMLCanvasElement;
    private points: WavePoint[] = [];
    private ctx: CanvasRenderingContext2D;
    private time: number = 0;
    private hover: boolean = false;
    private contained: boolean = false;
    private ripples: Ripple[] = [];

    constructor(element: HTMLCanvasElement, container: HTMLElement, config: WaveConfig, contained: boolean = false, autoStart: boolean = true) {
        this.canvas = element;
        this.config = config;
        this.contained = contained;
        this.ctx = this.canvas.getContext('2d');
        
        if (!this.config.height) {
            this.config.height = container.clientHeight;
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

    private handleResize() {
        let parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.parentElement.clientHeight;
        let rect = parent.getBoundingClientRect();
        this.config.offset = this.contained ? (rect.height / 2) : rect.y + (rect.height / 2) - 90;
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

    public setHovered(hovered: boolean) {
        this.hover = hovered;
    }

    public isHovered(): boolean {
        return this.hover;
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
        const animate = (timestamp: number) => {
            if (this.canvas.checkVisibility({ opacityProperty: true })) {
                this.time = this.config.speed * ((timestamp - start) / 10);
                this.draw(this.time);
                this.cleanupRipples();
            }
            window.requestAnimationFrame(animate);
        }
        window.requestAnimationFrame(animate);
    }
    
    private initialize() {
        this.points = [];
        this.points = Array.from({ length: this.config.pointCount + 1 }, (_, i) => ({
            x: i,
            offset: Math.random() * 1000,
        }));
    }

    private getY(i: number, time: number, frequency: number, amplitude: number, offset: number) {
        const point = this.points[i];
        const noise = Math.sin((point.offset + time) * frequency) * 0.6 +
                      Math.sin((point.offset * 0.5 + time * 0.8) * frequency) * 0.4;

        let rippleOffset = 0;
        const now = performance.now();

        for (let r of this.ripples) {
            const age = (now - r.startTime) / 1000;
            const distance = Math.abs(i - r.index);
            const propagation = age * r.speed;
            const falloff = Math.exp(-r.decay * Math.pow(distance - propagation, 2));
            const ramp = Math.min(1, age / 0.5); 
            const ease = Math.sin((ramp * Math.PI) / 2);
            rippleOffset += r.strength * ease * falloff * Math.sin(distance - propagation);
        }

        return offset + (noise * amplitude + rippleOffset);
    }

    private draw(time: number) {
        const frequency = this.config.frequency;
        const amplitude = this.config.amplitude;
        const offset = this.config.offset;
        const pointCount = this.config.pointCount;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.config.color.start);
        gradient.addColorStop(1, this.config.color.end);
        
        ctx.shadowColor = Utils.hexToRGB(this.hover ? this.config.color.hover : this.config.color.glow);
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.config.lineWidth;
        ctx.beginPath();

        const stepX = this.canvas.width / (pointCount - 1);

        let prevX = 0;
        let prevY = this.getY(0, time, frequency, amplitude, offset);
        ctx.moveTo(prevX, prevY);

        for (let i = 1; i < pointCount; i++) {
            const currX = i * stepX;
            const currY = this.getY(i, time, frequency, amplitude, offset);

            const midX = (prevX + currX) / 2;
            const midY = (prevY + currY) / 2;

            ctx.quadraticCurveTo(prevX, prevY, midX, midY);

            prevX = currX;
            prevY = currY;
        }

        ctx.lineTo(prevX, prevY);
        ctx.stroke();
    }

    public ripple(x: number, strength: number = 120, speed: number = 10, decay: number = 0.05) {
        const index = Math.floor((x / this.canvas.width) * this.config.pointCount);

        this.ripples.push({
            index,
            startTime: performance.now(),
            strength,
            speed,
            decay,
        });
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
}
