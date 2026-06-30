import SmallHeartShape from "../geometry/SmallHeartShape.js";

class HeartSystem {
    constructor(totalHearts = 30, isMobile = false) {
        this.time = 0;
        this.hearts = [];

        this.totalHearts = totalHearts;
        this.isMobile = isMobile;

        this.heartShape = new SmallHeartShape();

        /*
         * Los corazones comienzan distribuidos
         * dentro de la pantalla.
         */
        for (
            let index = 0;
            index < this.totalHearts;
            index++
        ) {
            this.hearts.push(
                this.createHeart(true)
            );
        }
    }

    createHeart(startVisible = false) {
        const side =
            Math.floor(Math.random() * 4);

        let x;
        let y;
        let velocityX;
        let velocityY;

        /*
         * Posición inicial dentro de la pantalla.
         */
        if (startVisible) {
            x = Math.random();
            y = Math.random();

            velocityX =
                (Math.random() - 0.5) *
                0.018;

            velocityY =
                (Math.random() - 0.5) *
                0.018;
        } else {
            /*
             * Entrada desde la parte superior.
             */
            if (side === 0) {
                x = Math.random();
                y = -0.08;

                velocityX =
                    (Math.random() - 0.5) *
                    0.012;

                velocityY =
                    0.008 +
                    Math.random() * 0.012;
            }

            /*
             * Entrada desde la derecha.
             */
            else if (side === 1) {
                x = 1.08;
                y = Math.random();

                velocityX =
                    -(
                        0.008 +
                        Math.random() * 0.012
                    );

                velocityY =
                    (Math.random() - 0.5) *
                    0.01;
            }

            /*
             * Entrada desde la parte inferior.
             */
            else if (side === 2) {
                x = Math.random();
                y = 1.08;

                velocityX =
                    (Math.random() - 0.5) *
                    0.012;

                velocityY =
                    -(
                        0.008 +
                        Math.random() * 0.012
                    );
            }

            /*
             * Entrada desde la izquierda.
             */
            else {
                x = -0.08;
                y = Math.random();

                velocityX =
                    0.008 +
                    Math.random() * 0.012;

                velocityY =
                    (Math.random() - 0.5) *
                    0.01;
            }
        }

        return {
            x,
            y,

            velocityX,
            velocityY,

            /*
             * Son más pequeños para permitir
             * una mayor cantidad sin saturar.
             */
            size: this.isMobile
                ? 6 + Math.random() * 6
                : 7 + Math.random() * 8,

            opacity: 0,

            targetOpacity:
                0.42 +
                Math.random() * 0.4,

            fadeSpeed:
                0.35 +
                Math.random() * 0.35,

            rotation:
                (Math.random() - 0.5) *
                1.2,

            rotationSpeed:
                (Math.random() - 0.5) *
                0.35,

            phase:
                Math.random() *
                Math.PI *
                2,

            swaySpeed:
                0.35 +
                Math.random() * 0.65,

            swayAmount:
                4 +
                Math.random() * 12,

            color:
                this.getRandomColor(),

            glow:
                Math.random() < 0.2
                    ? 4 + Math.random() * 5
                    : 0
        };
    }

    getRandomColor() {
        const probability =
            Math.random();

        if (probability < 0.48) {
            return "#ff559e";
        }

        if (probability < 0.72) {
            return "#ff8ac2";
        }

        if (probability < 0.86) {
            return "#c96cff";
        }

        if (probability < 0.95) {
            return "#83c3ff";
        }

        return "#ffffff";
    }

