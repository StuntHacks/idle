export type FrameCallback = (timestamp: number) => void;

export class RenderLoop {
    private static subscribers = new Set<FrameCallback>();
    private static frameId: number | null = null;

    public static subscribe(callback: FrameCallback) {
        this.subscribers.add(callback);
        if (this.frameId === null) {
            this.frameId = window.requestAnimationFrame(this.frame);
        }
    }

    public static unsubscribe(callback: FrameCallback) {
        this.subscribers.delete(callback);
        if (this.subscribers.size === 0 && this.frameId !== null) {
            window.cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    private static frame = (timestamp: number) => {
        RenderLoop.frameId = window.requestAnimationFrame(RenderLoop.frame);
        for (const callback of RenderLoop.subscribers) {
            callback(timestamp);
        }
    }
}
