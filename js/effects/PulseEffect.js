class PulseEffect {
    constructor(isMobile = false) {
        this.time = 0;

        // Espera a que el corazón termine de formarse.
        this.startDelay = 8.6;

        // Tiempo total entre latidos.
        this.cycleDuration = 2.2;

        // Duración de la expansión y el regreso.
        this.pulseDuration = 0.75;

        // Intensidad con la que crece el corazón.
        this.strength = isMobile ? 0.05 : 0.065;
    }

    update(deltaTime) {
        this.time += deltaTime;
    }

    getPulseWave() {
        if (this.time < this.startDelay) {
            return 0;
        }

        const elapsedTime =
            this.time - this.startDelay;

        const cycleTime =
            elapsedTime % this.cycleDuration;

        if (cycleTime > this.pulseDuration) {
            return 0;
        }

        const progress =
            cycleTime / this.pulseDuration;

        return (
            0.5 -
            0.5 *
            Math.cos(
                progress * Math.PI * 2
            )
        );
    }

    getScale() {
        return (
            1 +
            this.getPulseWave() *
            this.strength
        );
    }

    getIntensity() {
        return this.getPulseWave();
    }
}

export default PulseEffect;