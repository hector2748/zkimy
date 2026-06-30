import SmallHeartShape from "../geometry/SmallHeartShape.js";

class HeartbeatBurst {
    constructor(isMobile = false) {
        this.isMobile = isMobile;
        this.particles = [];
        this.previousIntensity = 0;

        this.heartShape = new SmallHeartShape();
    }

    update(
        deltaTime,
        pulseIntensity,
        width,
        height
    ) {
        /*
         * Generamos una sola explosión cuando
         * el latido se encuentra cerca de su punto máximo.
         */
        const triggerLevel = 0.88;

        if (
            pulseIntensity >= triggerLevel &&
            this.previousIntensity < triggerLevel
        ) {
            this.createBurst(width, height);
        }

        this.previousIntensity = pulseIntensity;

        for (const particle of this.particles) {
            particle.life -= deltaTime;

            particle.x +=
                particle.velocityX * deltaTime;

            particle.y +=
                particle.velocityY * deltaTime;

            particle.rotation +=
                particle.rotationSpeed * deltaTime;

            /*
             * Reducimos lentamente la velocidad
             * para que el movimiento sea suave.
             */
            const friction = Math.pow(
                0.35,
                deltaTime
            );

            particle.velocityX *= friction;
            particle.velocityY *= friction;

            particle.opacity = Math.max(
                particle.life /
                    particle.maximumLife,
                0
            );
        }

        this.particles =
            this.particles.filter(
                (particle) =>
                    particle.life > 0
            );
    }

    createBurst(width, height) {
        const totalParticles =
            this.isMobile ? 7 : 12;

        const desiredWidth = Math.min(
            width *
                (
                    this.isMobile
                        ? 0.8
                        : 0.48
                ),
            height * 0.78,
            560
        );

        const scale =
            desiredWidth / 32;

        const centerX =
            width / 2;

        const centerY =
            height *
            (
                this.isMobile
                    ? 0.46
                    : 0.47
            );

        for (
            let index = 0;
            index < totalParticles;
            index++
        ) {
            const angle =
                Math.random() *
                Math.PI *
                2;

            const normalizedX =
                16 *
                Math.pow(
                    Math.sin(angle),
                    3
                );

            const normalizedY =
                13 * Math.cos(angle) -
                5 * Math.cos(2 * angle) -
                2 * Math.cos(3 * angle) -
                Math.cos(4 * angle);

            const startX =
                centerX +
                normalizedX * scale;

            const startY =
                centerY -
                normalizedY * scale;

            const directionX =
                startX - centerX;

            const directionY =
                startY - centerY;

            const distance = Math.max(
                Math.hypot(
                    directionX,
                    directionY
                ),
                1
            );

            const normalizedDirectionX =
                directionX / distance;

            const normalizedDirectionY =
                directionY / distance;

            const speed =
                35 +
                Math.random() * 45;

            const life =
                1.2 +
                Math.random() * 0.7;

            this.particles.push({
                x: startX,
                y: startY,

                velocityX:
                    normalizedDirectionX *
                        speed +
                    (Math.random() - 0.5) *
                        20,

                velocityY:
                    normalizedDirectionY *
                        speed +
                    (Math.random() - 0.5) *
                        20,

                size: this.isMobile
                    ? 4 + Math.random() * 2
                    : 5 + Math.random() * 2.5,

                rotation:
                    (Math.random() - 0.5) *
                    Math.PI,

                rotationSpeed:
                    (Math.random() - 0.5) *
                    1.7,

                opacity: 1,

                life,
                maximumLife: life,

                color:
                    this.getRandomColor(),

                glow:
                    3 +
                    Math.random() * 4
            });
        }
    }

    getRandomColor() {
        const probability =
            Math.random();

        if (probability < 0.55) {
            return "#ff4f9a";
        }

        if (probability < 0.82) {
            return "#ff82bd";
        }

        if (probability < 0.94) {
            return "#d36cff";
        }

        if (probability < 0.98) {
            return "#8dcaff";
        }

        return "#ffffff";
    }

    draw(context) {
        if (this.particles.length === 0) {
            return;
        }

        context.save();

        context.globalCompositeOperation =
            "screen";

        for (const particle of this.particles) {
            const lifeProgress =
                particle.life /
                particle.maximumLife;

            /*
             * Se hacen ligeramente pequeños
             * antes de desaparecer.
             */
            const currentSize =
                particle.size *
                (
                    0.7 +
                    lifeProgress * 0.3
                );

            this.heartShape.draw(
                context,
                {
                    x: particle.x,
                    y: particle.y,
                    size: currentSize,
                    color: particle.color,
                    opacity:
                        particle.opacity *
                        0.9,
                    rotation:
                        particle.rotation,
                    glow: particle.glow
                }
            );
        }

        context.restore();
    }
}

export default HeartbeatBurst;