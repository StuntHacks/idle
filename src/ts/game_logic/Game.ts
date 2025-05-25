export class Game {
    public static update() {
        let self = this;

        const loop = () => {
            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }
}
