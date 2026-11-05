class TimerManager {
    constructor() {
        this.timer = null;
        this.endTime = null;
    }

    start(duration, onTick, onEnd) {
        this.stop();

        this.endTime = Date.now() + duration * 1000;

        const tick = () => {
            const remaining = this.getRemainingTime();

            if (typeof onTick === "function") {
                onTick(remaining);
            }

            if (remaining <= 0) {
                this.stop();

                if (typeof onEnd === "function") {
                    onEnd();
                }

                return;
            }

            this.timer = setTimeout(tick, 1000);
        };

        tick();
    }

    getRemainingTime() {
        if (!this.endTime) return 0;

        return Math.max(
            0,
            Math.ceil((this.endTime - Date.now()) / 1000)
        );
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.endTime = null;
    }

    isRunning() {
        return this.timer !== null;
    }
}

module.exports = TimerManager;
