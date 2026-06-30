import SmallHeartShape from "../geometry/SmallHeartShape.js";

class HeartFormationSystem {
    constructor(isMobile = false) {
        this.isMobile = isMobile;
        this.time = 0;
        this.hearts = [];

        this.heartShape = new SmallHeartShape();
    }

    setTargets(points, width, height) {
        if (!Array.isArray(points) || points.length === 0) {
            return;
        }

        let minimumY = Infinity;
        let maximumY = -Infinity;

        for (const point of points) {
            minimumY = Math.min(minimumY, point.y);
            maximumY = Math.max(maximumY, point.y);
        }

        /*
         * La primera vez se crean todos los corazones.
         */
        if (this.hearts.length !== points.length) {
            this.hearts = points.map((point, index) => {
                return this.createHeart(
                    point,
                    index,
                    minimumY,
                    maximumY,
                    width,
                    height
                );
            });

            return;
        }

        /*
         * Si cambia el tamaño de la ventana,
         * actualizamos las posiciones finales.
         */
        for (let index = 0; index < points.length; index++) {
            this.hearts[index].targetX = points[index].x;
            this.hearts[index].targetY = points[index].y;
        }
    }

    createHeart(
        point,
        index,
        minimumY,
        maximumY,
        width,
        height
    ) {
        const startPosition = this.createStartPosition(
            width,
            height
        );

        const verticalRange = Math.max(
            maximumY - minimumY,
            1
        );

        /*
         * La punta inferior se formará antes
         * que la parte superior.
         */
        const verticalProgress =
            (maximumY - point.y) / verticalRange;

        return {
            x: startPosition.x,
            y: startPosition.y,

            startX: startPosition.x,
            startY: startPosition.y,

            targetX: point.x,
            targetY: point.y,

            size: this.isMobile
    ? 5.2 + Math.random() * .7
    : 6.1 + Math.random() * .8,

            opacity: 0,

            targetOpacity:
                0.88 + Math.random() * 0.12,

            appearDelay:
                Math.random() * 2.2,

            formationDelay:
                3.1 +
                verticalProgress * 1.8 +
                Math.random() * 0.45,

            formationDuration:
                2.1 + Math.random() * 0.9,

            rotation:
                (Math.random() - 0.5) *
                Math.PI *
                1.5,

            startRotation:
                (Math.random() - 0.5) *
                Math.PI *
                1.5,

            targetRotation:
                (Math.random() - 0.5) * 0.18,

            phase:
                Math.random() * Math.PI * 2,

            floatSpeed:
                0.5 + Math.random() * 0.7,

            floatAmount:
                5 + Math.random() * 12,

            glow:
                Math.random() < 0.08
                    ? 3 + Math.random() * 3
                    : 0,

            color: this.getRandomColor(),

            index
        };
    }

    createStartPosition(width, height) {
        /*
         * La mayoría comenzará dispersa
         * dentro de la pantalla.
         */
        if (Math.random() < 0.75) {
            return {
                x:
                    width * 0.05 +
                    Math.random() * width * 0.9,

                y:
                    height * 0.05 +
                    Math.random() * height * 0.9
            };
        }

        /*
         * Algunos entrarán desde los bordes.
         */
        const side = Math.floor(Math.random() * 4);

        if (side === 0) {
            return {
                x: Math.random() * width,
                y: -30
            };
        }

        if (side === 1) {
            return {
                x: width + 30,
                y: Math.random() * height
            };
        }

        if (side === 2) {
            return {
                x: Math.random() * width,
                y: height + 30
            };
        }

        return {
            x: -30,
            y: Math.random() * height
        };
    }

   getRandomColor() {
    const probability = Math.random();

    if (probability < 0.45) {
        return "#ff4f9a";
    }

    if (probability < 0.75) {
        return "#ff70ad";
    }

    if (probability < 0.92) {
        return "#ff91c2";
    }

    return "#f55ca1";
}

    update(deltaTime) {
        this.time += deltaTime;

        for (const heart of this.hearts) {
            this.updateHeart(heart);
        }
    }

    updateHeart(heart) {
        const appearProgress = this.clamp(
            (this.time - heart.appearDelay) / 0.8,
            0,
            1
        );

        heart.opacity =
            heart.targetOpacity *
            this.easeOutCubic(appearProgress);

        const formationProgress = this.clamp(
            (
                this.time -
                heart.formationDelay
            ) / heart.formationDuration,
            0,
            1
        );

        const easedProgress =
            this.easeInOutCubic(formationProgress);

        /*
         * Mientras están dispersos,
         * flotan suavemente.
         */
        const remainingMovement =
            1 - easedProgress;

        const floatingX =
            Math.sin(
                this.time * heart.floatSpeed +
                heart.phase
            ) *
            heart.floatAmount *
            remainingMovement;

        const floatingY =
            Math.cos(
                this.time *
                heart.floatSpeed *
                0.8 +
                heart.phase
            ) *
            heart.floatAmount *
            0.6 *
            remainingMovement;

        heart.x =
            this.lerp(
                heart.startX,
                heart.targetX,
                easedProgress
            ) + floatingX;

        heart.y =
            this.lerp(
                heart.startY,
                heart.targetY,
                easedProgress
            ) + floatingY;

        heart.rotation =
            this.lerp(
                heart.startRotation,
                heart.targetRotation,
                easedProgress
            );

        /*
         * Cuando llegan, conservan un
         * movimiento casi imperceptible.
         */
        if (formationProgress >= 1) {
            heart.x =
    heart.targetX +
    Math.sin(
        this.time * 0.8 +
        heart.phase
    ) * 0.18;

heart.y =
    heart.targetY +
    Math.cos(
        this.time * 0.7 +
        heart.phase
    ) * 0.18;
        }
    }

    draw(context) {
        context.save();

        context.globalCompositeOperation = "screen";

        for (const heart of this.hearts) {
            const shimmer =
                1 +
                Math.sin(
                    this.time * 1.2 +
                    heart.phase
                ) * 0.025;

            this.heartShape.draw(context, {
                x: heart.x,
                y: heart.y,

                size:
                    heart.size * shimmer,

                color: heart.color,
                opacity: heart.opacity,
                rotation: heart.rotation,
                glow: heart.glow
            });
        }

        context.restore();
    }

    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    clamp(value, minimum, maximum) {
        return Math.min(
            Math.max(value, minimum),
            maximum
        );
    }

    easeOutCubic(value) {
        return 1 - Math.pow(1 - value, 3);
    }

    easeInOutCubic(value) {
        if (value < 0.5) {
            return 4 * value * value * value;
        }

        return (
            1 -
            Math.pow(-2 * value + 2, 3) / 2
        );
    }
    isFormationComplete() {
    if (this.hearts.length === 0) {
        return false;
    }

    return this.hearts.every((heart) => {
        const finishTime =
            heart.formationDelay +
            heart.formationDuration;

        return this.time >= finishTime;
    });
}
}

export default HeartFormationSystem;