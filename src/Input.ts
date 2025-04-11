export class Input {
    keys: Record<string, boolean> = {};

    constructor() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isKeyDown(code: string): boolean {
        return this.keys[code] === true;
    }
}
