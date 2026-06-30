class TapHeartEffect {
    constructor(isMobile = false) {
        this.isMobile = isMobile;

        this.particles = [];

        this.maximumParticles =
            isMobile ? 90 : 140;

        this.colors = [
            "#ff4f9a",
            "#ff67aa",
            "#ff82bb",
            "#ff9bca",
            "#ffc0dd"
        ];

        this.heartPath =
            this.createHeartPath();
    }

    createHeartPath() {
        const path =
            new Path2D();

        path.moveTo(
            0,
            -5
        );

        path.bezierCurveTo(
            -8,
            -14,
            -20,
            -6,
            -20,
            6
        );

        path.bezierCurveTo(
            -20,
            17,
            -8,
            24,
            0,
            31
        );

        path.bezierCurveTo(
            8,
            24,
            20,
            17,
            20,
            6
        );

        path.bezierCurveTo(
            20,
            -6,
            8,
            -14,
            0,
            -5
        );

        path.closePath();

        return path;
    }

    getRandomColor() {
        const index =
            Math.floor(
                Math.random() *
                this.colors.length
            );

        return this.colors[index];
    }

    create(
        x,
        y
    ) {
        /*
         * Corazón principal que aparece
         * exactamente donde se tocó.
         */
        this.particles.push({
            type: "main",

            x,
            y,

            velocityX:
                (
                    Math.random() -
                    0.5
                ) *
                14,

            velocityY:
                -32 -
                Math.random() *
                18,

            size:
                this.isMobile
                    ? 20 +
                        Math.random() * 7
                    : 23 +
                        Math.random() * 9,

            rotation:
                (
                    Math.random() -
                    0.5
                ) *
                0.2,

            rotationSpeed:
                (
                    Math.random() -
                    0.5
                ) *
                0.4,

            elapsed: 0,

            lifetime:
                0.9 +
                Math.random() *
                0.25,

            color:
                this.getRandomColor()
        });

        /*
         * Corazones pequeños que salen
         * alrededor del corazón principal.
         */
        const totalSmallHearts =
            this.isMobile
                ? 6
                : 9;

        for (
            let index = 0;
            index < totalSmallHearts;
            index++
        ) {
            const angle =
                (
                    Math.PI *
                    2 *
                    index
                ) /
                    totalSmallHearts +
                (
                    Math.random() -
                    0.5
                ) *
                    0.6;

            const speed =
                45 +
                Math.random() *
                65;

            this.particles.push({
                type: "small",

                x:
                    x +
                    (
                        Math.random() -
                        0.5
                    ) *
                        8,

                y:
                    y +
                    (
                        Math.random() -
                        0.5
                    ) *
                        8,

                velocityX:
                    Math.cos(angle) *
                    speed,

                velocityY:
                    Math.sin(angle) *
                        speed -
                    25,

                size:
                    5 +
                    Math.random() *
                    6,

                rotation:
                    Math.random() *
                    Math.PI *
                    2,

                rotationSpeed:
                    (
                        Math.random() -
                        0.5
                    ) *
                    4,

                elapsed: 0,

                lifetime:
                    0.65 +
                    Math.random() *
                    0.55,

                color:
                    this.getRandomColor()
            });
        }

        /*
         * Evita acumular demasiadas partículas
         * cuando se toca muchas veces.
         */
        if (
            this.particles.length >
            this.maximumParticles
        ) {
            this.particles.splice(
                0,
                this.particles.length -
                    this.maximumParticles
            );
        }
    }

    update(deltaTime) {
        for (
            const particle
            of this.particles
        ) {
            particle.elapsed +=
                deltaTime;

            const friction =
                Math.pow(
                    0.25,
                    deltaTime
                );

            particle.velocityX *=
                friction;

            /*
             * Los corazones suben suavemente.
             */
            particle.velocityY -=
                5 *
                deltaTime;

            particle.x +=
                particle.velocityX *
                deltaTime;

            particle.y +=
                particle.velocityY *
                deltaTime;

            particle.rotation +=
                particle.rotationSpeed *
                deltaTime;
        }

        this.particles =
            this.particles.filter(
                (particle) =>
                    particle.elapsed <
                    particle.lifetime
            );
    }

    getScale(
        particle,
        progress
    ) {
        if (
            particle.type ===
            "main"
        ) {
            /*
             * Efecto pop al aparecer.
             */
            if (progress < 0.22) {
                const entrance =
                    progress /
                    0.22;

                return (
                    0.2 +
                    this.easeOutBack(
                        entrance
                    ) *
                        0.8
                );
            }

            return (
                1 -
                (
                    progress -
                    0.22
                ) *
                    0.25
            );
        }

        /*
         * Los corazones pequeños aparecen
         * rápidamente y se hacen más pequeños.
         */
        if (progress < 0.15) {
            return (
                progress /
                0.15
            );
        }

        return (
            1 -
            progress *
                0.35
        );
    }

    easeOutBack(value) {
        const amount = 1.70158;
        const shifted =
            value - 1;

        return (
            1 +
            (
                amount + 1
            ) *
                Math.pow(
                    shifted,
                    3
                ) +
            amount *
                Math.pow(
                    shifted,
                    2
                )
        );
    }

    draw(context) {
        if (
            !context ||
            this.particles.length === 0
        ) {
            return;
        }

        context.save();

        context.globalCompositeOperation =
            "lighter";

        for (
            const particle
            of this.particles
        ) {
            const progress =
                Math.min(
                    particle.elapsed /
                        particle.lifetime,
                    1
                );

            const opacity =
                Math.pow(
                    1 - progress,
                    1.4
                );

            const scale =
                this.getScale(
                    particle,
                    progress
                );

            context.save();

            context.translate(
                particle.x,
                particle.y
            );

            context.rotate(
                particle.rotation
            );

            const normalizedScale =
                (
                    particle.size /
                    40
                ) *
                scale;

            context.scale(
                normalizedScale,
                normalizedScale
            );

            context.globalAlpha =
                opacity;

            context.fillStyle =
                particle.color;

            context.shadowColor =
                particle.color;

            context.shadowBlur =
                particle.type ===
                "main"
                    ? 18
                    : 9;

            context.fill(
                this.heartPath
            );

            /*
             * Pequeño centro blanco para dar
             * una sensación de brillo.
             */
            if (
                particle.type ===
                    "main" &&
                progress < 0.55
            ) {
                context.globalAlpha =
                    opacity *
                    0.35;

                context.fillStyle =
                    "#ffffff";

                context.shadowColor =
                    "#ffffff";

                context.shadowBlur =
                    12;

                context.scale(
                    0.42,
                    0.42
                );

                context.fill(
                    this.heartPath
                );
            }

            context.restore();
        }

        context.restore();
    }
}

export default TapHeartEffect;