    update(deltaTime, width, height) {
        this.time += deltaTime;

        for (const heart of this.hearts) {
            heart.x +=
                heart.velocityX *
                deltaTime;

            heart.y +=
                heart.velocityY *
                deltaTime;

            heart.rotation +=
                heart.rotationSpeed *
                deltaTime;

            /*
             * Aparición gradual.
             */
            if (
                heart.opacity <
                heart.targetOpacity
            ) {
                heart.opacity +=
                    heart.fadeSpeed *
                    deltaTime;

                heart.opacity = Math.min(
                    heart.opacity,
                    heart.targetOpacity
                );
            }

            /*
             * Evita que los corazones ambientales
             * atraviesen el corazón principal
             * y el texto.
             */
            this.keepOutsideMainHeart(
                heart,
                width,
                height
            );

            /*
             * Cuando salen de la pantalla,
             * reaparecen por el lado contrario.
             */
            this.wrapAroundScene(heart);
        }
    }

    keepOutsideMainHeart(
        heart,
        width,
        height
    ) {
        if (!width || !height) {
            return;
        }

        const centerX = 0.5;

        const centerY =
            this.isMobile
                ? 0.46
                : 0.47;

        /*
         * Área protegida alrededor
         * del corazón grande.
         */
        const radiusX =
            this.isMobile
                ? 0.43
                : 0.31;

        const radiusY =
            this.isMobile
                ? 0.4
                : 0.39;

        const differenceX =
            heart.x - centerX;

        const differenceY =
            heart.y - centerY;

        const normalizedX =
            differenceX / radiusX;

        const normalizedY =
            differenceY / radiusY;

        const distance =
            Math.sqrt(
                normalizedX *
                    normalizedX +
                normalizedY *
                    normalizedY
            );

        /*
         * Si ya está fuera del área protegida,
         * no hacemos nada.
         */
        if (distance >= 1) {
            return;
        }

        let directionX;
        let directionY;

        /*
         * Evita un problema cuando el corazón
         * aparece exactamente en el centro.
         */
        if (distance < 0.001) {
            directionX =
                Math.cos(heart.phase);

            directionY =
                Math.sin(heart.phase);
        } else {
            directionX =
                normalizedX / distance;

            directionY =
                normalizedY / distance;
        }

        /*
         * Mueve el corazón flotante
         * hacia afuera de la zona protegida.
         */
        heart.x =
            centerX +
            directionX *
                radiusX *
                1.05;

        heart.y =
            centerY +
            directionY *
                radiusY *
                1.05;

        /*
         * Corrige su trayectoria para evitar
         * que vuelva inmediatamente al centro.
         */
        const movementTowardCenter =
            heart.velocityX *
                directionX +
            heart.velocityY *
                directionY;

        if (movementTowardCenter < 0) {
            heart.velocityX +=
                directionX * 0.012;

            heart.velocityY +=
                directionY * 0.012;
        }
    }

    wrapAroundScene(heart) {
        if (heart.x < -0.12) {
            heart.x = 1.12;
        }

        if (heart.x > 1.12) {
            heart.x = -0.12;
        }

        if (heart.y < -0.12) {
            heart.y = 1.12;
        }

        if (heart.y > 1.12) {
            heart.y = -0.12;
        }
    }

    draw(context, width, height) {
        for (const heart of this.hearts) {
            const movementX =
                Math.sin(
                    this.time *
                        heart.swaySpeed +
                    heart.phase
                ) *
                heart.swayAmount;

            const movementY =
                Math.cos(
                    this.time *
                        heart.swaySpeed *
                        0.75 +
                    heart.phase
                ) *
                heart.swayAmount *
                0.4;

            const pulse =
                0.96 +
                Math.sin(
                    this.time * 0.8 +
                    heart.phase
                ) *
                0.04;

            this.heartShape.draw(
                context,
                {
                    x:
                        heart.x *
                            width +
                        movementX,

                    y:
                        heart.y *
                            height +
                        movementY,

                    size:
                        heart.size *
                        pulse,

                    color:
                        heart.color,

                    opacity:
                        heart.opacity,

                    rotation:
                        heart.rotation,

                    glow:
                        heart.glow
                }
            );
        }
    }
}

export default HeartSystem;