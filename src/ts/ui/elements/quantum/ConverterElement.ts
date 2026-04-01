import { useTranslation } from "i18n/i18n";
import { RenderClock } from "ui/RenderClock";

type ToggleCallback = (force?: boolean) => void;

const SPIN_KEYFRAMES: Keyframe[] = [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
];

const ICON_KEYFRAMES: Keyframe[][] = [
    [{ transform: 'rotate(-45deg) translateY(-40px) rotate(0deg)' }, { transform: 'rotate(-45deg) translateY(-40px) rotate(-360deg)' }],
    [{ transform: 'rotate(-45deg) rotate(120deg) translateY(-40px) rotate(-120deg)' }, { transform: 'rotate(-45deg) rotate(120deg) translateY(-40px) rotate(-480deg)' }],
    [{ transform: 'rotate(-45deg) rotate(240deg) translateY(-40px) rotate(-240deg)' }, { transform: 'rotate(-45deg) rotate(240deg) translateY(-40px) rotate(-600deg)' }],
];

export class ConverterElement extends HTMLElement {
    private intervalElement: HTMLElement;
    private labelElement: HTMLElement;
    private effectElement: HTMLElement;
    private progressElement: HTMLElement | null = null;
    private toggleCallback: ToggleCallback;
    private intervalText: string = "";
    private effectText: string = "";
    private enabled: boolean = false;
    private running: boolean;
    private spinningTarget: boolean = false;

    private acc: number = 0;
    private interval: number = 0;
    private tickLength: number = 50;
    private renderFrame: number | null = null;

    private circleAnim: Animation | null = null;
    private iconAnims: Animation[] = [];
    private tweenFrame: number | null = null;
    private currentRate: number = 1;

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
        this.toggleAttribute("disabled", !enabled);
        if (this.labelElement) {
            this.labelElement.textContent = useTranslation(enabled ?
                "stages.quantum.energy.conversion.disable" :
                "stages.quantum.energy.conversion.enable"
            );
        }
        if (!enabled && this.progressElement) {
            this.progressElement.style.clipPath = "xywh(0 -5px 0% calc(100% + 10px))";
        }
        this.setSpinning(enabled && this.running);
    }

    public setLocked(locked: boolean) {
        this.toggleAttribute("locked", locked);
        if (this.labelElement) {
            this.labelElement.textContent = useTranslation(locked ?
                "stages.quantum.energy.conversion.locked" :
                "stages.quantum.energy.conversion.enable"
            );
        }

        setTimeout(() => {
            this.classList.toggle("unlocked", !locked);
        }, locked ? 0 : 150);
    }

    public setRunning(running: boolean) {
        if (this.running === running) return;

        this.running = running;
        this.toggleAttribute("blocked", !running);
        this.setSpinning(running);
    }

    public setToggleCallback(toggleCallback: ToggleCallback) {
        if (!this.toggleCallback) {
            this.toggleCallback = toggleCallback;
            this.addEventListener("click", () => this.toggleCallback());
        }
    }

    public setProgress(acc: number, interval: number, tickLength: number) {
        this.acc = acc;
        this.interval = interval;
        this.tickLength = tickLength;
    }

    public setEffectText(text: string) {
        if (text === this.effectText) return;
        this.effectText = text;
        this.effectElement.innerHTML = `<span>${text}</span>`;
    }

    public setInterval(interval: number) {
        const text = interval >= 1000 ? `${(interval / 1000).toFixed(2)}s` : `${interval.toFixed(0)}ms`;
        if (text === this.intervalText) return;
        this.intervalElement.textContent = text;
        this.intervalText = text;
        this.updateSpinSpeed(interval);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.intervalElement = this.querySelector(".interval");
        this.labelElement = this.querySelector(".toggle-label");
        this.effectElement = this.querySelector(".output");
        this.progressElement = this.querySelector(".progress");
        this.initAnimations();
        this.renderFrame = requestAnimationFrame(this.renderLoop);
    }

    disconnectedCallback() {
        this.stopAnimations();
        if (this.renderFrame !== null) cancelAnimationFrame(this.renderFrame);
    }

    private renderLoop = () => {
        this.renderFrame = requestAnimationFrame(this.renderLoop);
        if (!this.progressElement || this.interval === 0) return;

        let visual: number;
        if (!this.enabled) {
            visual = Math.min(this.acc / this.interval, 1);
        } else {
            const subTickAcc = this.acc + (this.tickLength * RenderClock.alpha);
            visual = Math.min(subTickAcc / this.interval, 1);
        }

        if (!this.running) {
            visual = 0;
        }

        this.progressElement.style.clipPath = `xywh(0 -5px ${visual * 100}% calc(100% + 10px))`;
    }

    private initAnimations(): void {
        const circle = this.querySelector(".circle");
        if (!circle) return;

        const icons = circle.querySelectorAll(".particle");
        const opts: KeyframeAnimationOptions = { duration: 4000, iterations: Infinity, easing: 'linear' };

        this.circleAnim = circle.animate(SPIN_KEYFRAMES, opts);
        this.iconAnims = Array.from(icons).map((el, i) => el.animate(ICON_KEYFRAMES[i], opts));

        this.allAnimations.forEach(a => a.pause());
    }

    private get allAnimations(): Animation[] {
        return this.circleAnim ? [this.circleAnim, ...this.iconAnims] : [];
    }

    private setSpinning(spinning: boolean): void {
        this.spinningTarget = spinning;

        if (this.tweenFrame !== null) {
            cancelAnimationFrame(this.tweenFrame);
            this.tweenFrame = null;
        }

        const current = this.allAnimations[0]?.playbackRate ?? this.currentRate;

        if (spinning) {
            this.setPlaybackRate(this.currentRate);
            this.allAnimations.forEach(a => a.play());
        } else {
            this.tweenPlaybackRate(current, 0, () => {
                if (!this.spinningTarget) {
                    this.allAnimations.forEach(a => a.pause());
                }
            });
        }
    }

    private updateSpinSpeed(interval: number): void {
        const duration = Math.max(200, interval * 0.8);
        this.currentRate = 4000 / duration;
        if (this.running) {
            const current = this.allAnimations[0]?.playbackRate ?? this.currentRate;
            this.tweenPlaybackRate(current, this.currentRate);
        }
    }

    private setPlaybackRate(rate: number): void {
        const finalRate = Math.abs(rate) < 0.001 ? 0 : rate;
        this.allAnimations.forEach(a => a.playbackRate = finalRate);
    }

    private tweenPlaybackRate(from: number, to: number, onDone?: () => void): void {
        if (this.tweenFrame !== null) cancelAnimationFrame(this.tweenFrame);
        const start = performance.now();

        const step = (now: number): void => {
            const t = Math.min((now - start) / 600, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            this.setPlaybackRate(from + (to - from) * eased);
            if (t < 1) {
                this.tweenFrame = requestAnimationFrame(step);
            } else {
                this.setPlaybackRate(to);
                onDone?.();
            }
        };
        this.tweenFrame = requestAnimationFrame(step);
    }

    private stopAnimations(): void {
        if (this.tweenFrame !== null) cancelAnimationFrame(this.tweenFrame);
        this.allAnimations.forEach(a => a.cancel());
    }
}
