class GlowEffect {
    constructor() {
        /*
         * El tamaño se detecta en cada cuadro,
         * permitiendo cambiar entre computadora
         * y teléfono sin desajustes.
         */
    }

    createHeartPath(
        width,
        height,
        layerScale = 1
    ) {
        const isMobile =
            width <= 700;

        const desiredWidth =
            Math.min(
                width * (
                    isMobile
                        ? 0.72
                        : 0.48
                ),
                height * (
                    isMobile
                        ? 0.66
                        : 0.78
                ),
                560
            );

        const baseScale =
            desiredWidth / 32;

        const centerX =
            width / 2;

        const centerY =
            height * (
                isMobile
                    ? 0.43
                    : 0.47
            );

        const path =
            new Path2D();

        const totalPoints = 260;

        for (
            let index = 0;
            index <= totalPoints;
            index++
        ) {
            const angle =
                (
                    index /
                    totalPoints
                ) *
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

            const x =
                centerX +
                normalizedX *
                baseScale *
                layerScale;

            const y =
                centerY -
                normalizedY *
                baseScale *
                layerScale;

            if (index === 0) {
                path.moveTo(x, y);
            } else {
                path.lineTo(x, y);
            }
        }

        path.closePath();

        return path;
    }

    draw(
        context,
        width,
        height,
        pulseIntensity = 0,
        heartScale = 1,
        visibility = 1
    ) {
        if (!context) {
            return;
        }

        const isMobile =
            width <= 700;

        const safeVisibility =
            Math.max(
                0,
                Math.min(
                    visibility,
                    1
                )
            );

        if (safeVisibility <= 0.001) {
            return;
        }

        const centerX =
            width / 2;

        const centerY =
            height * (
                isMobile
                    ? 0.43
                    : 0.47
            );

        const outerPath =
            this.createHeartPath(
                width,
                height,
                1
            );

        const innerPath =
            this.createHeartPath(
                width,
                height,
                isMobile
                    ? 0.93
                    : 0.94
            );

        context.save();

        /*
         * El halo crece junto con el latido.
         */
        context.translate(
            centerX,
            centerY
        );

        context.scale(
            heartScale,
            heartScale
        );

        context.translate(
            -centerX,
            -centerY
        );

        context.globalCompositeOperation =
            "screen";

        context.lineCap =
            "round";

        context.lineJoin =
            "round";

        if (isMobile) {
            /*
             * HALO PARA TELÉFONO
             *
             * Brillo rosa más visible,
             * sin dibujar un corazón morado
             * dentro de la figura.
             */
            const mobileOpacity =
                (
                    0.1 +
                    pulseIntensity * 0.09
                ) *
                safeVisibility;

            context.shadowColor =
                "rgba(255, 65, 155, 0.95)";

            context.shadowBlur =
                10 +
                pulseIntensity * 12;

            context.strokeStyle =
                `rgba(
                    255,
                    92,
                    168,
                    ${mobileOpacity}
                )`;

            context.lineWidth = 1.6;

            context.stroke(
                outerPath
            );

            /*
             * Segundo brillo exterior suave.
             */
            context.shadowColor =
                "rgba(255, 110, 190, 0.65)";

            context.shadowBlur =
                18 +
                pulseIntensity * 14;

            context.strokeStyle =
                `rgba(
                    255,
                    115,
                    188,
                    ${
                        (
                            0.045 +
                            pulseIntensity * 0.04
                        ) *
                        safeVisibility
                    }
                )`;

            context.lineWidth = 2.8;

            context.stroke(
                outerPath
            );

            context.restore();

            return;
        }

        /*
         * HALO ROSA PARA COMPUTADORA
         */
        const desktopPinkOpacity =
            (
                0.22 +
                pulseIntensity * 0.18
            ) *
            safeVisibility;

        context.shadowColor =
            "rgba(255, 60, 155, 0.95)";

        context.shadowBlur =
            24 +
            pulseIntensity * 28;

        context.strokeStyle =
            `rgba(
                255,
                92,
                168,
                ${desktopPinkOpacity}
            )`;

        context.lineWidth = 3.2;

        context.stroke(
            outerPath
        );

        context.stroke(
            innerPath
        );

        /*
         * HALO MORADO AMPLIO PARA COMPUTADORA
         */
        const desktopPurpleOpacity =
            (
                0.075 +
                pulseIntensity * 0.065
            ) *
            safeVisibility;

        context.shadowColor =
            "rgba(190, 75, 255, 0.82)";

        context.shadowBlur =
            36 +
            pulseIntensity * 32;

        context.strokeStyle =
            `rgba(
                204,
                98,
                255,
                ${desktopPurpleOpacity}
            )`;

        context.lineWidth = 6;

        context.stroke(
            outerPath
        );

        context.stroke(
            innerPath
        );

        context.restore();
    }
}

export default GlowEffect;