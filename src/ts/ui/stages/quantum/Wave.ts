import { QuantumFieldElement } from "ui/elements/quantum/QuantumFieldElement";
import { Utils } from "utils/utils";

const FPS_SAMPLE_COUNT = 30;
const FPS_SHADOW_THRESHOLD = 40;

export class Wave {
    public config: WaveConfig;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private offsets: number[] = [];
    private ripples: Ripple[] = [];
    private rafHandle: number | null = null;
    private time: number = 0;
    private hover: boolean = false;
    private contained: boolean = false;
    private cachedGradient: CanvasGradient | null = null;
    private frameDeltaSamples: number[] = [];
    private lastFrameTimestamp: number = 0;
    private shadowEnabled: boolean = true;
    private rippleGain: number = 1;
    private pointInfluence: Float32Array = new Float32Array(0);

    constructor(
        element: HTMLCanvasElement,
        container: HTMLElement,
        config: WaveConfig,
        contained: boolean = false,
        autoStart: boolean = true,
    ) {
        this.canvas = element;
        this.config = config;
        this.contained = contained;
        this.ctx = this.canvas.getContext('2d');

        this.config.height ??= container.clientHeight;
        this.config.offset ??= this.config.height / 2;

        this.handleResize();
        addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        this.initialize();

        if (autoStart) {
            this.start();
        }
    }

    public handleResize() {
        const parent = this.canvas.parentElement as QuantumFieldElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.parentElement.clientHeight;
        this.config.offset = this.contained ? parent.clientHeight / 2 : parent.getWaveOffset();
        this.cachedGradient = null;
    }

    private handleVisibilityChange() {
        if (document.hidden) {
            if (this.rafHandle !== null) {
                window.cancelAnimationFrame(this.rafHandle);
                this.rafHandle = null;
            }
        } else if (this.rafHandle === null) {
            this.start();
        }
    }

    private updateFpsAndShadow(timestamp: number) {
        if (this.lastFrameTimestamp !== 0) {
            this.frameDeltaSamples.push(timestamp - this.lastFrameTimestamp);

            if (this.frameDeltaSamples.length > FPS_SAMPLE_COUNT) {
                this.frameDeltaSamples.shift();
            }

            if (this.frameDeltaSamples.length === FPS_SAMPLE_COUNT) {
                const avgDelta = this.frameDeltaSamples.reduce((a, b) => a + b, 0) / FPS_SAMPLE_COUNT;
                this.shadowEnabled = 1000 / avgDelta >= FPS_SHADOW_THRESHOLD;
            }
        }
        this.lastFrameTimestamp = timestamp;
    }

    public setHovered(hovered: boolean) {
        this.hover = hovered;
    }

    public isHovered(): boolean {
        return this.hover;
    }

    public start() {
        const startTime = performance.now();
        this.handleResize();
        const animate = (timestamp: number) => {
            this.updateFpsAndShadow(timestamp);

            if (this.canvas.checkVisibility({ opacityProperty: true })) {
                this.time = this.config.speed * ((timestamp - startTime) / 10);
                this.draw(this.time);
            }

            this.rafHandle = window.requestAnimationFrame(animate);
        };

        this.rafHandle = window.requestAnimationFrame(animate);
    }

    private initialize() {
        this.offsets = Array.from({ length: this.config.pointCount + 1 }, () => Math.random() * 1000);
        this.pointInfluence = new Float32Array(this.config.pointCount + 1);
    }

    private getRippleOffset(i: number, now: number): number {
        const stepX = this.canvas.width / (this.config.pointCount - 1);
        const pointX = i * stepX;
        let total = 0;
        for (const r of this.ripples) {
            const age = (now - r.startTime) / 1000;
            const distance = Math.abs(pointX - r.originX) / stepX;
            const propagation = age * r.speed;
            const ease = Math.sin((Math.min(1, age / 0.1) * Math.PI) / 2);
            const falloff = Math.exp(-0.08 * (distance - propagation) ** 2);
            const wave = Math.sin(distance - propagation) + 0.3 * Math.sin(2 * (distance - propagation));
            total += r.strength * ease * falloff * wave;
        }
        return total;
    }

