import { Currency, InferredCurrency, useCurrency } from "game_logic/currencies/Currencies"
import { Numbers } from "numbers/numbers";
import { QuantumFieldElement } from "./quantum/QuantumFieldElement";
import Decimal from "break_eternity.js";

export class CurrencyElement extends HTMLElement {
    private static subscribers = new Set<CurrencyElement>();
    private static tickerRunning = false;

    private static startTicker() {
        if (this.tickerRunning) return;
        this.tickerRunning = true;

        const tick = () => {
            for (const el of this.subscribers) {
                el.tick();
            }
            window.requestAnimationFrame(tick);
        };

        window.requestAnimationFrame(tick);
    }

    private currencies: string[] = [];
    private element: HTMLSpanElement;
    private inferred: boolean;
    private max: string;
    private counter: boolean;
    private last: string;
    private precision: number;
    private cutoffUpper: string;
    private cutoffLower: string;

    constructor() {
        super();
    }

    private getValue(): string {
        let text;

        if (this.inferred) {
            const c = useCurrency(this.currencies[0]);
            if (!c?.inferred) return "?";
            text = (c as InferredCurrency).handler.getFormatted(undefined, this.precision, { upper: this.cutoffUpper, lower: this.cutoffLower });
        } else {
            let amount = new Decimal(0);
            for (const hash of this.currencies) {
                const found = useCurrency(hash);
                if (found && !found.inferred) {
                    amount = amount.plus((found as Currency).amount);
                }
            }

            text = Numbers.getFormatted(amount, this.precision, { upper: this.cutoffUpper, lower: this.cutoffLower });
        }

        if (this.counter) text += `/${this.max}`;
        return text;
    }

    private tick() {
        const value = this.getValue();
        if (value !== this.last) {
            this.last = value;
            this.element.innerText = value;
        }
    }

    connectedCallback() {
        const name = this.getAttribute("name");
        this.element = document.createElement("span");
        this.appendChild(this.element);
        this.inferred = this.hasAttribute("inferred");
        this.precision = parseInt(this.getAttribute("precision") || "2", 10);
        this.cutoffLower = this.getAttribute("cutoff-lower");
        this.cutoffUpper = this.getAttribute("cutoff-upper");

        if (this.hasAttribute("counter")) {
            this.counter = true;
            this.max = this.getAttribute("max");
        }

        const fieldId = this.getAttribute("field-id");
        if (fieldId) {
            const fieldElement = document.getElementById(`${fieldId}-field`) as QuantumFieldElement;
            if (fieldElement) {
                this.addEventListener("mouseenter", () => {
                    fieldElement.ripplePassive(Math.floor(Math.random() * window.innerWidth));
                });
            }
        }

        if (name) {
            this.currencies = name.split(",");
            CurrencyElement.subscribers.add(this);
            CurrencyElement.startTicker();
        }
    }

    disconnectedCallback() {
        CurrencyElement.subscribers.delete(this);
    }
}
