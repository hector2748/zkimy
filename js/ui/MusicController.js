class MusicController {
    constructor(
        audioElement,
        buttonElement,
        options = {}
    ) {
        this.audio = audioElement;
        this.button = buttonElement;

        this.targetVolume = this.clamp(
            options.volume ?? 0.5,
            0,
            1
        );

        this.fadeDuration = Math.max(
            options.fadeDuration ?? 2500,
            0
        );

        this.isMuted = false;
        this.fadeAnimation = null;

        if (this.audio) {
            this.audio.volume = 0;
        }

        if (this.button) {
            this.button.addEventListener(
                "click",
                () => this.toggleMute()
            );
        }
    }

    async start() {
        if (!this.audio) {
            console.warn(
                "No se encontró el elemento de música."
            );

            return;
        }

        try {
            await this.audio.play();

            this.button?.classList.add(
                "is-visible"
            );

            this.fadeTo(
                this.targetVolume,
                this.fadeDuration
            );
        } catch (error) {
            console.error(
                "No fue posible reproducir la música:",
                error
            );
        }
    }

    toggleMute() {
        if (!this.audio) {
            return;
        }

        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;

        if (!this.button) {
            return;
        }

        if (this.isMuted) {
            this.button.textContent = "🔇";

            this.button.setAttribute(
                "aria-label",
                "Activar música"
            );
        } else {
            this.button.textContent = "🔊";

            this.button.setAttribute(
                "aria-label",
                "Silenciar música"
            );
        }
    }

    fadeTo(targetVolume, duration) {
        if (!this.audio) {
            return;
        }

        if (this.fadeAnimation) {
            cancelAnimationFrame(
                this.fadeAnimation
            );
        }

        const safeTargetVolume = this.clamp(
            targetVolume,
            0,
            1
        );

        if (duration <= 0) {
            this.audio.volume =
                safeTargetVolume;

            return;
        }

        const initialVolume = this.clamp(
            this.audio.volume,
            0,
            1
        );

        const startTime = performance.now();

        const animateVolume = (currentTime) => {
            const elapsedTime = Math.max(
                currentTime - startTime,
                0
            );

            const progress = this.clamp(
                elapsedTime / duration,
                0,
                1
            );

            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const newVolume =
                initialVolume +
                (
                    safeTargetVolume -
                    initialVolume
                ) *
                easedProgress;

            this.audio.volume = this.clamp(
                newVolume,
                0,
                1
            );

            if (progress < 1) {
                this.fadeAnimation =
                    requestAnimationFrame(
                        animateVolume
                    );
            } else {
                this.fadeAnimation = null;
            }
        };

        this.fadeAnimation =
            requestAnimationFrame(
                animateVolume
            );
    }

    clamp(value, minimum, maximum) {
        return Math.min(
            Math.max(value, minimum),
            maximum
        );
    }
}

export default MusicController;