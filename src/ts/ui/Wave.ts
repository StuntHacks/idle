import { Utils } from "../utils/utils";

export class Wave {
    private config: WaveConfig;
    private canvas: HTMLCanvasElement;
    private points: WavePoint[] = [];
    private ctx: CanvasRenderingContext2D;
    private time: number = 0;
    private bounceHeight: number = 0;
    private bounceSpeed: number = 1;
    private bouncing: boolean = false;

    constructor(element: HTMLCanvasElement, container: HTMLElement, config: WaveConfig, autoStart: boolean = true) {
        this.canvas = element;
        this.config = config;
        this.ctx = this.canvas.getContext('2d');
        
        if (!this.config.height) {
            this.config.height = container.clientHeight;
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

    public start() {
        var start = performance.now();
        var self = this;

        function animate(timestamp: number) {
            self.time = self.config.speed * ((timestamp - start) / 10);
            self.draw(self.time);
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
        const noise = Math.sin((point.offset + time) * this.config.frequency) * 0.6 +
                Math.sin((point.offset * 0.5 + time * 0.8) * this.config.frequency) * 0.4;
        return this.config.offset + noise * (this.config.amplitude + this.bounceHeight);
    }

    private draw(time: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.config.colorStart);
        gradient.addColorStop(1, this.config.colorEnd);
        
        this.ctx.shadowColor = Utils.hexToRGB(this.config.colorGlow);
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

    public bounce(callback: (bounced: boolean) => void) {
        if (this.bouncing) {
            callback(false);
            return;
        }

        this.bouncing = true;
        var self = this;

        function bounceUp() {
            if (self.bounceHeight < 300) {
                self.bounceHeight += self.bounceSpeed;
                self.bounceSpeed += 0.5;
                window.requestAnimationFrame(bounceUp);
            } else {
                window.requestAnimationFrame(bounceDown);
            }
        }

        function bounceDown() {
            if (self.bounceHeight > 0) {
                self.bounceHeight -= self.bounceSpeed;
                self.bounceSpeed -= 0.1;
                window.requestAnimationFrame(bounceDown);
            } else {
                self.bounceHeight = 0;
                self.bounceSpeed = 10;
                callback(true);
                self.bouncing = false;
            }
        }

        window.requestAnimationFrame(bounceUp);
    }
}

export interface WaveConfig {
    amplitude: number;
    frequency: number;
    speed: number;
    lineWidth: number;
    colorStart: string;
    colorEnd: string;
    colorGlow: string;
    colorHover: string;
    pointCount: number;
    height?: number;
    offset?: number;
}

interface WavePoint {
    x: number;
    offset: number;
}
