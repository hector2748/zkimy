class HeartShape {
    constructor() {
        this.points = [];
    }

    createPoints(totalPoints, width, height) {
        const isMobile = width <= 700;

        const desiredWidth = Math.min(
    width * (isMobile ? 0.72 : 0.48),
    height * (isMobile ? 0.66 : 0.78),
    560
);
        const baseScale = desiredWidth / 32;
        const centerX = width / 2;

        const centerY =
    height * (isMobile ? 0.43 : 0.47);

        /*
         * Solo dos líneas.
         * La segunda queda más cerca de la exterior.
         */
        const layers = isMobile
            ? [1, 0.93]
            : [1, 0.94];

        const totalLayerWeight = layers.reduce(
            (total, layerScale) => {
                return total + layerScale;
            },
            0
        );

        const points = [];
        let remainingPoints = totalPoints;

        layers.forEach((layerScale, layerIndex) => {
            const isLastLayer =
                layerIndex === layers.length - 1;

            const layerPointCount = isLastLayer
                ? remainingPoints
                : Math.round(
                    totalPoints *
                    (layerScale / totalLayerWeight)
                );

            remainingPoints -= layerPointCount;

            const layerPoints =
                this.createEvenLayerPoints(
                    layerPointCount,
                    layerScale,
                    baseScale,
                    centerX,
                    centerY,
                    layerIndex
                );

            points.push(...layerPoints);
        });

        this.points = points.slice(
            0,
            totalPoints
        );

        return this.points;
    }

    createEvenLayerPoints(
        totalPoints,
        layerScale,
        baseScale,
        centerX,
        centerY,
        layerIndex
    ) {
        const sampleCount = 1800;
        const sampledCurve = [];

        /*
         * Creamos muchos puntos temporales
         * sobre la curva para medir su longitud.
         */
        for (
            let index = 0;
            index <= sampleCount;
            index++
        ) {
            const angle =
                (index / sampleCount) *
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

            sampledCurve.push({
                x:
                    centerX +
                    normalizedX *
                    baseScale *
                    layerScale,

                y:
                    centerY -
                    normalizedY *
                    baseScale *
                    layerScale
            });
        }

        const accumulatedDistances = [0];
        let totalLength = 0;

        for (
            let index = 1;
            index < sampledCurve.length;
            index++
        ) {
            const previousPoint =
                sampledCurve[index - 1];

            const currentPoint =
                sampledCurve[index];

            totalLength += Math.hypot(
                currentPoint.x - previousPoint.x,
                currentPoint.y - previousPoint.y
            );

            accumulatedDistances.push(
                totalLength
            );
        }

        const result = [];

        /*
         * Desplazamos media posición la segunda línea
         * para que sus corazones queden intercalados.
         */
        const layerOffset =
            layerIndex % 2 === 0
                ? 0
                : 0.5;

        let curveIndex = 1;

        for (
            let index = 0;
            index < totalPoints;
            index++
        ) {
            const targetDistance =
                (
                    (index + layerOffset) /
                    totalPoints
                ) *
                totalLength;

            while (
                curveIndex <
                    accumulatedDistances.length - 1 &&
                accumulatedDistances[curveIndex] <
                    targetDistance
            ) {
                curveIndex++;
            }

            const previousDistance =
                accumulatedDistances[curveIndex - 1];

            const nextDistance =
                accumulatedDistances[curveIndex];

            const segmentLength = Math.max(
                nextDistance - previousDistance,
                0.0001
            );

            const progress =
                (
                    targetDistance -
                    previousDistance
                ) /
                segmentLength;

            const previousPoint =
                sampledCurve[curveIndex - 1];

            const nextPoint =
                sampledCurve[curveIndex];

            result.push({
                x:
                    previousPoint.x +
                    (
                        nextPoint.x -
                        previousPoint.x
                    ) *
                    progress,

                y:
                    previousPoint.y +
                    (
                        nextPoint.y -
                        previousPoint.y
                    ) *
                    progress
            });
        }

        return result;
    }
}

export default HeartShape;