    private updatePointInfluence(now: number) {
        const n = this.config.pointCount;
        const lerpRate = 0.08;

        for (let i = 0; i <= n; i++) {
            const raw = this.getRippleOffset(i, now);
            this.pointInfluence[i] += (raw - this.pointInfluence[i]) * lerpRate;
        }

        const radius = Math.floor(n * 0.12);
        const blurred = new Float32Array(n + 1);
        for (let i = 0; i <= n; i++) {
            let sum = 0;
            let count = 0;
            for (let j = Math.max(0, i - radius); j <= Math.min(n, i + radius); j++) {
                sum += this.pointInfluence[j];
                count++;
            }
            blurred[i] = sum / count;
        }
        this.pointInfluence = blurred;
    }

    private cleanupRipples(now: number) {
        const stepX = this.canvas.width / (this.config.pointCount - 1);
        const threshold = 0.0001;
        this.ripples = this.ripples.filter(r => {
            const age = (now - r.startTime) / 1000;
            const propagation = age * r.speed;
            const maxDistance = Math.max(r.originX, this.canvas.width - r.originX) / stepX;

            if (propagation <= maxDistance + 4) return true;

            const ease = Math.sin((Math.min(1, age / 0.1) * Math.PI) / 2);
            const tailFalloff = Math.exp(-0.08 * (maxDistance - propagation) ** 2);
            return r.strength * ease * tailFalloff > threshold;
        });
    }

    private updateRippleGain(now: number) {
        const limit = this.config.maxRippleAmplitude;

        if (limit === undefined || this.ripples.length === 0) {
            this.rippleGain = 1;
            return;
        }

        let peak = 0;
        for (let i = 0; i < this.config.pointCount; i++) {
            const abs = Math.abs(this.getRippleOffset(i, now));
            if (abs > peak) peak = abs;
        }

        const targetGain = peak > 0 ? Math.min(1, limit / peak) : 1;

        const attackRate  = 0.2;
        const releaseRate = 0.02;
        const rate = targetGain < this.rippleGain ? attackRate : releaseRate;
        this.rippleGain += (targetGain - this.rippleGain) * rate;
    }

    private draw(time: number) {
        const { pointCount, frequency, amplitude, offset } = this.config;
        const now = performance.now();
        const ctx = this.ctx;

        this.updateRippleGain(now);
        this.updatePointInfluence(now);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.cachedGradient) {
            this.cachedGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            this.cachedGradient.addColorStop(0, this.config.color.start);
            this.cachedGradient.addColorStop(1, this.config.color.end);
        }

        if (this.shadowEnabled) {
            ctx.shadowColor = Utils.hexToRGB(this.hover ? this.config.color.hover : this.config.color.glow);
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        } else {
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
        }

        ctx.strokeStyle = this.cachedGradient;
        ctx.lineWidth = this.config.lineWidth;
        ctx.beginPath();

        const stepX = this.canvas.width / (pointCount - 1);

        const getY = (i: number) => {
            const pointOffset = this.offsets[i];
            const noise = Math.sin((pointOffset + time) * frequency) * 0.6 +
                          Math.sin((pointOffset * 0.5 + time * 0.8) * frequency) * 0.4;
            const ripple = this.getRippleOffset(i, now) * this.rippleGain;
            const influence = this.pointInfluence[i] * 0.4;
            return offset + noise * amplitude + ripple + influence;
        };

        let prevX = 0;
        let prevY = getY(0);
        ctx.moveTo(prevX, prevY);

        for (let i = 1; i < pointCount; i++) {
            const currX = i * stepX;
            const currY = getY(i);
            ctx.quadraticCurveTo(prevX, prevY, (prevX + currX) / 2, (prevY + currY) / 2);
            prevX = currX;
            prevY = currY;
        }

        ctx.lineTo(prevX, prevY);
        ctx.stroke();

        this.cleanupRipples(now);
    }

    public ripple(x: number, strength: number = 120, speed: number = 8, decay: number = 0.05) {
        const rect = this.canvas.getBoundingClientRect();
        this.ripples.push({
            originX: x - rect.left,
            startTime: performance.now(),
            strength,
            speed,
            decay,
        });
    }
}

export interface WaveConfig {
    amplitude: number;
    frequency: number;
    speed: number;
    lineWidth: number;
    color: WaveColor;
    pointCount: number;
    height?: number;
    offset?: number;
    maxRippleAmplitude?: number;
}

export interface WaveColor {
    start: string;
    end: string;
    glow: string;
    hover: string;
}

interface Ripple {
    originX: number;
    startTime: number;
    strength: number;
    speed: number;
    decay: number;
}
