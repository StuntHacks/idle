import { useTranslation } from "i18n/i18n";

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
    private toggleCallback: ToggleCallback;
    private intervalText: string = "";
    private effectText: string = "";

    private circleAnim: Animation | null = null;
    private iconAnims: Animation[] = [];
    private tweenRaf: number | null = null;
    private currentRate: number = 1;

    public setEnabled(enabled: boolean) {
        this.toggleAttribute("disabled", !enabled);
        if (this.labelElement) {
            this.labelElement.textContent = useTranslation(enabled ?
                "stages.quantum.energy.conversion.disable" :
                "stages.quantum.energy.conversion.enable"
            );
        }
        this.setSpinning(enabled);
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

    public setToggleCallback(toggleCallback: ToggleCallback) {
        if (!this.toggleCallback) {
            this.toggleCallback = toggleCallback;
            this.addEventListener("click", () => this.toggleCallback());
        }
    }

    public setProgress(progress: number) {
        void progress;
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
        this.initAnimations();
    }

    disconnectedCallback() {
        this.stopAnimations();
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
        if (this.tweenRaf !== null) {
            cancelAnimationFrame(this.tweenRaf);
            this.tweenRaf = null;
        }

        if (spinning) {
            this.setPlaybackRate(this.currentRate);
            this.allAnimations.forEach(a => a.play());
        } else {
            this.tweenPlaybackRate(this.currentRate, 0, () => {
                this.allAnimations.forEach(a => a.pause());
            });
        }
    }

    private updateSpinSpeed(interval: number): void {
        const duration = Math.max(200, interval * 0.8);
        this.currentRate = 4000 / duration;
        if (!this.hasAttribute("disabled")) {
            this.tweenPlaybackRate(this.allAnimations[0]?.playbackRate ?? this.currentRate, this.currentRate);
        }
    }

    private setPlaybackRate(rate: number): void {
        this.allAnimations.forEach(a => a.playbackRate = rate);
    }

    private tweenPlaybackRate(from: number, to: number, onDone?: () => void): void {
        if (this.tweenRaf !== null) cancelAnimationFrame(this.tweenRaf);
        const start = performance.now();

        const step = (now: number): void => {
            const t = Math.min((now - start) / 600, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            this.setPlaybackRate(from + (to - from) * eased);
            if (t < 1) {
                this.tweenRaf = requestAnimationFrame(step);
            } else {
                this.setPlaybackRate(to);
                onDone?.();
            }
        };
        this.tweenRaf = requestAnimationFrame(step);
    }

    private stopAnimations(): void {
        if (this.tweenRaf !== null) cancelAnimationFrame(this.tweenRaf);
        this.allAnimations.forEach(a => a.cancel());
    }
}
